
// This object describes the URL of the page we're on
var socket = io(window.location.origin);

socket.on('connect', function () {
    console.log('I have made a persistent two-way connection to the server!');
	//on 'draw' event being emitted from whiteboard, console.log the payload of the event
	window.whiteboard.on('draw', function(start, end, strokeColor){
		// console.log(payload);
		//when whiteboard is drawn upon, emit payload on socket to server
		socket.emit('drawing', start, end, strokeColor);
	});

	window.sphereMove.on('move', function(top, left){
		socket.emit('moving', top, left);
	});
	
	var room = location.pathname.slice(1);
	//emits the room you want to join
	socket.emit('joinRoom', room);

	//draw current board on new connection
	socket.on('currentBoard', function(data){
		data.forEach(function(value){
			window.whiteboard.draw(value.start, value.end, value.strokeColor, false);
		});
	});

	socket.on('newMoving', function(top, left){
		window.sphereMove.move(top, left);
	});

	socket.on('newDrawing', function(start, end, strokeColor){
		// window.whiteboard.draw(payload)
		console.log('Other user is drawing');
		window.whiteboard.draw(start, end, strokeColor, false);
	});

});