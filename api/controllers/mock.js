'use strict';
const { exec }       = require('child_process');

module.exports = {
    mock: mock
};

function mock(req, res) {
    console.log("Adding mock data to MongoDB");
    console.log("Command: node " + global.appRoot + "/mock/populateDb.js");
    exec("node " + global.appRoot + "/mock/populateDb.js", function(err) {
        if (err) {
            console.log("Failed to import mock data", err);
            res.status(500).json("Mock data could not be inserted into DB");
            return;
        }
        console.log("Returning success");
        res.json("Mock data successfully added to DB");
    });
}
