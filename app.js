'use strict';
require("dotenv").config();

const express        = require('express');
const bodyParser     = require('body-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUI      = require('swagger-tools/middleware/swagger-ui');
const MongoDB        = require('mongodb');
const _              = require("lodash");

const MongoClient    = MongoDB.MongoClient;
const dbPath         = "mongodb://localhost:27017/tamuhack";
const app            = express();
const port = process.env.PORT || 3030;

var db;



module.exports = app; // for testing
let appRoot = __dirname;
global.appRoot = appRoot;
let config = {
  appRoot: appRoot // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  app.use(SwaggerUI(swaggerExpress.runner.swagger));
  swaggerExpress.register(app);

  app.listen(port);

  console.log("App listening on ", port);

  // if (swaggerExpress.runner.swagger.paths['/hello']) {
  //   console.log('Listening on', port, '(Try: curl http://127.0.0.1:' + port + '/hello?name=Scott)');
  // }
});

start().catch(function(err) {
    console.log("Something went wrong... ", err);
});

function start() {
    var promises = [];
    let dbPromise = new Promise(function(resolve, reject) {
        console.log(dbPath);
        MongoClient.connect(dbPath, function(err, dbConnection) {
            if (err) throw err;
            db = dbConnection;
            resolve();
        });
    });
    promises.push(dbPromise);

    return Promise.all(promises).then(function(){
        console.log("\n\nSetup complete!");
    });
}
