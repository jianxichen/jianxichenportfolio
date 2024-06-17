import * as path from 'path';
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";

// Require the fastify framework and instantiate it
const fastify = Fastify({
	// set this to true for detailed logging:
	logger: false,
});

// Setup static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "public"),
	prefix: "/public/", // virtual URL mount path prefix the static directory
});
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "node_modules"),
	prefix: "/node_modules/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "src"),
	prefix: "/src/",
	decorateReply: false, // the reply decorator has been added by the first plugin registration
});

// fastify-formbody lets us parse incoming forms
import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

// point-of-view is a templating manager for fastify
import fastifyView from "@fastify/view";
import handlebars from "handlebars";
fastify.register(fastifyView, {
	engine: {
		handlebars: handlebars,
	},
});


fastify.get("/", function (request, reply) {
	let params = {
		greeting: "Hello Node!",
		path: "/public/",
		jsFile: "SushiOrder"
	};
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
