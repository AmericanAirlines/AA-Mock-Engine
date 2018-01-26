'use strict';
const mockHelper = require(global.appRoot + "/mock/populateDb.js");

module.exports = {
    mock: mock
};

function mock(req, res) {
    console.log("Adding mock data to MongoDB");

    mockHelper.startImport();

    // TODO: Investigate a more appropriate way of handling errors during import
    res.json("Mock data import started. Please check the logs for more information.");
}
