#!/bin/env python

import argparse
import boto3
from botocore.config import Config

parser = argparse.ArgumentParser()
parser.add_argument('--task_uuid', type=str, help='Task UUID')
parser.add_argument("--task_definition", type=str, help='Task definition')
args = parser.parse_args()

print(f"{args}")

boto_config = Config(
    region_name='us-east-1'
)

ecs_client = boto3.client('ecs', config=boto_config)
response = ecs_client.describe_tasks(
    cluster='UntitledGameCluster2',
    tasks=[
        args.task_uuid
    ]
)
print(f"------------ ECS describe task result ----------------\n")
print(response)
print("\n-----------------------------------")

logs_client = boto3.client('logs', config=boto_config)
log_response = logs_client.get_log_events(
    logGroupName=f"/ecs/{args.task_definition}",
    logStreamName=f"ecs/{args.task_definition}/{args.task_uuid}",
    startFromHead=True,
    limit=100
)
print(f"------------ Task Log stream result ----------------\n")
print(log_response)
print("\n-----------------------------------")
