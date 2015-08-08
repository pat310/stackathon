var submitName = document.querySelector('.user');
var button = document.querySelector('.guess');
var guess;
var user;
var answer;

window.getSolution.store = function(solution){
	answer = solution;
}

submitName.addEventListener('click', function(){
	user = document.querySelector('.user-input').value;
	console.log("name", user);
	document.querySelector('.hide-on-submit').remove();
	$('.name').text("Hello " + user);
	$(document.querySelectorAll('.hide-all')).removeClass('hide-all');
})


button.addEventListener('click', function () {
	//check if input equals answer (drawer to emit answer to server)
	guess = document.getElementById('guess-input').value;
	console.log("guess", guess);
	if(guess === answer){
		window.submitAnswer.emit('correctGuess', guess, user);
		//say you win
	} else{
		document.getElementById('guess-input').value = "";
	}
})


