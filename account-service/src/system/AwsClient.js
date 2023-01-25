const AWS = require("aws-sdk");

// eslint-disable-next-line no-unused-vars
async function getSecrets(config) {
  if (config.local) {
    return config.secrets;
  }

  return new Promise((resolve, reject) => {
    const client = new AWS.SecretsManager({
      region: config.aws.region,
      secretsName: config.aws.secretsName,
    });

    client.getSecretValue(
      { SecretId: config.aws.secretsName },
      (error, data) => {
        if (error) {
          return reject(error);
        }

        let secret;
        if ("SecretString" in data) {
          secret = data.SecretString;
        } else {
          // eslint-disable-next-line no-buffer-constructor
          const buffer = new Buffer(data.SecretBinary, "base64");
          secret = buffer.toString("askii");
        }

        return resolve(JSON.parse(secret));
      }
    );
  });
}

module.exports = { getSecrets };
