'use strict';
const _                 = require('lodash');
const mongoHelper       = require('../helpers/mongoHelper');

module.exports = {
    airports: airports
};

function airports(req, res) {
    let airportCode = _.toUpper(req.swagger.params.code.value);
    let airports = mongoHelper.getDb().collection("airport");
    try {
        var params = {};
        if (airportCode) params.code = airportCode;
        var cursor = airports.find(params).sort({ code : 1 });
        cursor.toArray(function(err, records) {
            if (err || records == null || records.length == 0) {
                res.status(200).json([]);
                return;
            };
            res.json(records);
        });
    } catch(err) {
        res.status(500).json({"error": "Something went wrong looking for airport(s)", err: err});
    }
}
