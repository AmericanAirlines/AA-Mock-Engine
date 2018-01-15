'use strict';
const { exec }  = require('child_process');
const _         = require('lodash');
const fs        = require('fs');

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
        let command = "mongoimport --mode merge --file=\"" + __dirname + "/" + file + "\" --db=\"tamuhack\" --collection=" + info.collection + " --jsonArray --upsertFields " + (info.comparisonField ? info.comparisonField : "_id");
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
        let command = "mongoimport --mode merge --file=\"" + flightData + file + "\" --db=\"tamuhack\" --collection=flight --jsonArray --upsertFields departureTime,flightNumber,origin";

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
