
# Implementing MaasGlobal Transport Service Providers (3rd Party API's)
[MaaS](http://maas.global/maas-as-a-concept/), short for Mobility as a Service, brings all means of travel together. It combines options from different transport providers into a single mobile service, removing the hassle of planning and one-off payments. This documentation will help you implement your own TSP and get your transport service as a part of MaaS.

## Prerequisites
This guide assumes that for this reference implementation, readers are familiar with basic JavaScript (ES6) and Node.js concepts. Knowledge about AWS Lambda or similiar serverless architectures can come in handy, but is not necessary. The Serverless Framework is used to manage deployment, handle project structure and running the Lambda -functions from a command line, so a quick peak into [the docs](https://serverless.readme.io/v0.5.0/docs) can be useful for those not familiar with the Serverless Framework. NOTE: TSPs can be implemented using any language capable of handling HTTP traffic and implementing a REST -API using JSON for modelling data payloads within the request/response bodies.

## Table of Contents

1. [How a TSP works](#how-a-tsp-works)
2. [Architecture](#architecture)
    * [Directory structure](#directory-structure)
        * [Dependencies](#dependencies)
    * [Environment variables](#environment-variables)
    * [Naming conventions](#naming-conventions)
        * [Linting](#linting)
        * [Date & Time handling](#date-time-handling)
3. [Schemas](#schemas)
4. [Implementing a TSP](#implementing-a-tsp)
5. [Tests](#tests)


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

TSP's are stateless, and can be seen as a collection of mapping / filtering functions. This repository includes a reference implementation, which exposes the open API from [Citybikes](https://api.citybik.es/v2/) to MaaS. This repository can be used as a starting point to develop your own TSP for some 3rd party transport service provider. A simple test suite is included to verify your implementation against JSON schemas. In this reference implementation we utilize a serverless architecture and it is built using the Serverless -Framework (currently v.0.5.6).


## Architecture
All TSP's are currently deployed into AWS as Lambda functions, combined with their respective API Gateway endpoint definitions. All AWS -related data can be found inside the s-function.json -file for each function. More information about the file's structure and how the Serverless Framework works can be found [here](https://serverless.readme.io/v0.5.0/docs). The example TSP provided in this repository contains all the mandatory functions / endpoints for a simple TSP. The required functions can be interpreted as a collection of CRUD(L) -functions, where each function does one thing and returns an expected result/error. Finally, a TSP needs to expose a REST -API according to this [specification](https://github.com/maasglobal/maas-tsp-api). **NOTE: This specification is still in progress and will be updated later. For now the safest option is to look at the schemas found in this project**


### Directory structure
This is an example directory structure for implementing a TSP using the Serverless Framework. Your project should have one directory containing the mandatory functions. Each function and its assets (such as s-function.js) should reside inside its own directory correspondingly. This directory is the one that will be deployed into AWS as a single bundled Lambda -function. Stuff outside of this directory is mainly for your own project setup and development purposes, **except** for `tests` and `schemas` -directories, which are used for the validation of your implementation. Here is an example tree of a single TSP using the Serverless Framework:

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

#### Dependencies
`package.json` and `node_modules` include your dependencies and are used by the Serverless Framework to build and bundle your final functions during deployment into AWS. It is important to keep your dependencies to a minimum and use as much native code as possible. A good library for handling HTTP -requests with Node.js using promises is [request-promise-lite](https://github.com/laurisvan/request-promise-lite), which is used by many of the current TSPs.

### Environment variables
All 3rd party related API -keys should be documented in the repository's README.md -file. Actual keys MUST NOT be committed into the repository, but used from a local environment variable. For development purposes it is up to the developer to handle those, and document the necessary ones properly for final deployments. When submitting a new TSP to MaaS you should include the public API -endpoints and in exchange ask for proper API-keys used to authenticate valid endpoints.

Handling environment variables for multiple developers can be done by using the [Serverless Meta Sync -plugin](https://github.com/serverless/serverless-meta-sync)

### Naming conventions
Use nouns instead of verbs, Plurals instead of singular. snake-case in URI and path params, query string attributes in camelCase due to request mapping inside AWS API-Gateway.

##### Linting
ESLint is used for linting the entire codebase. A set of rules that must pass comes with this repository. The ESLint Gulp -task is run when running the test suite with `npm test`.

##### Date & Time handling
UTC+0 must be used for all date / time -related operations. [MomentJS](http://momentjs.com/timezone/) is a solid library for managing timezones and time -related operations.

## Schemas
[JSON Schema's](http://json-schema.org/) are used for describing data structures within the system. All schemas related to a TSP are included in this repository and used for testing and ensuring a valid implementation of a TSP. A lot of the key & value -pairs come from planning a trip, and thus include keywords like "leg", "location", "lat, "lon", etc. If you peak inside the schemas, descriptions of the fields can be found there.

## Implementing a TSP

1. Fork this repository
2. Clone the forked copy
    * In your local copy inside the `./meta/variables` directory create a file named `s-variables-dev.json` with the contents 
    ```JSON
    {
      "stage": "dev"
    }
    ```
3. run `npm run tspinstall`
4. run `npm test` to verify it's working
5. Implement your own TSP and write tests to verify its implementation

The test command will run all the tests for the project, including starting a local server on port 3000 emulating AWS API - Gateway based on your `s-function.js`files, and then running TSP API tests. The emulator can be run separately for development purposes with `sls offline start`. For a full Swagger -based documentation of the TSP API [see here](http://maasglobal.github.io/maas-tsp-api/)

## Tests
A test suite based on JSON schemas is provided as a starting point to validate a new TSP's functionality and compatibility with MaaS Core. These are the rudimentary, while also mandatory, tests that all TSPs should have in place. It is strongly encouraged to write additional tests to enhance test coverage. Critical parts, such as time based decision algorithms and filtering functions should have at least one test / function. By default, the libraries [MochaJS](https://mochajs.org/) and [ChaiJS](http://chaijs.com/) are used for writing tests. Plugging the testsuite included in this reference implementation to your own implementation should be fairly straightforward.
