#no longer maintained; I've switched to developing on MacOS
param ($dotAwsPath)

cd ../back-end/

# copy contents of /.aws folder to the current directory
Copy-Item -Path $dotAwsPath -Destination "." -Recurse

$authServiceVersion = "0.0.3"
$userServiceVersion = "0.0.1"
$logServiceVersion = "0.0.1"
$gameServiceVersion = "0.0.1"

$authServiceTag = "main-auth-service:" + $authServiceVersion
$userServiceTag = "main-user-service:" + $userServiceVersion
$logServiceTag = "main-log-service:" + $logServiceVersion
$gameServiceTag = "main-game-service:" + $gameServiceVersion

$ecrRootURL = "public.ecr.aws/q6t4w2n1/"

docker build -t $authServiceTag -f ./auth.Dockerfile .
#docker build -t $userServiceTag -f ./user.Dockerfile .
#docker build -t $logServiceTag -f ./log.Dockerfile .
#docker build -t $gameServiceTag -f ./game.Dockerfile .

docker tag $authServiceTag ($ecrRootURL + $authServiceTag)
#docker tag $userServiceTag ($ecrRootURL + $userServiceTag)
#docker tag $logServiceTag ($ecrRootURL + $logServiceTag)
#docker tag $gameServiceTag ($ecrRootURL + $gameServiceTag)

docker push ($ecrRootURL + $authServiceTag)
#docker push ($ecrRootURL + $userServiceTag)
#docker push ($ecrRootURL + $logServiceTag)
#docker push ($ecrRootURL + $gameServiceTag)

# delete copied .aws directory
Remove-Item -Path "./.aws" -Recurse

cd ../scripts/
