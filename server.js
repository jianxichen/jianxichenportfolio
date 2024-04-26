const path = require("path");
const fastifyStatic = require('@fastify/static');

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // virtual URL mount path prefix the static directory 
});
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'node_modules'),
  prefix: '/node_modules/',
  decorateReply: false
})
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'src'),
  prefix: '/src/',
  decorateReply: false // the reply decorator has been added by the first plugin registration
})
// Will need to serve BabylonJS libraries in static for client

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/index.hbs
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    greeting: "Hello Node!",
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    greeting: "Hello Form!",
  };
  // request.body.paramName <-- a form post example
  return reply.view("/src/index.hbs", params);
});

// Run the server and report out to the logs
let port = process.env.PORT != null ? "0.0.0.0" : "127.0.0.1";
fastify.listen(
  {
    port: process.env.PORT || 8080,
    host: "127.0.0.1",
  },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
