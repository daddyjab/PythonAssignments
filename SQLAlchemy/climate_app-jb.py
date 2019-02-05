import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the tables
Station = Base.classes.station
Measurement = Base.classes.measurement

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    """List all available api routes."""

    return (
        f"Welcome to the Trip Planner API Endpoint:<br>"
        f"Available Routes:<br>"
        f"/api/v1.0/precipitation<br>"
        f"/api/v1.0/stations<br>"
        f"/api/v1.0/tobs<br>"
        f"/api/v1.0/<start><br>"
        f"/api/v1.0/<start>/<end><br>"
    )

@app.route("/api/v1.0/precipitation")
def precip():
    """List all precipitation data."""

    # Query for all measurements
    results = session.query(Measurement)

    # Create a dictionary from the query results
    # Create a dictionary from query results
    r_list = []
    for r in results:
        r_dict = {}
        r_dict["date"] = r.date
        r_dict["prcp"] = r.prcp
        r_list.append(r_dict)

    # Generate the JSON return string
    return jsonify(r_list)

@app.route("/api/v1.0/stations")
def stations():
    """List all weather stations."""

    # Query for all stations
    results = session.query(Station)

    # Create a dictionary from query results
    r_list = []
    for r in results:
        r_dict = {}
        r_dict["station"] = r.station
        r_dict["name"] = r.name
        r_dict["latitude"] = r.latitude
        r_dict["longitude"] = r.longitude
        r_dict["elevation"] = r.elevation
        r_list.append(r_dict)

    # Generate the JSON return string
    return jsonify(r_list)

@app.route("/api/v1.0/tobs")
def tobs():
    pass

@app.route("/api/v1.0/<start>")
def temp_start(start):
    pass

@app.route("/api/v1.0/<start>/<end>")
def temp_start_end(start, end):
    pass

if __name__ == '__main__':
    app.run(debug=True)