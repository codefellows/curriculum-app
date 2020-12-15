'use strict';

const dynamoose = require('dynamoose');

const courseSchema = new dynamoose.Schema({
  "id": String,
  "course": String,
  "version": String,
});

module.exports = dynamoose.model('courses', courseSchema);
