const { calculateAge, formatAPIDateToDateObject } = require('../../utils/date.utils');

describe('calculateAge', () => {
  it('should return the correct age for a given birthdate', () => {
    const birthDate = new Date('1990-01-01');
    const age = calculateAge(birthDate);
    expect(age).toEqual(new Date().getFullYear()-1990);
  });
});

describe('formatAPIDateToDateObject', () => {
  it('should return the correct Date object for a valid API date string in test api i.e yyyy/dd/mm', () => {
    const date = '2023/24/01'; // date format in api is yyyy/dd/mm
    const dateObject = formatAPIDateToDateObject(date);
    expect(dateObject).toEqual(new Date('2023/01/24'));
  });

  it('should throw an error for an invalid API date string', () => {
    const date = '2023/35/04'; // Invalid day // date format in api is yyyy/dd/mm
    const dateObject = formatAPIDateToDateObject(date);
    expect(isNaN(dateObject.getTime())).toBe(true);
  });
});
