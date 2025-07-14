import traceback
from typing import List, Dict

import boto3
from boto3.dynamodb.conditions import Attr
from fastapi import APIRouter, HTTPException
from app.schemas import FlightSearchQuery
router = APIRouter()

session = boto3.session.Session()
dynamodb = session.resource('dynamodb')
table = dynamodb.Table('FlightTable')

def filter_stops(stops: int, filter_expression):
    if stops is None:
        return filter_expression
    if stops == 0:
        return filter_expression & Attr('number_of_stops').eq(0)
    return filter_expression & Attr('number_of_stops').lte(stops)


def filter_airlines(airlines: List[str], filter_expression):
    if not airlines:
        return filter_expression
    return filter_expression & Attr('airline').is_in(airlines)


def sort_flights(sort_kw: str, flights: List[Dict]) -> List[Dict]:
    if not sort_kw:
        return flights
    if sort_kw == "-":
        return flights
    if not flights or sort_kw not in flights[0] :
        return flights

    return sorted(flights, key=lambda flight: flight.get(sort_kw))


@router.post("/flights/search")
def search_flights_route(query: FlightSearchQuery):
    try:
        filter_expression = (
                Attr('source').eq(query.departure_city) &
                Attr('sink').eq(query.destination_city)
        )

        stops = query.options.get("stops")
        airlines = query.options.get("airlines")
        sort_kw = query.options.get("sorting")
        filter_expression = filter_stops(stops, filter_expression)
        filter_expression = filter_airlines(airlines, filter_expression)

        response = table.scan(FilterExpression=filter_expression)
        flights = response.get('Items', [])
        flights = sort_flights(sort_kw, flights)
        return {"flights": flights}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))