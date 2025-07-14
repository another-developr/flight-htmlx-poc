from aws_cdk import (
    # Duration,
    Stack,
    # aws_sqs as sqs,
    aws_dynamodb as dynamodb
)
from constructs import Construct

class InfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.flight_table = dynamodb.Table(
            self, "FlightTable",
            partition_key=dynamodb.Attribute(
                name="flight_id",
                type=dynamodb.AttributeType.STRING
            ),
            table_name="FlightTable"
        )

        self.flight_table.add_global_secondary_index(
            index_name="AirlineIndex",
            partition_key=dynamodb.Attribute(
                name="airline",
                type=dynamodb.AttributeType.STRING
            ),
            projection_type=dynamodb.ProjectionType.ALL
        )

