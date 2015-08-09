window.colorerAction = new window.EventEmitter();

var socket = io(window.location.origin);

socket.on('connect', function(){
    console.log('I have made a persistent two-way connection to the server!');

    window.colorerAction.on('imageSelect', function(imageName){
    	console.log('imageSelect', imageName)
    	socket.emit('imageSelected', imageName);
    });

});