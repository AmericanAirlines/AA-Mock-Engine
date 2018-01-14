'use strict';
const _ = require("lodash");

module.exports = {
    airports: airports
};

function airports(req, res) {
    if (true) {
        res.json([{
            "airportCode": "LAX",
            "airportName": "Los Angeles International",
            "city": "Los Angeles",
            "state": "CA",
            "country": "USA",
            "longitude": "123",
            "latitude": "456"
        }]);
    } else {
        res.status(500).json({"error": "Airports matching the query could not be found"})
    }
}
