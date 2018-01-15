'use strict';
const _                 = require('lodash');
const mongoHelper       = require('../helpers/mongoHelper');
const randomstring      = require('randomstring');
const users             = require('./user');
const flights           = require('./flight');

module.exports = {
    reservation: reservation,
    createReservation: createReservation
};

function reservation(req, res) {
    var recordLocator = _.get(req, "swagger.params.recordLocator.value");
    if (recordLocator != null && recordLocator != "") {
        let reservation = retrieveReservation(recordLocator).then(function(reservation) {
            if (reservation != null && _.get(reservation, "err") == null) {
                hydrateReservationResponse(reservation).then(function(hydratedReservation) {
                    res.json(hydratedReservation);
                    return;
                }).catch(function(err) {
                    res.status(500).json({"error": "Reservation retrieval failed", "err": err});
                });
            } else {
                res.status(500).json({"error": "Reservation could not be found"});
            }
        });
    } else {
        res.status(500).json({"error": "Reservation could not be found"});
    }
}


function createReservation(req, res) {
    var record = {};
    record.userId = _.get(req, "swagger.params.userId.value");
    record.flightIds = _.get(req, "swagger.params.flightIds.value");
    record.recordLocator = createRecordLocator();

    if(record.userId && record.flightIds && record.flightIds.length > 0) {
        let reservations = mongoHelper.getDb().collection("reservation");
        try {
            reservations.insertOne(record, function(err, response) {
                let reservation = _.get(response, "ops[0]");
                if (err || !reservation) {
                    res.status(400).json({"error": "Reservation could not be created", "reason": err});
                    console.log(err);
                    return;
                };
                res.json(reservation);
            });
        } catch(err) {
            res.status(400).json({"error": "Something went wrong creating user"});
        }
    } else {
        res.status(400).json({"error": "User could not be created; required fields missing"});
    }
}


function createRecordLocator() {
    var attempts = 0;
    while (attempts < 10) {
        let recordLocator = _.toUpper(randomstring.generate({
            "length": 6,
            "charset": "alphabetic"
        }));
        return recordLocator;
        //TODO: Fix this so we ensure uniqueness
       // if (!retrieveReservation(recordLocator)) {
       //     return recordLocator;
       // }
       attempts += 1;
    }
}

function retrieveReservation(recordLocator) {
    let reservations = mongoHelper.getDb().collection("reservation");
    return new Promise(function(resolve, reject) {
        try {
            reservations.findOne({"recordLocator": recordLocator}, function(err, reservation) {
                if (err) {
                    console.log(err);
                    resolve({"err": err});
                    return;
                } else if (!reservation) {
                    resolve(null);
                    return;
                };
                resolve(reservation);
            });
        } catch(err) {
            console.log(err);
            reject({"err": err});
        }
    });
}

function hydrateReservationResponse(reservation) {
    return new Promise(function(resolve, reject) {
        let promises = [];
        try {
            let userPromise = users.retrieveUser(reservation.userId).then(function(userData) {
                reservation.user = userData;
            });
            promises.push(userPromise);

            let flightsPromise = flights.retrieveFlights(reservation.flightIds).then(function(flightsData) {
                reservation.flights = flightsData;
            });
            promises.push(flightsPromise);

            Promise.all(promises).then(function() {
                delete(reservation.userId);
                delete(reservation.flightIds);
                resolve(reservation);
            }).catch(function(err) {
                reject(err);
            });
        } catch(err) {
            console.log(err);
            reject(err);
        }
    });
}
