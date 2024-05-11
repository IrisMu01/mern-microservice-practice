#!/bin/env python

"""
Given arguments describing the new ECR image tag and the target ECS task definition,
Create a revision of the target ECS task definition with the specified ECR image.
Nothing else is changed within the task definition - these for now are left as
manual todos in the AWS console.

This script assumes that in the task definition's container definitions, there is only one
and essential container.
"""

import argparse
import json

import boto3
from botocore.config import Config
parser = argparse.ArgumentParser()
parser.add_argument("--ecr_new_image_tag", type=str, help='The new image tag in the ECR repository')
parser.add_argument("--ecs_task_definition", type=str, help='The ECS task definition\'s name')
args = parser.parse_args()

print(f"{args}")

boto_config = Config(
    region_name='us-east-1'
)
ecs = boto3.client('ecs', config=boto_config)

# reference: https://stackoverflow.com/questions/69830579/aws-ecs-using-boto3-to-update-a-task-definition
# call ecs.describe_task_definition
task_definition = ecs.describe_task_definition(
    taskDefinition=args.ecs_task_definition
)
print(f"Fetching task definition for {args.ecs_task_definition}")
#print(f"---------------- ECS describe task definition result -------------------")
#print(json.dumps(task_definition, indent=2, default=str))
#print("\n--------------------------------------------------\n\n")

# update task definition json
original_image = task_definition["taskDefinition"]["containerDefinitions"][0]["image"]
updated_image = "/".join(
    original_image.split("/")[:-1] + [args.ecr_new_image_tag])
new_task_definition = task_definition["taskDefinition"]
new_task_definition["containerDefinitions"][0]["image"] = updated_image
remove_args = ["compatibilities", "registeredAt", "registeredBy", "status", "revision", "taskDefinitionArn", "requiresAttributes"]
for arg in remove_args:
    new_task_definition.pop(arg)

# call ecs.register_task_definition
revision_definition = ecs.register_task_definition(
    **new_task_definition
)
revision_arn = revision_definition["taskDefinition"]["taskDefinitionArn"]
print(f"Task definition revision {revision_arn} with image {args.ecr_new_image_tag} created")
#print(f"---------------- ECS revised task definition -------------------")
#print(revision_definition)
#print("\n--------------------------------------------------\n\n")
