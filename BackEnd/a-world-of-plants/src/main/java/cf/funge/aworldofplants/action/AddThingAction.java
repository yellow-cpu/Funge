package cf.funge.aworldofplants.action;

import cf.funge.aworldofplants.configuration.ExceptionMessages;
import cf.funge.aworldofplants.exception.BadRequestException;
import cf.funge.aworldofplants.exception.InternalErrorException;
import cf.funge.aworldofplants.model.action.AddThingRequest;
import cf.funge.aworldofplants.model.action.AddThingResponse;
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

/**
 * Created by Dillon on 2016-09-01.
 */
public class AddThingAction extends AbstractAction {
    private LambdaLogger logger;

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

        System.out.println(input.getThingName());
        System.out.println(input.getUsername());
        System.out.println(input.getPlantId());

        /*AWSIotClient awsIotClient = new AWSIotClient();

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

        // Attach policy to certificate
        AttachPrincipalPolicyRequest attachPrincipalPolicyRequest = new AttachPrincipalPolicyRequest();
        attachPrincipalPolicyRequest.setPolicyName(policyName);
        attachPrincipalPolicyRequest.setPrincipal(createKeysAndCertificateResult.getCertificateArn());
        AttachPrincipalPolicyResult attachPrincipalPolicyResult = awsIotClient.attachPrincipalPolicy(attachPrincipalPolicyRequest);

        // Attach thing principal request
        AttachThingPrincipalRequest attachThingPrincipalRequest = new AttachThingPrincipalRequest();
        attachThingPrincipalRequest.setThingName(input.getThingName());
        attachThingPrincipalRequest.setPrincipal(createKeysAndCertificateResult.getCertificateArn());
        //attachThingPrincipalRequest.setPrincipal(createKeysAndCertificateResult.getKeyPair().getPrivateKey());
        //attachThingPrincipalRequest.setPrincipal(createKeysAndCertificateResult.getKeyPair().getPublicKey());
        AttachThingPrincipalResult attachThingPrincipalResult = awsIotClient.attachThingPrincipal(attachThingPrincipalRequest);

        System.out.println(createKeysAndCertificateResult.getCertificatePem());
        System.out.println(createKeysAndCertificateResult.getKeyPair());
        System.out.println(attachThingPrincipalResult.toString());

        AmazonS3Client amazonS3Client = new AmazonS3Client();

        try {
            byte[] contentAsBytes = createKeysAndCertificateResult.getCertificatePem().getBytes("UTF-8");
            ByteArrayInputStream contentsAsStream = new ByteArrayInputStream(contentAsBytes);
            ObjectMetadata md = new ObjectMetadata();
            md.setContentLength(contentAsBytes.length);
            amazonS3Client.putObject(new PutObjectRequest("a-world-of-plants-thing-credentials", input.getThingName() + "-cert.pem.crt", contentsAsStream, md));
        } catch(AmazonServiceException ex) {
        } catch(Exception ex) {
        }
*/
        AddThingResponse output = new AddThingResponse();
        //output.setThingArn(createThingResult.getThingArn());
        output.setThingArn("testArn");

        return getGson().toJson(output);
    }
}
