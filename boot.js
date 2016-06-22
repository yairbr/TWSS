/**
 * Module dependencies.
 */
console.log('in boot...');

// Real-Time SocketIO server
var io = require('socket.io')();

// The HTTP framework from Node
var http = require('http');

// The Main Express Logic App: Middleware + Authentication + DB + Routes + API(Ajax)
var app = require('./server/server.js')(io);

// The Server Error Handling
var error_handlers = require('./server/server_critic_error_handlers');

/**
 * Get port from environment and store in Express.
 */
var port = error_handlers.normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server, and bind it to SocketIO services
 */
var server = http.createServer(app);
// io.attach(server);
io.listen(server);
server.on('error', error_handlers.onError);
server.on('listening', error_handlers.onListening(server));

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function(){
	console.log('server is running... PORT: ' + port);
});