'use strict';
var express = require('express');
var app = express();
var catalyst = require('zcatalyst-sdk-node');
app.use(express.json());
const tableName = 'Auction'; // The table created in the Data Store
const columnName = 'Team'; // The column created in the table
const columnName1 = 'Auction_Amt'; // The column created in the table
const columnName2 = 'Player'; // The column created in the table
// The POST API that reports the alien encounter for a particular city
app.post('/alien', (req, res) => {
 var cityJson = req.body;
console.log(cityJson);
 // Initializing Catalyst SDK
 var catalystApp = catalyst.initialize(req);
 // Queries the Catalyst Data Store table and checks whether a row is present for the given city
 getDataFromCatalystDataStore(catalystApp, cityJson.city_name, cityJson.amount, cityJson.player_name).then(cityDetails => {
  { // If the row is not present, then a new row is inserted
   console.log("Alien alert!"); //Written to the logs. You can view this log from Logs under the Monitor section in the console 
   var rowData={}
   rowData[columnName]=cityJson.city_name;
   rowData[columnName1]=cityJson.amount;
   rowData[columnName2]=cityJson.player_name;

  var rowArr=[];
  rowArr.push(rowData);
   // Inserts the city name as a row in the Catalyst Data Store table
   catalystApp.datastore().table(tableName).insertRows(rowArr).then(cityInsertResp => {
    res.send({
     "message": "Thanks for reporting!"
    });
   }).catch(err => {
    console.log(err);
    sendErrorResponse(res);
   })
//    else { // If the row is present, then a message is sent indicating duplica
// tion
//    res.send({
//     "message": "Looks like you are not the first person to encounter aliens in this city! Someone has already reported an alien encounter here!"
//    });
  }
 }).catch(err => {
  console.log(err);
  sendErrorResponse(res);
 })
});

// The GET API that checks the table for an alien encounter in that city 
app.get('/alien', (req, res) => {
 var city = req.query.player_name;

 // Initializing Catalyst SDK
 var catalystApp = catalyst.initialize(req);

 // Queries the Catalyst Data Store table and checks whether a row is present for the given city
 getDataFromCatalystDataStore(catalystApp, city).then(cityDetails => {
  if (cityDetails.length != 0) {
   res.send(JSON.stringify(cityDetails));
  } else {
   res.send({
    "message": "No Bid",
    "signal": "positive"
   });
  }
 }).catch(err => {
  console.log(err);
  sendErrorResponse(res);
 })
});
/**
 * Checks whether an alien encounter is already reported for the given city by querying the Data Store table
 * @param {*} catalystApp 
 * @param {*} cityName 
 */
function getDataFromCatalystDataStore(catalystApp, cityName) {
 return new Promise((resolve, reject) => {
  // Queries the Catalyst Data Store table
  catalystApp.zcql().executeZCQLQuery("Select * from "+tableName+" where "+columnName2+ " order by Auction_Amt desc limit 1" ).then(queryResponse => {
   resolve(queryResponse);
  }).catch(err => {
   reject(err);
  })
 });

}

/**
 * Sends an error response
 * @param {*} res 
 */
function sendErrorResponse(res) {
 res.status(500);
 res.send({
  "error": "Internal server error occurred. Please try again in some time."
 });
}
module.exports = app;

