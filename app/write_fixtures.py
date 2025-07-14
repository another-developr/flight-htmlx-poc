from datetime import timedelta, date, datetime
import random
import boto3

from flight_data_generator import flight_data

session = boto3.session.Session()
dynamodb = session.resource('dynamodb')
table = dynamodb.Table('FlightTable')


def generate_dates():
    departure_date = datetime.now() + timedelta(days=random.randint(1, 30))
    return_date = departure_date + timedelta(days=random.randint(7, 14))
    return departure_date, return_date

def load_fixtures():
    for flight in flight_data(
        source="London",
        sink="Amsterdam",
        departure_date=date(2024, 10, 3),
        return_date=date(2024, 10, 10),
    ):
        flight['departure_dt'] =  str(flight['departure_dt'])
        flight['arrival_dt'] =  str(flight['arrival_dt'])
        table.put_item(Item=flight)
    print("Fixtures loaded successfully")

if __name__ == '__main__':
    load_fixtures()