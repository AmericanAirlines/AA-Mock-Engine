'use strict';
const _ = require('lodash');
const mongo = require('mongodb');
const mongoHelper = require('../helpers/mongoHelper');
const randomstring = require('randomstring');
const emailValidator = require('email-validator');

module.exports = {
    user: user,
    createUser: createUser,
    retrieveUser: retrieveUser,
};

function user(req, res) {
    var email = _.toLower(_.get(req, 'swagger.params.email.value'));
    console.log('Looking for user: ', email);
    let users = mongoHelper.getDb().collection('user');
    try {
        users.findOne({ email: email }, function(err, record) {
            if (err || record == null) {
                res.status(404).json({ error: 'User could not be found' });
                console.log(err);
                return;
            }
            res.json(record);
        });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong looking for user' });
    }
}

function createUser(req, res) {
    var record = {};
    record.firstName = _.get(req, 'body.firstName');
    record.lastName = _.get(req, 'body.lastName');
    record.gender = _.get(req, 'body.gender');
    record.email = _.toLower(_.get(req, 'body.email'));
    record.aadvantageId = _.get(req, 'body.aadvantageNumber');

    if (!emailValidator.validate(record.email)) {
        res.status(400).json({ error: 'Invalid email address' });
        return;
    }

    if (record.firstName && record.lastName && record.gender && record.email) {
        if (!record.aadvantageId) {
            record.aadvantageId = createAadvantageId();
        }

        let users = mongoHelper.getDb().collection('user');
        try {
            users.insertOne(record, function(err, response) {
                let user = _.get(response, 'ops[0]');
                if (err || !user) {
                    res.status(400).json({ error: 'User could not be created', reason: err });
                    console.log(err);
                    return;
                }
                res.json(user);
            });
        } catch (err) {
            res.status(400).json({ error: 'Something went wrong creating user' });
        }
    } else {
        res.status(400).json({ error: 'User could not be created; required fields missing' });
    }
}

function retrieveUser(userId) {
    let users = mongoHelper.getDb().collection('user');
    return new Promise(function(resolve, reject) {
        try {
            userId = new mongo.ObjectID(userId);
            users.findOne({ _id: userId }, function(err, record) {
                if (err) {
                    reject(err);
                    return null;
                }
                resolve(record);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function createAadvantageId() {
    return _.toUpper(randomstring.generate(7));
}
