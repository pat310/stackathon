var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();

//give access to socket.io library
var socketio = require('socket.io');

server.on('request', app);

//save board data for persistence
var saveData = {};

//creates new connection server for web sockets and integrates it into HTTP server

//NOTE: IMPORTANT to place below server.on('request', app) so that express 
// application takes precedence over socket server
var io = socketio(server);

//use socket server as an event emitter in order to listen for new connections
io.on('connection', function (socket) {
    // This function receives the newly connected socket.
    // This function will be called for EACH browser that connects to our server.
    console.log('A new client has connected!');
    console.log(socket.id);

 //    //listen for room emitting
 //    var room = null;

	// //a namespace is like building multiple socket servers
	// //a room uses the same server but has multipple rooms
	// //listening for room emit
 //    socket.on('joinRoom', function(roomName){
 //    	room = roomName;
 //    	socket.join(roomName);
 //    	if(!saveData[roomName]){
 //    		saveData[roomName] = [];
 //    	}
	//     //on connection, emit current board to socket
 //    	socket.emit('currentBoard', saveData[room]);
 //    });

    socket.on('sendCanvasProps', function(canvas){
        console.log("canvas emitting", canvas)
        socket.broadcast.emit('newCanvas', canvas);
    });

    socket.on('sendPaintCoord', function(last, current, strokeColor, brushWidth, toStart){
        console.log("painter emitting", last, current, strokeColor, brushWidth, toStart);
        socket.broadcast.emit('newPaintCoord', last, current, strokeColor, brushWidth, toStart);
    });

    // //Track when user draws on board
    // socket.on('drawing', function(start, end, strokeColor){
    // 	console.log("Socket ", socket.id, " as drawn ", start, end, strokeColor);
    // 	//save data for persistence
    // 	saveData[room].push({start: start, end: end, strokeColor: strokeColor});
    
    // 	//broadcast data out to sockets
    // 	//io.sockets.emit("someoneElseDrew") would broadcast to all sockets including socket that drew
    // 	//socket.broadcast - broadcasts the event to all sockets except the socket that drew
    // 	//broadcasting to particular room
    // 	socket.broadcast.to(room).emit('newDrawing', start, end, strokeColor);
    // });

    
    // socket.on('moving', function(top, left){
    //     socket.broadcast.to(room).emit('newMoving', top, left);
    // });

    //track when sockets disconnect 
    //the socket itself emits a 'disconnect' not the io
    socket.on('disconnect', function(){
    	console.log("Socket ", socket.id, "disconnected :(");
    });
});



server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//wildcard that allows you to go to any url
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/computer', function (req, res) {
    res.sendFile(path.join(__dirname, '/browser/canvas/canvas.html'));
});

app.get('/phone', function (req, res) {
    res.sendFile(path.join(__dirname, '/browser/painter/painter.html'));
});













