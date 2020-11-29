module.exports.handler = (event, context, callback) => {
  const { authorizationToken, methodArn } = event;

  console.log(event);

  if (!authorizationToken) {
    callback('Unauthorized');
  }

  try {
   const userData = getUserData(authorizationToken);
    console.log(userData);

    const password =  process.env[userData.name];
    const effect = password === userData.password ? 'Allow' : 'Deny';

    callback(null, generatePolicy(userData.name, effect, methodArn));
  } catch(error) {
    console.log(error);
    callback('Unauthorized');
  }
};

function getUserData(token) {
  const buffer = Buffer.from(token.split(' ')[1], 'base64');
  const user = buffer.toString('utf-8').split(':');

  return {
    name: user[0],
    password: user[1]
  };
}

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
