$(document).ready(function(){

	var imageName="";

	var colorElements = [].slice.call(document.querySelectorAll('.image'));

	colorElements.forEach(function (el) {

	    el.style.backgroundColor = el.id;

	    el.addEventListener('click', function () {
	    	imageName = $(this).children().text();
	    	document.querySelector('#images').remove();
	    	$(document.querySelector('.allinfoHide')).removeClass('allinfoHide');
	    	applyImage(imageName);
	    });

	});

	var applyImage = function (imageName) {	
		var canvas = document.getElementById("paint");
		var context = canvas.getContext("2d");
		console.log('function is running', context)
		var image = new Image();
		image.src = "./coloringBook/" + imageName + ".jpg";
		image.onload = function() {
			context.drawImage(image, 0, 0);
		};
	};
});