var submitName = document.querySelector('.user');
var button = document.querySelector('.guess');
var guess, user, answer, category, totalTime;

window.getSolution.store = function(solution, category, minutes){
	answer = solution;
	category = category;
	totalTime = minutes;
	console.log("getSolution", answer, category, totalTime);
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
	$('.incorrect').text('');
	guess = document.getElementById('guess-input').value;
	console.log("guess", guess);
	if(guess.toLowerCase() === answer.toLowerCase()){
		window.submitAnswer.emit('correctGuess', guess, user);
		$('.winner').append('<h3>You Win!</h3>')
	} else{
		document.getElementById('guess-input').value = "";
		$('.incorrect').append('<h3>Guess Again!</h3>')
	}
})


