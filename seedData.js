const mockDataGenerator = require('./mock/mockDataGenerator');

(() => {
  const dates = mockDataGenerator.rangeForDates();
  mockDataGenerator.createMockFlightDataForRange(dates.start, dates.end);
})();
