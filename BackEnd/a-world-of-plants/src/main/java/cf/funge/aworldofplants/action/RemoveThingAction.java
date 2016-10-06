package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.RemoveThingRequest;
import cf.funge.aworldofplants.model.action.RemoveThingResponse;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import cf.funge.aworldofplants.model.timeline.TimelineDAO;
import cf.funge.aworldofplants.model.timeline.TimelineEvent;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserDAO;
import com.amazonaws.services.iot.AWSIotClient;
import com.amazonaws.services.iot.model.*;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.google.gson.JsonObject;
import org.omg.PortableInterceptor.INACTIVE;

/**
 * Created by Dillon on 2016-09-07.
 */
public class RemoveThingAction extends AbstractAction {
    private static LambdaLogger logger;

    void deleteObjectsInFolder(AmazonS3Client amazonS3Client, String bucketName, String folderPath) {
        for (S3ObjectSummary file : amazonS3Client.listObjects(bucketName, folderPath).getObjectSummaries()){
            amazonS3Client.deleteObject(bucketName, file.getKey());
        }
    }

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        RemoveThingRequest input = getGson().fromJson(request, RemoveThingRequest.class);

        if (input == null ||
                input.getThingName() == null ||
                input.getThingName().trim().equals("") ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        ThingDAO dao = DAOFactory.getThingDAO();
        TimelineDAO timelineDAO = DAOFactory.getTimelineDAO();

        Thing thing;
        try {
            thing = dao.getThingByName(input.getThingName());
        } catch (final DAOException e) {
            logger.log("Error while fetching thing with name " + input.getThingName() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        // Add thing removal timeline event
        TimelineEvent timelineEvent = new TimelineEvent();
        timelineEvent.setUsername(thing.getUsername());
        timelineEvent.setTitle("Removed a Plant Box");
        timelineEvent.setMessage("You removed your plant box called " + thing.getThingName());
        timelineEvent.setCategory("thing-delete");
        timelineEvent.setTimestamp((int) (System.currentTimeMillis() / 1000L));
        timelineEvent.setPointValue(0);

        // Store event in database
        String timelineEventId;
        try {
            timelineEventId = timelineDAO.createTimelineEvent(timelineEvent);
        } catch (final DAOException e) {
            logger.log("Error while creating new timeline event\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        if (timelineEventId == null || timelineEventId.trim().equals("")) {
            logger.log("TimelineEventId is null or empty");
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        String policyName = thing.getPolicyName();
        String certificateArn = thing.getCertificateArn();
        String thingName = thing.getThingName();
        String certificateId = thing.getCertificateId();

        AWSIotClient awsIotClient = new AWSIotClient();

        // Detach principal (certificate) from policy
        DetachPrincipalPolicyRequest detachPrincipalPolicyRequest = new DetachPrincipalPolicyRequest();
        detachPrincipalPolicyRequest.setPolicyName(policyName);
        detachPrincipalPolicyRequest.setPrincipal(certificateArn);
        DetachPrincipalPolicyResult detachPrincipalPolicyResult = awsIotClient.detachPrincipalPolicy(detachPrincipalPolicyRequest);

        // Detach principal (user identity) from policy
        UserDAO userDAO = DAOFactory.getUserDAO();
        User user;
        try {
            user = userDAO.getUserByName(input.getUsername());
        } catch (final DAOException e) {
            logger.log("Error while fetching user with username " + input.getUsername() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }
        detachPrincipalPolicyRequest = new DetachPrincipalPolicyRequest();
        detachPrincipalPolicyRequest.setPolicyName(policyName);
        detachPrincipalPolicyRequest.setPrincipal(user.getIdentity().getIdentityId());
        detachPrincipalPolicyResult = awsIotClient.detachPrincipalPolicy(detachPrincipalPolicyRequest);

        //Detach thing from principal (certificate)
        DetachThingPrincipalRequest detachThingPrincipalRequest = new DetachThingPrincipalRequest();
        detachThingPrincipalRequest.setThingName(thingName);
        detachThingPrincipalRequest.setPrincipal(certificateArn);
        DetachThingPrincipalResult detachThingPrincipalResult = awsIotClient.detachThingPrincipal(detachThingPrincipalRequest);

        // De-activate certificate
        UpdateCertificateRequest updateCertificateRequest = new UpdateCertificateRequest();
        updateCertificateRequest.setCertificateId(certificateId);
        updateCertificateRequest.setNewStatus("INACTIVE");
        UpdateCertificateResult updateCertificateResult = awsIotClient.updateCertificate(updateCertificateRequest);

        // Delete certificate
        DeleteCertificateRequest deleteCertificateRequest = new DeleteCertificateRequest();
        deleteCertificateRequest.setCertificateId(certificateId);
        DeleteCertificateResult deleteCertificateResult = awsIotClient.deleteCertificate(deleteCertificateRequest);

        // Delete thing
        DeleteThingRequest deleteThingRequest = new DeleteThingRequest();
        deleteThingRequest.setThingName(thingName);
        DeleteThingResult deleteThingResult = awsIotClient.deleteThing(deleteThingRequest);

        // Delete policy
        DeletePolicyRequest deletePolicyRequest = new DeletePolicyRequest();
        deletePolicyRequest.setPolicyName(policyName);
        DeletePolicyResult deletePolicyResult = awsIotClient.deletePolicy(deletePolicyRequest);

        // Delete files from S3
        AmazonS3Client amazonS3Client = new AmazonS3Client();
        String folderPath = input.getUsername() + "/" + input.getThingName() + "/";
        deleteObjectsInFolder(amazonS3Client, "a-world-of-plants-thing-credentials", folderPath);

        System.out.println(folderPath);

        // Remove thing from database
        dao.deleteThing(input.getThingName());

        RemoveThingResponse output = new RemoveThingResponse();
        output.setSuccess(true);

        return getGson().toJson(output);
    }
}
