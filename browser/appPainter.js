window.painterCanvas = new window.EventEmitter();
window.painterLocation = new window.EventEmitter();
window.painterAction = new window.EventEmitter();
window.colorerAction = new window.EventEmitter();

var socket = io(window.location.origin);

socket.on('connect', function (){
    console.log('I have made a persistent two-way connection to the server!');
    socket.emit('painterConnect');

    socket.on('painterConnected', function(canvas){
        window.painterCanvas.declareProperties(canvas);
    });

    window.painterLocation.on('PaintCoord', function (last, current, strokecolor, brushWidth, toStart) {
    	socket.emit('sendPaintCoord', last, current, strokecolor, brushWidth, toStart);
    });

    window.painterAction.on('solution', function(solution, category){
    	socket.emit('sendSolution', solution, category);
    });

    window.painterAction.on('clear', function(){
        socket.emit('clearScreen');
    });

    window.colorerAction.on('imageSelect', function(imageName){
        socket.emit('imageSelected', imageName);
    });

    socket.on('finalSolution', function(solution, category, seconds){
    	window.painterAction.startClock(seconds);
    });

    socket.on('gameOver', function(solution){
    	window.painterAction.gameOver();
    });

});