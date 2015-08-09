window.colorBook = new window.EventEmitter();

var socket = io(window.location.origin);

socket.on('connect', function(){
    console.log('I have made a persistent two-way connection to the server!');

    socket.on('newImageSelected', function(imageName){
    	console.log('newImageSelected', imageName);
    	window.colorBook.applyImage(imageName);
    });

});