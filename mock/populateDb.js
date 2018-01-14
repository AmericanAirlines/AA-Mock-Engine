'use strict';
const { exec }  = require('child_process');
const _         = require('lodash');

let mockDataFiles = {
    "users.json": {
        "collection": "user",
        "comparisonField": "email"
    },
    "airports.json": {
        "collection": "airport",
        "comparisonField": "code"
    }
};
// "flights.json": "flight"

_.forEach(mockDataFiles, function(info, file) {
    let command = "mongoimport --mode merge --file=\"" + __dirname + "/" + file + "\" --db=\"tamuhack\" --collection=" + info.collection + " --jsonArray --upsertFields " + (info.comparisonField ? info.comparisonField : "_id");
    console.log(command);
    exec(command, function(err, response) {
        if (err) {
            console.log("Something went wrong importing ", file, " -- ", err);
        }
    });
});

console.log("Done.");
