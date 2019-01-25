require("dotenv").config();
const MongoDB        = require('mongodb');
const MongoClient    = MongoDB.MongoClient;
const dbPath         = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/aa-mock-engine";

var _db;

module.exports = {
    getDb,
    bulkUpsert
};

MongoClient.connect(dbPath, function(err, dbConnection) {
    _db = dbConnection;
});

function bulkUpsert(collectionName, records, upsertKey) {
    // TODO: Fix this to make upsert key more generic
    //    Right now the departure time is hardcoded
    const collection = _db.collection(collectionName);

    const operations = [];
    records.forEach((record) => {
        operations.push({
            updateOne: {
                filter: {
                    'flightNumber': record.flightNumber,
                    'scheduledDepartureTime': record.scheduledDepartureTime
                },
                update: { $set: record },
                upsert: true,
            }
        });
    });

    if (operations.length === 0) {
        return;
    }

    collection.bulkWrite(operations, (err, result) => {
        if (err) {
            console.error(err);
            // err.writeErrors.forEach((error) => {
            //
            // });
            return;
        }
        console.log('Records modified: ' + result.modifiedCount);
    });
}

function getDb() {
    return _db;
}
