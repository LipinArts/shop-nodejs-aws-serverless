import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent ) : Promise<APIGatewayAuthorizerResult> => {
  try {
    console.log("basicAuthorizer", event);
    const { authorizationToken, methodArn } = event;
    const token = authorizationToken.split(" ")[1];
    console.log("token", token);
    const [login, password] = Buffer.from(token, "base64").toString().split(":");
    console.log("login: ", login);
    console.log("password: ", password);
    const isAuthorized = process.env[login] === password && password;
    const authEffect = isAuthorized ? "Allow" : "Deny";

    return {
      principalId: authorizationToken,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Resource: [methodArn],
            Effect: authEffect,
          },
        ],
      },
    };
  }
  catch(error) {
    console.log(error);
  }
};
