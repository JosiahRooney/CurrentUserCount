// Run a node server with Express for views (not necessary but a very simple solution)
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Set up paths here. I created one for index
app.get('/', (req, res) => {
	res.render("index");
})

// Set the server as a constant so that we can access it later
const server = app.listen(8000, () => {
	console.log("listening on port 8000");
});

// Instantiate socket.io on the server object
const io = require('socket.io').listen(server);

// Create a variable for total connected users
let totalUsers = 0;

// This is the guts of the code. First, open the socket.io code block by listening on connection
io.sockets.on('connection', (socket) => {

	// As soon as a client connects, increment the total users count
	totalUsers += 1;

	// When the server hears from the client that a user is connected, emit the number of users to the client
	socket.on("connected_user", (data) => {
		// This is used later on the front end to update the number of current active users
		io.emit('server_response', {response: totalUsers});
	});

	// Make sure we are decrementing the number when people disconnect
	socket.on('disconnect', () => {
		// Decrement variable
		totalUsers -= 1;

		// Send emit of total users again to update everyone
		io.emit('server_response', {response: totalUsers});
	});
});