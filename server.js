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

    socket.on('sendCanvasProps', function(canvas){
        console.log("canvas emitting", canvas);
        socket.broadcast.emit('newCanvas', canvas);
    });

    socket.on('sendPaintCoord', function(last, current, strokeColor, brushWidth, toStart){
        console.log("painter emitting", last, current, strokeColor, brushWidth, toStart);
        socket.broadcast.emit('newPaintCoord', last, current, strokeColor, brushWidth, toStart);
    });

    socket.on('sendSolution', function(solution, category){
        console.log('emitting solution', solution, category);
        var seconds = 90;
        var refreshClock = setInterval(function(){
            console.log('seconds', seconds);
            socket.broadcast.emit('finalSolution', solution, category, seconds);
            socket.emit('finalSolution', solution, category, seconds);

            if(seconds <=0){
                socket.emit('gameOver', solution);
                socket.broadcast.emit('gameOver', solution);
                clearInterval(refreshClock);
            }
            seconds--;
        }, 1000);
    });

    socket.on('sendCorrectGuess', function(guess, user){
        console.log("emitting correct guess", guess, user);
        socket.broadcast.emit('newCorrectGuess', guess, user);
    });


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

app.get('/pictionary/drawer', function(req, res){
    res.sendFile(path.join(__dirname, '/browser/pictionary/drawer.html'));
});

app.get('/pictionary/guesser', function(req, res){
    res.sendFile(path.join(__dirname, '/browser/pictionary/guesser.html'));
});

app.get('/coloringbook', function(req, res){
    res.sendFile(path.join(__dirname, 'browser/coloringBook/book.html'));
});













