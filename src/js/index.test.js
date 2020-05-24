"use strict";

const { getData} = require('./test');
const $ = require( "jquery" );
test(`should give me the capitalize string`, () => {

  expect(capitalizeString("andres")).toBe("Andres");

});