'use strict';
require("dotenv").config();

const express        = require('express');
const bodyParser     = require('body-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUI      = require('swagger-tools/middleware/swagger-ui');
const _              = require('lodash');
const mongoHelper    = require('./api/helpers/mongoHelper');

const app            = express();
const port = process.env.PORT || 3030;

module.exports = app; // for testing
let appRoot = __dirname;
global.appRoot = appRoot;
let config = {
    appRoot: appRoot,     // required config
    // jsonEditor: false
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

// ~~~~~ ROUTING ~~~~~
app.get('/', function(req, res) {
    // Redirect all traffic to docs
    res.redirect('/docs');
});
