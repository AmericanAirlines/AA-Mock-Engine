'use strict';
const _                 = require('lodash');
const mongoHelper       = require('../helpers/mongoHelper');
const mongo             = require('mongodb');

module.exports = {
    flight: flight,
    flights: flights,
    setFlightStatus: setFlightStatus,
    retrieveFlights: retrieveFlights
};


function user(req, res) {
    var email = _.toLower(req.swagger.params.email.value);
    let users = mongoHelper.getDb().collection("user");
    try {
        users.findOne({email: email}, function(err, record) {
            if (err || record == null) {
                res.status(400).json({"error": "User could not be found"});
                console.log(err);
                return;
            };
            res.json(record);
        });
    } catch(err) {
        res.status(400).json({"error": "Something went wrong looking for user"});
    }
};

function flight(req, res) {
    let dateString = _.get(req, "swagger.params.date.value");
    let flightNumber = _.get(req, "swagger.params.flightNumber.value");
    if (!dateString || !flightNumber) {
        res.status(400).json({"error": "Date and Flight Number are required fields"});
        return;
    }

    let queryParams = {
        departureTime: getTodayRange(dateString),
        flightNumber: flightNumber
    };

    try {
        console.log(queryParams)
        let flights = mongoHelper.getDb().collection("flight");

        flights.findOne(queryParams, function(err, record) {
            if (err || record == null) {
                res.status(400).json({"error": "Flight could not be found"});
                console.log(err);
                return;
            };
            res.json(record);
        });

    } catch(err) {
        res.status(400).json({"error": "Something went wrong looking for that flight", err: err});
    }
}

function flights(req, res) {
    var queryParams = {};

    let dateString = _.get(req, "swagger.params.date.value");
    if (!dateString) {
        res.status(400).json({"error": "Date is a required field"});
        return;
    }

    queryParams.departureTime = getTodayRange(dateString);

    let origin = _.get(req, "swagger.params.origin.value");
    let destination = _.get(req, "swagger.params.destination.value")

    if (origin) {
        queryParams.origin = origin;
    }

    if (destination) {
        queryParams.destination = destination;
    }

    try {
        console.log(queryParams)
        let flights = mongoHelper.getDb().collection("flight");
        var cursor = flights.find(queryParams).sort({ "departureTime" : 1 });
        cursor.toArray(function(err, records) {
            if (err || records == null || records.length == 0) {
                res.status(400).json({"error": "Flights could not be found"});
                return;
            }
            res.json(records);
        });
    } catch(err) {
        res.status(400).json({"error": "Something went wrong looking for flights", err: err});
    }
}

function retrieveFlights(flightIds) {
    return new Promise(function(resolve, reject) {
        var flightObjectIds = [];
        _.each(flightIds, function(flightId) {
             flightObjectIds.push(new mongo.ObjectID(flightId));
        });

        let query = {
            "_id": {
                "$in": flightObjectIds
            }
        };

        let flights = mongoHelper.getDb().collection("flight");
        var cursor = flights.find(query).sort({ "departureTime" : 1 });
        cursor.toArray(function(err, records) {
            if (err) {
                reject(err);
                return;
            }
            resolve(records);
        });
    });
}


function getTodayRange(dateString) {
    // This function is timezone-specific,
    // meaning it will return "today" for the given timezone
    let date = new Date(dateString)
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return {
        "$gte": date.toISOString(),
        "$lt": nextDay.toISOString()
    };
}

function setFlightStatus(req, res) {
    var flightId = _.get(req, "swagger.params.flightId.value");
    flightId = new mongo.ObjectID(flightId);
    let flightStatus = _.get(req, "swagger.params.flightStatus.value")

    let flights = mongoHelper.getDb().collection("flight");
    let updates = {
        "$set": {
            "flightStatus": flightStatus
        }
    };
    try {
        flights.updateOne({"_id": flightId}, updates, function(err, record) {
            if (err) {
                res.status(400).json({"error": "Something went wrong updating flight status", err: err});
            }
            res.json(record);
        });
    } catch(err) {
        res.status(400).json({"error": "Something went wrong updating flight status", err: err});
    }

}
