require("dotenv").config();
const MongoDB        = require('mongodb');
const MongoClient    = MongoDB.MongoClient;
const dbPath         = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/aa-mock-engine";

var _db;

module.exports = {
    connectToDb,
    getDb,
    bulkUpsert
};

function setup() {
    // Perform any DB setup functions here
    let promises = [];
    let userPromise = new Promise(function(resolve, reject) {
        _db.collection("user").createIndex({"email": 1}, {"unique": true}, function(err, response) {
            if (err) {
                reject();
                console.log(err);
                return;
            }
            resolve();
        });
    });
    promises.push(userPromise);

    let flightsPromise = new Promise(function(resolve, reject) {
        _db.collection("flight").createIndex({"flightNumber": 1, "departureTime": 1}, {"unique": true}, function(err, response) {
            if (err) {
                reject();
                console.log(err);
                return;
            }
            resolve();
        });
    });
    promises.push(flightsPromise);

    let reservationsPromise = new Promise(function(resolve, reject) {
        _db.collection("reservation").createIndex({"recordLocator": 1}, {"unique": true}, function(err, response) {
            if (err) {
                reject();
                console.log(err);
                return;
            }
            resolve();
        });
    });
    promises.push(reservationsPromise);

    return Promise.all(promises);
}

function bulkUpsert(collectionName, records, upsertKey) {
    // TODO: Fix this to make upsert key more generic
    //    Right now the departure time is hardcoded
    const collection = _db.collection(collectionName);

    const operations = [];
    records.forEach((record) => {
        operations.push({
            updateOne: {
                filter: { [upsertKey]: record[upsertKey], scheduledDepartureTime: record.scheduledDepartureTime },
                update: { $set: record },
                upsert: true,
            }
        });
    });

    if (operations.length === 0) {
        return;
    }

    collection.bulkWrite(operations, { ordered: false }, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Records modified: ' + result.modifiedCount);
    });
}

function connectToDb(callback) {
    console.log("Connecting to MongoDB @ ", dbPath);
    let dbPromise = new Promise(function(resolve, reject) {
        MongoClient.connect(dbPath, function(err, dbConnection) {
            if (err) reject(err);
            _db = dbConnection;
            console.log("Connected to DB");
            setup().then(function(){
                resolve();
            });
        });
    });
    return dbPromise;
}

function getDb() {
    return _db;
}
