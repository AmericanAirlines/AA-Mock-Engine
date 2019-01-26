module.exports = {
	timezoneCodeForAirportCode
};

function timezoneCodeForAirportCode(airportCode) {
	if (timezones[airportCode]) {
		return timezones[airportCode]
	} else {
		console.error('Couldn\'t find timezone code for ' + airportCode);
		return "";
	}
}

const timezones = {
	"DFW": "America/Chicago",
	"LAX": "America/Los_Angeles",
	"PHL": "America/New_York",
	"LHR": "Europe/London",
	"JFK": "America/New_York",
	"HKG": "Asia/Hong_Kong",
	"MIA": "America/New_York",
	"ORD": "America/Chicago"
};
