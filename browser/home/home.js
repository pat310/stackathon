$(document).ready(function(){
	var dropdown = document.querySelector('.pictionary');

	var clicked = false;

	dropdown.addEventListener('click', function() {
		if(!clicked){
			$(document.querySelectorAll('.hide')).removeClass('hide');
			clicked = true;
		} else{
			$(document.querySelector('.selections')).addClass('hide');
			clicked = false;
		}
	})
})