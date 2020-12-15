# Lambda Function Usage

Core URL: <https://kzrvzt3go4.execute-api.us-west-2.amazonaws.com>

## `/courses`

Returns an array of valid courses and their operating version

GET: `/courses`

RETURN:

```json
[
  {
    "id": "ccd2653f-ea84-42d9-9a12-9edb268cbdf4",
    "course": "code-401-javascript",
    "version": "3.2"
  },
  {
    "id": "f5fdd64d-ea2d-4871-ab9e-fd22bddaaacf",
    "course": "code-401-javascript",
    "version": "3.3"
  }
]
```

## `/course/{id}`

Given a **Course ID**, returns an object representing that course's version, or `null`

GET: `/course/ccd2653f-ea84-42d9-9a12-9edb268cbdf4`

RETURN:

```json
{
  "id": "ccd2653f-ea84-42d9-9a12-9edb268cbdf4",
  "course": "code-401-javascript",
  "version": "3.2"
}
```

## `/content`

Given an object that contains:

- The guide repository (including the org name)
- A file path (no leading slash)
- A SemVer version (or main)

return the file contents requested as plain text (usually, markdown)

POST: `/courses`

BODY:

```json
{
 "repo":"codefellows/code-401-javascript-guide",
 "file":"curriculum/class-03/DISCUSSION.md",
 "version":"main"
}
```

RETURN:

```markdown
# Class 01

Description

...
```

## `/tree`

Given an object that contains:

- The guide repository (including the org name)
- A directory path (no leading slash)
- A SemVer version (or main)

Returns an object representing the deep tree structure and contents beginning at the path. *Warning, this could fetch the entire repository.*

POST: `/tree`

BODY:

```json
{
 "repo":"codefellows/code-401-javascript-guide",
 "path":"curriculum/class-03/demo",
 "version":"main"
}
```

RETURN:

```json
{
  "path": "curriculum/class-03/demo",
  "files": {
    "fetch": {
      "__tests__": {
        "http.test.js": {
          "content": "'use strict';\n\nconst HTTP = require('../lib/http.js');\n\n// Spies!\n// Wouldn't it be great to know if something got called the right way?\n// Or the right number of times?\n// Or with the right arguments?\n\n// This \"spies\" on console.log() so that we can watch it being called by our\n// code and letting us make assertions on if it got called correctly\njest.spyOn(global.console, 'log');\n\ndescribe('HTTP Module', () => {\n\n  it('fetch() does nothing with invalid options', () => {\n    const http = new HTTP();\n    http.fetch();\n    expect(console.log).not.toHaveBeenCalled();\n  });\n\n  it('fetch() logs out options, when given', () => {\n    const http = new HTTP();\n    http.fetch({ url: 'foo' });\n    expect(console.log).toHaveBeenCalled();\n  });\n\n});"
        },
        more files...
      },
      more folders...
    }
  }
}
```

## `/manifest`

Given an object that contains:

- The guide repository (including the org name)
- A SemVer version (or main)

Returns the JSON object representing the course manifest, which contains the classes and content broken down by module

POST: `/manifest`

BODY:

```json
{
 "repo":"codefellows/code-401-javascript-guide",
 "version":"main"
}
```

RETURN:

```json
{
  "overview": {
    "Overview": "/README.md",
    "Facilitator's Guide": "/facilitator/README.md",
    "Data Structures and Algorithms": "/facilitator/data-structures-and-algorithms.md"
  },
  "modules": [
    {
      "name": "Module 1: Node.js",
      "overview": "/facilitator/module-1.md",
      "courseLevel": 201,
      "classes": [
        {
          "class": "01",
          "name": "Node Ecosystem",
          "assignments": {
            "reading": "/curriculum/class-01/DISCUSSION.md",
            "lab": "/curriculum/class-01/lab/README.md"
          },
          "facilitator": {
            "guide": "/curriculum/class-01/facilitator/README.md",
            "demo prep": "/curriculum/class-01/facilitator/DEMO.md",
            "code demos": "",
            "lecture example": "/curriculum/class-01/facilitator/LECTURE-EXAMPLE.md"
          }
        },
        ... more classes
      ]
    },
    ... more modules
  ]
}
```

## `/repos`

Returns an array of course repositories

POST: `/repos`

RETURN:

```json
[
  "code-201-guide",
  "code-301-guide",
  "code-401-dotnet-guide",
  "code-401-java-guide",
  "code-401-javascript-guide",
  "code-401-python-guide",
  "code-dsa-guide",
  "career-coaching-guide"
]
```

## `/realeses`

Returns an array of versions for a given course

POST: `/releases`

BODY:

```json
{
 "repo":"codefellows/code-401-javascript-guide"
}
```

RETURN:

```json
[
  "3.3.3",
  "3.3.2",
  "3.3.1",
  "3.3.0",
  "3.2.0",
  "3.1.2",
  "3.1.1",
  "3.1.0",
  "3.0.0",
  "2.6.0"
]
```
