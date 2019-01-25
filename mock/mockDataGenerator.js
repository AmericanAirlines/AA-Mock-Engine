'use strict';
require('dotenv').config();

const { exec } = require('child_process');
const _ = require('lodash');
const moment = require('moment-timezone');
const fs = require('fs');
const mongoHelper = require('../api/helpers/mongoHelper');
const { timezoneForAirportCode, cityForAirportCode } = require('../api/helpers/airportHelpers');

const constants = {
  thousandDays: 1000 * 24 * 60 * 60 * 1000,
};

module.exports = {
  rangeForDates,
  createUserAndAirportData,
  createMockFlightDataForRange,
};

var config = {};
if (process.env.MONGODB_URI) {
  let re = /mongodb:\/\/([A-z0-9]+):([A-z0-9]+)@(.*):([0-9]+)\/([A-z0-9]+)/g;
  var groups = re.exec(process.env.MONGODB_URI);
  try {
    config.user = groups[1];
    config.password = groups[2];
    config.host = groups[3];
    config.port = groups[4];
    config.db = groups[5];
  } catch (err) {
    console.error("Couldn't parse mongodb uri successfully.");
    throw err;
  }
} else {
  config.db = 'aa-mock-engine';
  config.host = 'localhost';
  config.port = '27017';
}

let generalMockDataFiles = {
  'users.json': {
    collection: 'user',
    comparisonField: 'email',
  },
  'airports.json': {
    collection: 'airport',
    comparisonField: 'code',
  },
};

let mockDir = __dirname;

function createUserAndAirportData() {
  _.forEach(generalMockDataFiles, function(info, file) {
    var command = 'mongoimport ' + '--host=' + config.host + ' --port=' + config.port;
    if (config.user) {
      command += ' -u ' + config.user;
    }
    if (config.password) {
      command += ' -p ' + config.password;
    }
    command +=
      ' --mode merge --file="' +
      __dirname +
      '/' +
      file +
      '" --db=' +
      config.db +
      ' --collection=' +
      info.collection +
      ' --jsonArray --upsertFields ' +
      (info.comparisonField ? info.comparisonField : '_id');
    console.log(command);

    exec(command, function(err, response) {
      if (err) {
        console.log('Something went wrong importing ', file, ' -- ', err);
      }
    });
  });
}

function createMockFlightDataForRange(startDate, endDate, maxPerDay = 40) {
  if (!startDate || !endDate || !_.isDate(startDate) || !_.isDate(endDate)) {
    throw new Error('Start date and end date are required and must be date objects');
  }

  let flightsTemplate = require('./flightData.json');

  for (const [originCode, data] of Object.entries(flightsTemplate)) {
    const { flights, city: originCity } = data;
    const numFlights = _.random(10, Math.min(flights.length, maxPerDay));
    const todaysFlights = _.sampleSize(flights, numFlights);

    todaysFlights.forEach(flight => {
      const { flightNumber, destination: destinationCode, departureTime } = flight;

      const departure = moment.tz(departureTime, 'h:mm:ss A', timezoneForAirportCode(originCode));
      const arrival = departure
        .clone()
        .add(4, 'hours')
        .tz(timezoneForAirportCode(destinationCode));

      try {
        const mongoFlight = {
          flightNumber,
          originCode,
          originCity,
          destinationCode,
          destinationCity: cityForAirportCode(destinationCode),
          estimatedDeparture: departure.toISOString(true),
          scheduledDeparture: departure.toISOString(true),
          estimatedArrival: arrival.toISOString(true),
          scheduledArrival: arrival.toISOString(true),
        };
      } catch (err) {}
    });
  }

  console.log('Done!');
}

function rangeForDates(startDate, endDate) {
  if (!startDate && !endDate) {
    // Neither date supplied; default to ±15 days
    startDate = new Date();
    endDate = new Date(startDate);

    startDate = new Date(startDate.setDate(startDate.getDate() - 15));
    endDate = new Date(endDate.setDate(endDate.getDate() + 15));
  } else if (!endDate) {
    // No end date; default to +30 days
    startDate = new Date(startDate);
    endDate = new Date(startDate);
    endDate = new Date(endDate.setDate(endDate.getDate() + 30));
  } else if (!startDate) {
    // No start date default to -30 days
    endDate = new Date(endDate);
    startDate = new Date(endDate);
    startDate = new Date(startDate.setDate(startDate.getDate() - 30));
  } else {
    // Both dates supplied
    startDate = new Date(startDate);
    endDate = new Date(endDate);
  }

  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  if (endDate - startDate > constants.thousandDays) {
    throw new Error('Date range cannot exceed 1000 days');
  }

  if (!_.isDate(startDate)) {
    throw new Error('Start date format invalid');
  }

  if (!_.isDate(endDate)) {
    throw new Error('End date format invalid');
  }

  return {
    start: startDate,
    end: endDate,
  };
}
