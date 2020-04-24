# Code Fellows Curriculum App

Renders Versioned Facilitator and Student Information from the Official Course Curricula

Usage:

`http://<domain>?params`

Query String Params:

- **repo** - Org and Repository at GitHub.com i.e. `/codefellows/code-301-guide`
- **file** - Path to file, from repo root i.e. `/curriculum/class-03/lab/README.md`
- **version** - Version Number (semver) to render

## URLs

- Live: <https://codefellows-curriculum.netlify.com>
- Local: <http://localhost:**PORT**>

## Dependencies

GitHub Proxy

- Fetches raw markdown and manifest information from GitHub.com
- Deployed as a serverless function on the live domain
- Locally, requires a running server via: <https://github.com/codefellows/curriculumn-app-proxy>

## Environment Variables

- **REACT_APP_GITHUB_PROXY** The URL to the proxy app mentioned above

## Sample URLs

Facilitator

Home: <http://localhost:3001/facilitator>
Direct: <http://localhost:3001/facilitator?repo=/codefellows/code-401-javascript-guide&file=/curriculum/class-07/facilitator/DEMO.md&version=2#overview>

Canvas Assignment

<http://localhost:3001/assignment?repo=/codefellows/code-401-javascript-guide&file=/curriculum/class-03/README.md&version=2>

Student / Class Page (links to the class repo)

Home: <http://localhost:3001/student/codefellows/code-401-javascript-guide>
Direct: http://localhost:3001/student/codefellows/code-401-javascript-guide/module-1/class-01
