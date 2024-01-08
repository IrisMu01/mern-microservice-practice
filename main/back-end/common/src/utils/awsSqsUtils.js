const { SQSClient, GetQueueUrlCommand } = require("@aws-sdk/client-sqs");

const connect = async () => {
    const client = new SQSClient({ region: "us-east-1" });
    const response = await client.send(new GetQueueUrlCommand({ QueueName: "untitled-mern-game" }));
    return {
        client: client,
        url: response.QueueUrl
    };
};

exports.connect = connect;
