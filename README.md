
# Implementing MaasGlobal Transport Service Providers (3rd Party API's)

## Prerequisites
This guide assumes that readers are familiar with basic JavaScript (ES6) and Node.js concepts. Knowledge about AWS Lambda or similiar serverless architectures can come in handy, but is not necessary. The Serverless Framework is used to manage deployment, handle project structure and running the Lambda -functions from a command line, so a quick peak into [the docs](https://serverless.readme.io/v0.5.0/docs) can be useful for those not familiar with the Serverless Framework. 

## Table of Contents

1. [How a TSP works](#how-a-tsp-works)
2. [Architecture](#architecture)
    * [Directory structure](#directory-structure)
    * [Environment variables](#environment-variables)
    * [Naming conventions](#naming-conventions)
3. [Schemas](#schemas)
4. [Implementing a TSP](#implementing-a-tsp)
5. [Tests](#tests)
    * [Functional tests](#functional-tests)
    * [Unit tests & schema based validation](#unit-tests-schema-based-validation)


## How a TSP works

A TSP, short for Transport Service Provider, is a service that exposes a unified REST-API towards MaaS Core, and handles the transformations of requests and responses from a specific 3rd party API; e.g. Uber or Citybikes.
```
+----------+      +-------------+      +---------+      +-----------+
|          |      |             |      |         |      |           |
|          | +--> |             | +--> |         | +--> |           |
|  CLIENT  |      |  MaaS Core  |      |   TSP   |      | 3rd Party |
|          | <--+ |             | <--+ |         | <--+ |           |
|          |      |             |      |         |      |           |
+----------+      +-------------+      +---------+      +-----------+
```

TSP's utilize a serverless architecture and are built using the Serverless -framework currently v.0.5.6). TSP's are stateless, and can be seen as a collection of mapping / filtering functions. This repository includes a reference implementation, which exposes the open API from Citybikes to MaaS. This repository can be used as a starting point to develop your own TSP for some 3rd party transport service provider. A simple test suite is included to verify your implementation against JSON schemas.


## Architecture
All TSP's are currently deployed into AWS as Lambda functions, combined with their respective API Gateway endpoint definitions. All AWS -related data can be found inside the s-function.json -file for each function. More information about the file's structure and how the Serverless Framework works can be found [here](https://serverless.readme.io/v0.5.0/docs). The example TSP provided in this repository contains all the mandatory functions / endpoints for a simple TSP. The required functions can be interpreted as a collection of CRUD(L) -functions, where each function does one thing and returns an expected result/error. 


### Directory structure
Your project should have one directory containing the mandatory functions. Each function and its assets (such as s-function.js) should reside inside its own directory correspondingly. This directory is the one that will be included as a git submodule to the master project containing all the TSP's of MaaS. Stuff outside of this directory are mainly for your own project setup and development purposes, **except** for `tests` and `schemas` -directories, which are used for the validation of your implementation. Here is an example tree of a single TSP:
```
bookings-citybikes/
|-- bookings-citybikes-cancel
|   |-- event.json
|   |-- handler.js
|   |-- index.js
|   `-- s-function.json
|-- bookings-citybikes-create
|   |-- event.json
|   |-- handler.js
|   |-- index.js
|   `-- s-function.json
|-- bookings-citybikes-options-list
|   |-- event.json
|   |-- handler.js
|   |-- index.js
|   `-- s-function.json
|-- bookings-citybikes-retrieve
|   |-- event.json
|   |-- handler.js
|   |-- index.js
|   `-- s-function.json
|-- lib
|   |-- citybikes-api.js
|   |-- test-user-codes.json
|   `-- util.js
|-- node_modules
|   `-- request-promise-lite
|       |-- README.md
|       |-- lib
|       |   |-- Request.js
|       |   |-- RequestError.js
|       |   |-- StreamReader.js
|       |   `-- index.js
|       `-- package.json
`-- package.json
```

As we can see, there are 4 endpoints defined for this example adapter (Citybikes TSP);
- cancel (bookings-citybikes-cancel) <=> DELETE
- create (bookings-citybikes-create) <=> CREATE
- options-list (bookings-citybikes-options-list) <=> LIST
- retrieve (bookings-citybikes-retrieve) <=> READ/RETRIEVE

NOTE: The update endpoint is not implemented in this example. MaaS Core supports toggling of implemented endpoints, but it is recommended to include 'echoing' stub endpoints, even if the 3rd party API would not support the functionality in question.

The `lib` -directory is used here to store all implementation that is specific to the 3rd party API in question. For instance in this example case this directory includes:

* `citybikes-api.js`: handles all requests towards the 3rd party API
* `util.js`: includes helper functions for coordinate validation etc.
* `test-user-codes.js`: a mocked database for user specific PIN codes

NOTE: *Citybikes does not handle reservations of bikes, so a mocked db (JSON -file) is used here as an example to return data that would otherwise not be available.*

##### Dependencies
`package.json` and `node_modules` include your dependencies and are used by the Serverless Framework to build and bundle your final functions during deployment into AWS. It is important to keep your dependencies to a minimum and use as much native code as possible. A good library for handling HTTP -requests using promises is [request-promise-lite](https://github.com/laurisvan/request-promise-lite), which is used by many of the current TSPs.

### Environment variables
All 3rd party related API -keys should be documented in the repository's README.md -file. Actual keys MUST NOT be committed into the repository, but used from a local environment variable. For development purposes it is up to the developer to handle those, and document the necessary ones properly for final developments. Transferring production keys towards MaaS can be done by a separate communication channel e.g. GPG encrypted emails.

Handling environment variables for multiple developers can be done by using the [Serverless Meta Sync -plugin](https://github.com/serverless/serverless-meta-sync)

### Naming conventions
Use nouns instead of verbs, Plurals instead of singular. snake-case in URI and path params, query string attributes in camelCase due to request mapping inside AWS API-Gateway.

#### Linting
ESLint is used for linting the entire codebase. A set of rules that must pass comes with this repository. The ESLint Gulp -task is run when running the test suite with `npm test`.

#### Date & Time handling
UTC+0 must be used for all date / time -related operations. [MomentJS](http://momentjs.com/timezone/) is a solid library for managing timezones and time -related operations.

## Schemas
[JSON Schema's](http://json-schema.org/) are used for describing data structures within the system. All schemas related to a TSP are included in this repository and used for testing and ensuring a valid implementation of a TSP. A lot of the key & value -pairs come from planning a trip, and thus include keywords like "leg", "location", "lat, "lon", etc. If you peak inside the schemas, descriptions of the fields can be found there.

## Implementing a TSP


## Tests
### Functional tests
### Unit tests (schema based validation)
### 3rd party API tests with mocked endpoint data?
