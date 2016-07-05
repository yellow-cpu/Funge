/*
 * Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 * with the License. A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
 * OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
package cf.funge.aworldofplants.configuration;

/**
 * Configuration parameters for the Cognito credentials provider
 */
public class CognitoConfiguration {
    // TODO: Specify the identity pool id
    public static final String IDENTITY_POOL_ID = "us-east-1:01d06c3d-957e-4db3-a37b-35d7b3e6bef5";
    // TODO: Specify the custom provider name used by the identity pool
    public static final String CUSTOM_PROVIDER_NAME = "cf.funge.aworldofplants";

    // This should not be changed, it is a default value for Cognito.
    public static final String COGNITO_PROVIDER_NAME = "cognito-identity.amazonaws.com";
}
