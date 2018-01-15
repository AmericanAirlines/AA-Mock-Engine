'use strict';
require("dotenv").config();

const { exec }  = require('child_process');
const _         = require('lodash');
const fs        = require('fs');
const dbPath         = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/tamuhack";
var config = {};
if (process.env.MONGODB_URI) {
    let re = /mongodb:\/\/([A-z0-9]+):([A-z0-9]+)@(.*):([0-9]+)\/([A-z0-9]+)/g;
    var groups = re.exec(process.env.MONGODB_URI);
    try {
        config.user         = groups[1];
        config.password     = groups[2];
        config.host         = groups[3];
        config.port         = groups[4];
        config.db           = groups[5];
    } catch(err) {
        console.log("Couldn't parse mongodb uri successfully.")
    }
} else {
    config.db = "tamuhack";
    config.host = "localhost";
    config.port = "27017";
}


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
let flightData = __dirname + "/flightData/";

importAll();

function importGeneral() {
    _.forEach(mockDataFiles, function(info, file) {
        var command = "mongoimport " + "--host=" + config.host + " --port=" + config.port;
        if (config.user) {
            command += " -u " + config.user
        }
        if (config.password) {
            command += " -p " + config.password
        }
        command += " --mode merge --file=\"" + __dirname + "/" + file + "\" --db=" + config.db + " --collection=" + info.collection + " --jsonArray --upsertFields " + (info.comparisonField ? info.comparisonField : "_id");
        console.log(command);

        exec(command, function(err, response) {
            if (err) {
                console.log("Something went wrong importing ", file, " -- ", err);
            }
        });
    });
}

function importFlights() {
    console.log("Starting flight data import, this could take a while...");
    return new Promise(function(resolve, reject) {
        fs.readdir(flightData, function(err, files) {
            if (err) {
                reject(err);
                return;
            }

            recursiveImportFlightsFiles(files, 0).then(function() {
                console.log("Finished importing flight data");
                resolve();
            }).catch(function(err) {
                console.log(err);
                reject(err);
            });
        });
    });
}

function recursiveImportFlightsFiles(files, currFileIndex) {
    return new Promise(function(resolve, reject) {
        if (currFileIndex == files.length - 1) {
            // Imported all files
            resolve();
            return;
        }

        let file = files[currFileIndex];

        console.log("Importing ", file, "(", currFileIndex + 1, "/", files.length, ")");
        var command = "mongoimport " + "--host=" + config.host + " --port=" + config.port;
        if (config.user) {
            command += " -u " + config.user
        }
        if (config.password) {
            command += " -p " + config.password
        }
        command += " --mode merge --file=\"" + flightData + file + "\" --db=" + config.db+ " --collection=flight --jsonArray --upsertFields departureTime,flightNumber,origin";

        exec(command, function(err, response) {
            if (err) {
                console.log("Something went wrong importing ", file, " -- ", err);
                reject(err);
                return;
            }

            return recursiveImportFlightsFiles(files, currFileIndex + 1).then(function() {
                resolve();
            }).catch(function(err){
                reject(err);
                console.log(err);
                return;
            });
        });
    });
}


function importAll() {
    importGeneral();
    importFlights().then(function() {
        console.log("Done.");
        process.exit(0);
    }).catch(function(err) {
        console.log(err);
        process.exit(1);
    });
}
