window.submitAnswer = new window.EventEmitter();
window.getSolution = new window.EventEmitter();

var socket = io(window.location.origin);

socket.on('connect', function (){
    console.log('I have made a persistent two-way connection to the server!');

    window.submitAnswer.on('correctGuess', function(guess, user){
    	console.log("guess in appGuess.js", guess, user);
    	socket.emit('sendCorrectGuess', guess, user);
    });

    socket.on('finalSolution', function(solution, category, minutes){
    	console.log('finalSolution', solution, category, minutes)
    	window.getSolution.store(solution, category, minutes);
    })

});