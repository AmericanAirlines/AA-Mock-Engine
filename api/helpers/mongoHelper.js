const MongoDB        = require('mongodb');
const MongoClient    = MongoDB.MongoClient;
const dbPath         = "mongodb://localhost:27017/tamuhack";

var _db;

module.exports = {
    connectToDb: connectToDb,
    getDb: getDb
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

    return Promise.all(promises);
}

function connectToDb(callback) {
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
