const _ = require('lodash');

const timezoneForAirportCode = airportCode => _.get(data, [airportCode, 'tz'], '');

const cityForAirportCode = airportCode => _.get(data, [airportCode, 'city'], '');

module.exports = {
  timezoneForAirportCode,
  cityForAirportCode,
};

const data = {
  DFW: { tz: 'America/Chicago', city: 'Dallas' },
  LAX: { tz: 'America/Los_Angeles', city: 'Los Angeles' },
  PHL: { tz: 'America/New_York', city: 'Philidelphia' },
  LHR: { tz: 'Europe/London', city: 'London' },
  JFK: { tz: 'America/New_York', city: 'New York' },
  HKG: { tz: 'Asia/Hong_Kong', city: 'Hong Kong' },
  MIA: { tz: 'America/New_York', city: 'Miami' },
  ORD: { tz: 'America/Chicago', city: 'Chicago' },
  // These are airport codes in the data that were not in the filenames
  // NRT: { tz: '', city: '' },
  // BOS: { tz: '', city: '' },
  // SFO: { tz: '', city: '' },
  // EWR: { tz: '', city: '' },
  // ATL: { tz: '', city: '' },
  // LAS: { tz: '', city: '' },
  // MSP: { tz: '', city: '' },
  // SLC: { tz: '', city: '' },
  // CLT: { tz: '', city: '' },
  // MCO: { tz: '', city: '' },
  // DAY: { tz: '', city: '' },
  // MKE: { tz: '', city: '' },
  // JAX: { tz: '', city: '' },
  // CMH: { tz: '', city: '' },
  // BWI: { tz: '', city: '' },
  // PVD: { tz: '', city: '' },
  // XNA: { tz: '', city: '' },
  // IAH: { tz: '', city: '' },
  // SAT: { tz: '', city: '' },
  // DCA: { tz: '', city: '' },
  // ABQ: { tz: '', city: '' },
  // MSY: { tz: '', city: '' },
  // LGA: { tz: '', city: '' },
  // TPA: { tz: '', city: '' },
  // FLL: { tz: '', city: '' },
  // MSN: { tz: '', city: '' },
  // AUS: { tz: '', city: '' },
  // MCI: { tz: '', city: '' },
  // PIT: { tz: '', city: '' },
  // RDU: { tz: '', city: '' },
  // PHX: { tz: '', city: '' },
  // BNA: { tz: '', city: '' },
  // CVG: { tz: '', city: '' },
  // DEN: { tz: '', city: '' },
  // BCN: { tz: '', city: '' },
  // MAD: { tz: '', city: '' },
  // YYZ: { tz: '', city: '' },
  // MAN: { tz: '', city: '' },
  // FRA: { tz: '', city: '' },
};
