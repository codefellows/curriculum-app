'use strict';

const coursesModel = require('./lib/courses.schema.js');

exports.handler = async (event, context, callback) => {

  const courses = await coursesModel.scan().exec();

  return {
    statusCode: 200,
    body: JSON.stringify(courses),
  };

};
