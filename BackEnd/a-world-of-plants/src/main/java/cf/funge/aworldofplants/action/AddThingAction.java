package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.AddThingRequest;
import cf.funge.aworldofplants.model.action.AddThingResponse;
import cf.funge.aworldofplants.model.plant.Plant;
import cf.funge.aworldofplants.model.plant.PlantDAO;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import cf.funge.aworldofplants.model.timeline.TimelineDAO;
import cf.funge.aworldofplants.model.timeline.TimelineEvent;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserDAO;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.iot.model.*;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.iot.*;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.gson.JsonObject;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;

public class AddThingAction extends AbstractAction {
    private LambdaLogger logger;

    public Boolean uploadFile(String fileContent, String fileName, AmazonS3Client amazonS3Client) {
        try {
            byte[] contentAsBytes = fileContent.getBytes("UTF-8");
            ByteArrayInputStream contentsAsStream = new ByteArrayInputStream(contentAsBytes);
            ObjectMetadata md = new ObjectMetadata();
            md.setContentLength(contentAsBytes.length);
            amazonS3Client.putObject(new PutObjectRequest("a-world-of-plants-thing-credentials", fileName, contentsAsStream, md));
            return true;
        } catch(AmazonServiceException ex) {
            return false;
        } catch(Exception ex) {
            return false;
        }
    }

