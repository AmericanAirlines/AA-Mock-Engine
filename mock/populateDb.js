'use strict';
const { exec }  = require('child_process');
const _         = require('lodash');

let mockDataFiles = {
    "users.json": "user"
    // "airports.json": "airport",
    // "flights.json": "flight"
};

_.forEach(mockDataFiles, function(collection, file) {
    let command = "mongoimport --mode merge --file=\"" + __dirname + "/" + file + "\" --db=\"tamuhack\" --collection=" + collection + " --jsonArray";
    console.log(command);
    exec(command, function(err, response) {
        if (err) {
            console.log("Something went wrong importing ", file, " -- ", err);
        }
    });
});

console.log("Done.");
