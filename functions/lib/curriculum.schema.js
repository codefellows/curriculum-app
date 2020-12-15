'use strict';

const dynamoose = require('dynamoose');

const contentSchema = new dynamoose.Schema({
  "id": String,
  "type": String,
  "repo": String,
  "version": String,
  "path": String,
  "content": String,
});

module.exports = dynamoose.model('curriculum', contentSchema);
