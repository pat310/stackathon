var submitName = document.querySelector('.user');
var button = document.querySelector('.guess');
var guess, user, answer, category, totalTime;

window.getSolution.store = function(solution, category, seconds){
	answer = solution;
	category = category;
	$('.clock').text("Time left: " + seconds);
	$('.category').text('The category is: ' + category);
};

window.getSolution.gameOver = function(solution){
	$('.gameOver').css('display','none');
	$('.gameOverFlag').text("Time is up");
};

submitName.addEventListener('click', function(){
	user = document.querySelector('.user-input').value;
	document.querySelector('.hide-on-submit').remove();
	$('.name').text("Hello " + user);
	$(document.querySelectorAll('.hide-all')).removeClass('hide-all');
});


button.addEventListener('click', function () {
	//check if input equals answer (drawer to emit answer to server)
	$('.incorrect').text('');
	guess = document.getElementById('guess-input').value;
	if(guess.toLowerCase() === answer.toLowerCase()){
		window.submitAnswer.emit('correctGuess', guess, user);
		$('.winner').append('<h3>You Win!</h3>')
	} else{
		document.getElementById('guess-input').value = "";
		$('.incorrect').append('<h3>Guess Again!</h3>')
	}
});


