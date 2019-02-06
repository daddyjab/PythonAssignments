#################################################
# Surf's Up! - Homework: 10-SQLAlchemy
# Author: Jeffery Brown (daddyjab)
# Date: 2/6/19
#################################################

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

import datetime as dt

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite?check_same_thread=False")

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

    retval = """
        Welcome to the Trip Planner API Endpoint:<br>
        Available Routes:<br>
        /api/v1.0/precipitation<br>
        /api/v1.0/stations<br>
        /api/v1.0/tobs<br>
        /api/v1.0/start_date<br>
        /api/v1.0/start_date/end_date<br>
        """
    return retval

@app.route("/api/v1.0/precipitation")
def precip():
    """List all precipitation data."""

    # Query for all measurements
    results = session.query(Measurement)

    # Create a dictionary from the query results
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
    """List all the most recent 12 months of temperature measurements."""

    # Determine the most recent date in the measurement data
    results = session.query( func.max(Measurement.date) )
    m_date_max = results[0][0]

    # Determine the 12 month date window needed for the query
    # Calc the End date of the most recent 12 month period
    m_date_end = dt.datetime.strptime(m_date_max, "%Y-%m-%d")

    # Calc the Start date of the 12 month period
    m_date_start = m_date_end - dt.timedelta(days=365)

    # Query 12 months of temperature data - columns: date and pcrp, ordered by: date
    # Aggregate across multiple stations on the same date using average
    results = session.query( Measurement.date, func.avg(Measurement.tobs) )\
                        .filter(Measurement.date >= m_date_start, Measurement.date <= m_date_end)\
                        .group_by(Measurement.date)\
                        .order_by(Measurement.date).all()

    # Populate the results in a dictionary
    r_list = []
    for r in results:
        r_dict = {}
        r_dict["date"] = r[0]
        r_dict["avg_temperature"] = r[1]
        r_list.append(r_dict)

    # Generate the JSON return string
    return jsonify(r_list)
    
@app.route("/api/v1.0/<start>")
def temp_start(start):
    """List all temperature measurements greater than or equal to a specified start date."""

    # Obtain the minimum, average, and maximum temperatures
    # for all date greater than the specified start date
    results = session.query(func.min(Measurement.tobs), \
                            func.avg(Measurement.tobs), \
                            func.max(Measurement.tobs)) \
                            .filter(Measurement.date >= start)\
                            .all()

    # Unpack the query results into variables
    temp_min, temp_avg, temp_max = results[0]

    # Populate the results in a dictionary
    r_dict = {
        'max_temperature': temp_max,
        'min_temperature': temp_min,
        'avg_temperature': temp_avg
    }

    # Generate the JSON return string
    return jsonify(r_dict)
    
@app.route("/api/v1.0/<start>/<end>")
def temp_start_end(start, end):
    """List all temperature measurements in a specified range of dates."""

    # Obtain the minimum, average, and maximum temperatures
    # for all date greater than the specified start date
    results = session.query(func.min(Measurement.tobs), \
                            func.avg(Measurement.tobs), \
                            func.max(Measurement.tobs)) \
                            .filter(Measurement.date >= start)\
                            .filter(Measurement.date <= end)\
                            .all()

    # Unpack the query results into variables
    temp_min, temp_avg, temp_max = results[0]

    # Populate the results in a dictionary
    r_dict = {
        'max_temperature': temp_max,
        'min_temperature': temp_min,
        'avg_temperature': temp_avg
    }

    # Generate the JSON return string
    return jsonify(r_dict)

if __name__ == '__main__':
    app.run(debug=True)