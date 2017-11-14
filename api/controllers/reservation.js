'use strict';
const _ = require("lodash");

module.exports = {
    reservation: reservation
};

function reservation(req, res) {
    var recordLocator = req.swagger.params.recordLocator.value;
    if (recordLocator != null && (recordLocator == "tamrox" || recordLocator == "TAMROX")) {
        var now = new Date();
        var soon = new Date(now);
        soon.setHours(soon.getHours() + 4);

        var reservation = {
            "firstName": "Spencer",
            "lastName": "Kaiser",
            "recordLocator": "TAMROX",
            "flights": [
                {
                    "flightNumber": "123",
                    "originCode": "DFW",
                    "originCity": "Dallas/Fort Worth",
                    "destinationCode": "LAX",
                    "destinationCity": "Los Angeles",
                    "estimatedDeparture": now.toISOString(),
                    "scheduledDeparture": now.toISOString(),
                    "estimatedArrival": soon.toISOString(),
                    "scheduledArrival": soon.toISOString()
                }
            ]
        };

        res.json(reservation);
    } else {
        res.status(500).json({"error": "Reservation could not be found"})
    }
}
