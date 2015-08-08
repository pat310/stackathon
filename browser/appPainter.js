window.painterCanvas = new window.EventEmitter();
window.painterLocation = new window.EventEmitter();
window.painterAction = new window.EventEmitter();

var socket = io(window.location.origin);

socket.on('connect', function (){
    console.log('I have made a persistent two-way connection to the server!');

    socket.on('newCanvas', function(canvas){
    	console.log('newCanvas in appPainter.js', canvas);
    	window.painterCanvas.declareProperties(canvas);
    });

    window.painterLocation.on('PaintCoord', function (last, current, strokecolor, brushWidth, toStart) {
    	console.log('paint coords in appPainter.js', last, current, strokecolor, brushWidth, toStart);
    	socket.emit('sendPaintCoord', last, current, strokecolor, brushWidth, toStart);
    });

});