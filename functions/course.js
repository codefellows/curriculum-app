'use strict';

const coursesModel = require('./lib/courses.schema.js');

exports.handler = async (event, context, callback) => {

  const id = event.pathParameters.id;
  console.log(event, id);
  const courses = await coursesModel.query("id").eq(id).exec();
  const course = courses[0] || null;

  return {
    statusCode: 200,
    body: JSON.stringify(course),
  };

};
