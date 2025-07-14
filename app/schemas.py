from typing import Optional, Dict, Any

from pydantic import BaseModel

class FlightSearchQuery(BaseModel):
    departure_city: str
    destination_city: str
    from_date: str
    to_date: str
    options: Optional[Dict[str, Any]] = {}
