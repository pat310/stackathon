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
		if(!toStart){
			$('#sphere').css('visibility', "visible");
			window.sphereMove.move(start, end, strokeColor, brushWidth)
		}
		else{
			$('#sphere').css('visibility', 'hidden');
			window.whiteboard.draw(start, end, strokeColor, brushWidth, true);
		}
	});

	socket.on('newImageSelected', function(imageName){
    	console.log('newImageSelected', imageName);
    	window.colorBook.applyImage(imageName);
    });

    socket.on('screenCleared', function(){
    	window.whiteboard.clear();
    });

	socket.on('newCorrectGuess', function(guess, user){
		window.correctGuess.display(guess, user);
	});
});