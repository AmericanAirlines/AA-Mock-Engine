'use strict';
const _ = require("lodash");

module.exports = {
    user: user,
    createUser: createUser
};


function user(req, res) {
    var userId = req.swagger.params.userId.value;
    console.log("Looking for user: ", userId);
    if(userId == 1) {
        var user = {"email":"kgrinikhin0@example.com","aadvantageId":"U9X8A0R","id":1,"firstName":"Kelvin","lastName":"Grinikhin","gender":"Male"};
        res.json(user);
    } else {
        res.status(400).json({"error": "User could not be found"})
    }
};

function createUser(req, res) {
    var firstName = _.get(req, "swagger.params.firstName.value");
    var lastName = _.get(req, "swagger.params.lastName.value");
    var gender = _.get(req, "swagger.params.gender.value");
    var email = _.get(req, "swagger.params.email.value");
    var aadvantageId = _.get(req, "swagger.params.aadvantageId.value");

    // TODO: check if email already exists

    if(firstName && lastName && gender && email) {
        if (!aadvantageId) {
            aadvantageId = createAadvantageId();
        }
        var user = {"email":email,"aadvantageId": aadvantageId,"id": 1001,"firstName": firstName,"lastName": lastName,"gender": gender};
        res.json(user);
    } else {
        res.status(400).json({"error": "User could not be created"})
    }
}


function createAadvantageId() {
    return "AA1234";
}
