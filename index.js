const Hapi = require('hapi');
const Joi = require('joi');
const Boom = require('boom');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Spotify = require('node-spotify-api');
require('dotenv').config();

const spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
console.log(spotify, 'spotify object');

const spotifyBaseUrl = process.env.SPOTIFY_BASE_URL;
console.log(spotifyBaseUrl);

const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST,
    routes: {
        /*
         * By default Hapi has CORS disabled. 
         * We need to enable it so that our browser-based applications can consume data from a different host or port.
        */
        cors: true
    }
});

const init = async () => {
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Spotify API Documentation',
                    version: Pack.version
                }
            }
        }
    ]);

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                return `<h1>My spotify api</h1>`;
            }
        },
        {
            method: 'POST',
            path: '/api/v1/spotify/search',
            config: {
                description: 'Searches spotify based on artist OR album OR track',
                validate: {
                    payload: {
                        type : Joi.string().required(),
                        query : Joi.string().required(),
                    }
                },
                notes: 'Example POST: <br/> { <br/> "type": "track", <br/> "query": "All the Small Things" <br/> }',
                tags: ['api', 'v1', 'search']
            },
            handler: async (request, reply) => {
                /*
                 * Obtain POST data
                */
                //const {type, query} = request.payload;
                console.log(request.payload);
                /*
                 * Execute search
                */
               try {
                    return await spotify.search(request.payload);
                } catch(err) {
                    return Boom.badRequest(err.message);
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/spotify/track/{id}',
            config: {
                description: 'Get a specific track',
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                },
                notes: 'Example Track ID: 11dFghVXANMlKmJXsNCbNl',
                tags: ['api', 'v1', 'track']
            },
            handler: async (request, reply) => {
                /*
                * Grab incoming id parameter
                */
                const trackId = request.params.id ? encodeURIComponent(request.params.id) : '';
                /*
                 * Find our track based on id
                */
                const data = await spotify.request(spotifyBaseUrl + '/tracks/' + trackId);
                /*
                * Test if we have track data
                */
                if (data === null) { 
                    return Boom.expectationFailed();
                } else {
                    return data;
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/spotify/artist/{id}',
            config: {
                description: 'Get a specific artist',
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                },
                notes: 'Example Artist ID: 0TnOYISbd1XYRBk9myaseg',
                tags: ['api', 'v1', 'artist']
            },
            handler: async (request, reply) => {
                /*
                * Grab incoming id parameter
                */
                const artistId = request.params.id ? encodeURIComponent(request.params.id) : '';
                /*
                 * Find our artist based on id
                */
                const data = await spotify.request(spotifyBaseUrl + '/artists/' + artistId);
                /*
                * Test if we have artist data
                */
                if (data === null) { 
                    return Boom.expectationFailed();
                } else {
                    return data;
                }
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    console.log(`Documentation at: ${server.info.uri}/documentation`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
