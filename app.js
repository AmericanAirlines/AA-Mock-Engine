'use strict';
require("dotenv").config();

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUI      = require('swagger-tools/middleware/swagger-ui');
const _              = require("lodash");

const app            = express();
const port = process.env.PORT || 8080;

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  app.use(SwaggerUI(swaggerExpress.runner.swagger));
  swaggerExpress.register(app);

  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('Listening on', port, '(Try: curl http://127.0.0.1:' + port + '/hello?name=Scott)');
  }
});
