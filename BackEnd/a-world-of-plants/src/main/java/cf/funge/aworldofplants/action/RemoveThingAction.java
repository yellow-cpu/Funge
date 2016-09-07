package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.DAOException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.DAOFactory;
import cf.funge.aworldofplants.model.action.RemoveThingRequest;
import cf.funge.aworldofplants.model.action.RemoveThingResponse;
import cf.funge.aworldofplants.model.thing.Thing;
import cf.funge.aworldofplants.model.thing.ThingDAO;
import cf.funge.aworldofplants.model.user.User;
import cf.funge.aworldofplants.model.user.UserDAO;
import com.amazonaws.services.iot.AWSIotClient;
import com.amazonaws.services.iot.model.*;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.JsonObject;
import org.omg.PortableInterceptor.INACTIVE;

/**
 * Created by Dillon on 2016-09-07.
 */
public class RemoveThingAction extends AbstractAction {
    private static LambdaLogger logger;

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
        Thing thing;
        try {
            thing = dao.getThingByName(input.getThingName());
        } catch (final DAOException e) {
            logger.log("Error while fetching thing with name " + input.getThingName() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }

        String policyName = thing.getPolicyName();
        String certificateArn = thing.getCertificateArn();
        String thingName = thing.getThingName();
        String certificateId = thing.getCertificateId();

        AWSIotClient awsIotClient = new AWSIotClient();

       /* // Detach principal (certificate) from policy
        DetachPrincipalPolicyRequest detachPrincipalPolicyRequest = new DetachPrincipalPolicyRequest();
        detachPrincipalPolicyRequest.setPolicyName(policyName);
        detachPrincipalPolicyRequest.setPrincipal(certificateArn);
        DetachPrincipalPolicyResult detachPrincipalPolicyResult = awsIotClient.detachPrincipalPolicy(detachPrincipalPolicyRequest);*/

        // Detach principal (user identity) from policy
        UserDAO userDAO = DAOFactory.getUserDAO();
        User user;
        try {
            user = userDAO.getUserByName(input.getUsername());
        } catch (final DAOException e) {
            logger.log("Error while fetching user with username " + input.getUsername() + "\n" + e.getMessage());
            throw new InternalErrorException(ExceptionMessages.EX_DAO_ERROR);
        }
        System.out.println("USER ID OVER HERE PLS: " + user.getIdentity().getIdentityId());

        DetachPrincipalPolicyRequest detachPrincipalPolicyRequest;
        DetachPrincipalPolicyResult detachPrincipalPolicyResult;
        detachPrincipalPolicyRequest = new DetachPrincipalPolicyRequest();
        detachPrincipalPolicyRequest.setPolicyName(policyName);
        detachPrincipalPolicyRequest.setPrincipal(user.getIdentity().getIdentityId());
        detachPrincipalPolicyResult = awsIotClient.detachPrincipalPolicy(detachPrincipalPolicyRequest);

        /*//Detach thing from principal (certificate)
        DetachThingPrincipalRequest detachThingPrincipalRequest = new DetachThingPrincipalRequest();
        detachThingPrincipalRequest.setThingName(thingName);
        detachThingPrincipalRequest.setPrincipal(certificateArn);
        DetachThingPrincipalResult detachThingPrincipalResult = awsIotClient.detachThingPrincipal(detachThingPrincipalRequest);

        // De-activate certificate
        UpdateCertificateRequest updateCertificateRequest = new UpdateCertificateRequest();
        updateCertificateRequest.setCertificateId(certificateId);
        CertificateStatus certificateStatus = CertificateStatus.INACTIVE;
        updateCertificateRequest.setNewStatus(certificateStatus);

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

        // Remove thing from database
        dao.deleteThing(input.getThingId());*/

        RemoveThingResponse output = new RemoveThingResponse();
        output.setSuccess(true);

        return getGson().toJson(output);
    }
}