    public String handle(JsonObject request, Context lambdaContext) throws BadRequestException, InternalErrorException {
        logger = lambdaContext.getLogger();

        AddThingRequest input = getGson().fromJson(request, AddThingRequest.class);

        if (input == null ||
                input.getThingName() == null ||
                input.getThingName().trim().equals("") ||
                input.getUsername() == null ||
                input.getUsername().trim().equals("") ||
                input.getPlantId() == null ||
                input.getPlantId().trim().equals("")) {
            throw new BadRequestException(ExceptionMessages.EX_INVALID_INPUT);
        }

        AWSIotClient awsIotClient = new AWSIotClient();

        // Create thing
        CreateThingRequest createThingRequest = new CreateThingRequest();
        createThingRequest.setThingName(input.getThingName());
        CreateThingResult createThingResult = awsIotClient.createThing(createThingRequest);

        // Create keys and certificate
        CreateKeysAndCertificateRequest createKeysAndCertificateRequest = new CreateKeysAndCertificateRequest();
        createKeysAndCertificateRequest.setSetAsActive(true);
        CreateKeysAndCertificateResult createKeysAndCertificateResult =  awsIotClient.createKeysAndCertificate(createKeysAndCertificateRequest);

        // Create policy
        String policyName = input.getThingName() +  "-Policy";
        CreatePolicyRequest createPolicyRequest = new CreatePolicyRequest();
        createPolicyRequest.setPolicyName(policyName);
        createPolicyRequest.setPolicyDocument(
            "{\n" +
            "  \"Version\": \"2012-10-17\",\n" +
            "  \"Statement\": [\n" +
            "    {\n" +
            "      \"Action\": [\n" +
            "        \"iot:*\"\n" +
            "      ],\n" +
            "      \"Resource\": [\n" +
            "        \"*\"\n" +
            "      ],\n" +
            "      \"Effect\": \"Allow\"\n" +
            "    }\n" +
            "  ]\n" +
            "}"
        );
        CreatePolicyResult createPolicyResult = awsIotClient.createPolicy(createPolicyRequest);

        // Attach principal (certificate) to policy
        AttachPrincipalPolicyRequest attachPrincipalPolicyRequest = new AttachPrincipalPolicyRequest();
        attachPrincipalPolicyRequest.setPolicyName(policyName);
        attachPrincipalPolicyRequest.setPrincipal(createKeysAndCertificateResult.getCertificateArn());
        AttachPrincipalPolicyResult attachPrincipalPolicyResult = awsIotClient.attachPrincipalPolicy(attachPrincipalPolicyRequest);

        // Attach principal (user identity) to policy
        UserDAO userDAO = DAOFactory.getUserDAO();
        User user;
        try {
            user = userDAO.getUserByName(input.getUsername());
        } catch (final DAOException e) {
            logger.log("Error while fetching user with username " + input.getUsername() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }
        attachPrincipalPolicyRequest = new AttachPrincipalPolicyRequest();
        attachPrincipalPolicyRequest.setPolicyName(policyName);
        attachPrincipalPolicyRequest.setPrincipal(user.getIdentity().getIdentityId());
        attachPrincipalPolicyResult = awsIotClient.attachPrincipalPolicy(attachPrincipalPolicyRequest);

        // Attach thing principal request
        AttachThingPrincipalRequest attachThingPrincipalRequest = new AttachThingPrincipalRequest();
        attachThingPrincipalRequest.setThingName(input.getThingName());
        attachThingPrincipalRequest.setPrincipal(createKeysAndCertificateResult.getCertificateArn());
        AttachThingPrincipalResult attachThingPrincipalResult = awsIotClient.attachThingPrincipal(attachThingPrincipalRequest);

        AmazonS3Client amazonS3Client = new AmazonS3Client();

        String path = input.getUsername() + "/" + input.getThingName() + "/" + input.getThingName();
        List<String> files = new ArrayList<>();
        files.add(path + "-cert.pem.crt");
        files.add(path + "-private.pem.key");
        files.add(path + "-public.pem.key");

        uploadFile(createKeysAndCertificateResult.getCertificatePem(), files.get(0), amazonS3Client);
        uploadFile(createKeysAndCertificateResult.getKeyPair().getPrivateKey(), files.get(1), amazonS3Client);
        uploadFile(createKeysAndCertificateResult.getKeyPair().getPublicKey(), files.get(2), amazonS3Client);

        //ToDo: if thingName already exists throw BadRequestException
        //ToDo: store location of files in database
        //ToDo: return thing id rather than thing ARN

        ThingDAO thingDAO = DAOFactory.getThingDAO();

        Thing newThing = new Thing();
        newThing.setThingName(input.getThingName());
        newThing.setUsername(input.getUsername());
        newThing.setPlantId(input.getPlantId());
        newThing.setPolicyName(policyName);
        newThing.setCertificateArn(createKeysAndCertificateResult.getCertificateArn());
        newThing.setCertificateId(createKeysAndCertificateResult.getCertificateId());
        newThing.setMqttTopic("$aws/things/" + input.getThingName() + "/shadow/update");
        newThing.setColour(input.getColour());

        for (int i = 0; i < files.size(); ++i) {
            files.set(i, "https://s3.amazonaws.com/a-world-of-plants-thing-credentials/" + files.get(i));
        }

        newThing.setFiles(files);

        String thingId;

        try {
            thingId = thingDAO.createThing(newThing);
        } catch (final DAOException e) {
            logger.log("Error while creating new thing\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        if (thingId == null || thingId.trim().equals("")) {
            logger.log("ThingID is null or empty");
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        AddThingResponse output = new AddThingResponse();
        output.setThingArn(createThingResult.getThingArn());

        // Add thing timeline event
        TimelineDAO timelineDAO = DAOFactory.getTimelineDAO();
        PlantDAO plantDAO = DAOFactory.getPlantDAO();
        try {
            // Get the plant associated with the thing
            Plant plant = plantDAO.getPlantById(input.getPlantId());

            TimelineEvent timelineEvent = new TimelineEvent();
            timelineEvent.setUsername(input.getUsername());
            timelineEvent.setTitle("Created a Plant Box");
            timelineEvent.setMessage("You created a new Plant Box called " + input.getThingName() +
                    " and associated it with your " + plant.getPlantType() + " called " + plant.getPlantName() +
                    ".");
            timelineEvent.setCategory("thing-create");
            timelineEvent.setTimestamp((int) (System.currentTimeMillis() / 1000L));
            timelineEvent.setPointValue(75);

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
        } catch (DAOException e) {
            e.printStackTrace();
        }

        return getGson().toJson(output);
    }
}
