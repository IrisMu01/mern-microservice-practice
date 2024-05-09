#!/bin/env python

'''
Given arguments describing the ECR repo, ECR image tag, and the target ECS task definition,
Create a revision of the target ECS task definition with the specified ECR image.
Nothing else is changed within the task definition - these for now are left as
manual todos in the AWS console.
'''

import argparse
import datetime

import boto3
from botocore.config import Config
parser = argparse.ArgumentParser()
parser.add_argument("--ecr_repo_name", type=str, help='ECR repository name')
parser.add_argument("--ecr_image_tag", type=str, help='Image tag in the ECR repository')
parser.add_argument("--ecs_task_definition", type=str, help='The ECS task definition\'s name')

# reference: https://stackoverflow.com/questions/69830579/aws-ecs-using-boto3-to-update-a-task-definition
# todo call ecs.describe_task_definition

# todo update task definition json

# todo call ecs.register_task_definition
