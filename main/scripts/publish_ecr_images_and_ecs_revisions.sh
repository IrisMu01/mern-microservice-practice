#!/bin/bash

dotAwsPath="$1"

cd ../back-end/ || exit

# copy contents of /.aws folder to the current directory
cp -r "$dotAwsPath" .

authServiceVersion="0.0.7"
userServiceVersion="0.0.1"
logServiceVersion="0.0.1"
gameServiceVersion="0.0.1"

authServiceTag="main-auth-service:$authServiceVersion"
userServiceTag="main-user-service:$userServiceVersion"
logServiceTag="main-log-service:$logServiceVersion"
gameServiceTag="main-game-service:$gameServiceVersion"

ecrRootURL="public.ecr.aws/q6t4w2n1/"

docker build -t "$authServiceTag" -f ./auth.Dockerfile .
#docker build -t "$userServiceTag" -f ./user.Dockerfile .
#docker build -t "$logServiceTag" -f ./log.Dockerfile .
#docker build -t "$gameServiceTag" -f ./game.Dockerfile .

docker tag "$authServiceTag" "$ecrRootURL$authServiceTag"
#docker tag "$userServiceTag" "$ecrRootURL$userServiceTag"
#docker tag "$logServiceTag" "$ecrRootURL$logServiceTag"
#docker tag "$gameServiceTag" "$ecrRootURL$gameServiceTag"

echo "---------- pushing to ecr -----------"

# if script fails at docker push, try running the below locally in the terminal to authenticate to the public ECR:
#aws ecr-public get-login-password --debug --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/q6t4w2n1/

docker push "$ecrRootURL$authServiceTag"
#docker push "$ecrRootURL$userServiceTag"
#docker push "$ecrRootURL$logServiceTag"
#docker push "$ecrRootURL$gameServiceTag"

# automatically create ECS task definitions based on new image
cd ../scripts/ || exit
python3 boto3/create_task_definition_revision.py --ecs_task_definition=auth-service --ecr_new_image_tag=$authServiceTag

# delete copied .aws directory
cd ../back-end/ || exit
rm -r ./.aws

cd ../scripts/ || exit
