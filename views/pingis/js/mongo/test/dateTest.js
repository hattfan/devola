var moment = require('moment');

var datum = new Date();
datum.setDate(datum.getDate() - 1);
var vecka = datum.getFullYear() + ' - ' + moment(datum, "MM-DD-YYYY").week()
var månad = datum.getFullYear() + ' - ' + datum.getMonth()

console.log(datum + ' - ' + vecka + ' - ' + månad)