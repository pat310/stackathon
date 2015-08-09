// This object describes the URL of the page we're on
window.whiteboard = new window.EventEmitter();
window.sphereMove = new window.EventEmitter();
window.properties = new window.EventEmitter();
window.canvasProperties = new window.EventEmitter();
window.correctGuess = new window.EventEmitter();
window.colorBook = new window.EventEmitter();

var socket = io(window.location.origin);

var stored;

window.canvasProperties.on('canvasProps', function(canvas){
	stored = canvas;
});

socket.on('connect', function(){
    console.log('I have made a persistent two-way connection to the server!');

    socket.emit('sendCanvasProps', stored);

	socket.on('newPaintCoord', function(start, end, strokeColor, brushWidth, toStart){
		console.log('User is drawing', start, end);
		if(!toStart) window.sphereMove.move(start, end, strokeColor, brushWidth)
		else window.whiteboard.draw(start, end, strokeColor, brushWidth, true);
	});

	socket.on('newImageSelected', function(imageName){
    	console.log('newImageSelected', imageName);
    	window.colorBook.applyImage(imageName);
    });

	socket.on('newCorrectGuess', function(guess, user){
		window.correctGuess.display(guess, user);
	});
});

// socket.on('connect', function () {
//     console.log('I have made a persistent two-way connection to the server!');
// 	//on 'draw' event being emitted from whiteboard, console.log the payload of the event
// 	window.whiteboard.on('draw', function(start, end, strokeColor){
// 		// console.log(payload);
// 		//when whiteboard is drawn upon, emit payload on socket to server
// 		socket.emit('drawing', start, end, strokeColor);
// 	});

// 	window.sphereMove.on('move', function(top, left){
// 		socket.emit('moving', top, left);
// 	});
// 	console.log("stored", stored);
// 	socket.emit('sendCanvasProps', stored);
// /*	window.canvasProperties.on('canvasProps', function(canvas){
// 		console.log("canvas in app.js", canvas);
// 		socket.emit('sendCanvasProps', stored)
// 	})*/
	
// 	var room = location.pathname.slice(1);
// 	//emits the room you want to join
// 	socket.emit('joinRoom', room);

// 	//draw current board on new connection
// 	socket.on('currentBoard', function(data){
// 		data.forEach(function(value){
// 			window.whiteboard.draw(value.start, value.end, value.strokeColor, false);
// 		});
// 	});

// 	socket.on('newCanvas', function(canvas){
// 		console.log("newCanvas", canvas)
// 		//canvasProperties.emit('newCanvas1', stored);
// 	})

// 	socket.on('retrieveCanvas', function(){
// 		console.log("retrieveCanvas")
// 		window.canvasProperties.declareProperties(stored);
// 	})
// /*	socket.on('newCanvas', function(){
// 		console.log("retrieveCanvas")
// 		window.canvasProperties.declareProperties(stored);
// 	})*/

// 	socket.on('newMoving', function(top, left){
// 		console.log("moving")
// 		window.sphereMove.move(top, left);
// 	});

// 	socket.on('newDrawing', function(start, end, strokeColor){
// 		// window.whiteboard.draw(payload)
// 		console.log('Other user is drawing');
// 		window.whiteboard.draw(start, end, strokeColor, false);
// 	});

// });