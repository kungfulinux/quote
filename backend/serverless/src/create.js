"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.quote !== "string") {
    console.error("Validation failed: Quote is required.");
    callback(new Error("Couldn't create the quote."));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      firstName: data.firstName,
      lastName: data.lastName,
      quote: data.quote,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  // write to the database
  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the quote."));
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
    callback(null, response);
  });
};
