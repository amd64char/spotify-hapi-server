
# spotify-hapi-server

Fun API using Nodejs and Hapijs to create and wrap calls to the Spotify API. 
Also utilizes Boom to send back friendly HTTP error messages on endpoint errors.

## Prerequisites

You will need the following things properly installed on your computer.

* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

## Installation

* `git clone <repository-url>` this repository
* `cd spotify-hapi-server`
* `yarn install`
* `yarn add hapi nodemon`
* `yarn add hapi-swagger inert vision`
* `yarn add node-spotify-api`
* `yarn add dotenv`

## Running / Development

You can change the port the server runs on within index.js

* `yarn run start`
* Visit api [http://localhost:8080](http://localhost:/)

### Swagger Documentation

* http://localhost:8080/documentation

## Further Reading / Useful Links

* HapiJS/Boom [https://github.com/hapijs/boom](https://github.com/hapijs/boom)
* Spotify API [https://developer.spotify.com/documentation/web-api/quick-start/] (https://developer.spotify.com/documentation/web-api/quick-start/)
