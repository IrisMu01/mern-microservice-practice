const { SQSClient, GetQueueUrlCommand } = require("@aws-sdk/client-sqs");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const config = require("./config");

const connect = async () => {
    const client = new SQSClient({
        region: "us-east-1",
        credentials: fromIni({
            filepath: `${config["DOT_AWS_PATH"]}/credentials`,
            configFilepath: `${config["DOT_AWS_PATH"]}/config`
        }),
    });
    const response = await client.send(new GetQueueUrlCommand({ QueueName: "untitled-mern-game" }));
    return {
        client: client,
        url: response.QueueUrl
    };
};

exports.connect = connect;
