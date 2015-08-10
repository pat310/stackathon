$(document).ready(function(){
	var imageName="";

	var colorElements = [].slice.call(document.querySelectorAll('.image'));

	colorElements.forEach(function (el) {

	    el.style.backgroundColor = el.id;

	    el.addEventListener('click', function () {
	    	imageName = $(this).children().text();
	    	document.querySelector('#images').remove();
	    	$(document.querySelector('.allinfoHide')).removeClass('allinfoHide');

	    	console.log('emitting imageSelect', imageName)
	    	window.colorerAction.emit('imageSelect', imageName);
	    	$(document.querySelector('.allinfoHide')).removeClass('allInfoHide');
	    });

	});

	// Ultimately, the color of our stroke;
	var color;

	//set default brush width
	var brushWidth = 10;

	// The color selection elements on the DOM.
	var colorElements = [].slice.call(document.querySelectorAll('.marker'));

	colorElements.forEach(function (el) {

	    // Set the background color of this element
	    // to its id (purple, red, blue, etc).
	    el.style.backgroundColor = el.id;

	    // Attach a click handler that will set our color variable to
	    // the elements id, remove the selected class from all colors,
	    // and then add the selected class to the clicked color.
	    el.addEventListener('click', function () {
	        color = this.id;
	        document.querySelector('.selected').classList.remove('selected');
	        this.classList.add('selected');
	        document.querySelector('label').style.background = color;
	    });

	});

	document.getElementById('buttonwarn').addEventListener('click', function(){
		$('#sureclear').css('display',"block");
		document.getElementById('yes').addEventListener('click', function(){
		console.log('clearing screen');
			window.painterAction.emit('clear');
			$('#sureclear').css('display','none');

		});
		document.getElementById('no').addEventListener('click', function(){
			$('#sureclear').css('display','none');
		});
	});

	var toStart;
	var button = document.getElementById('button');
	button.addEventListener('click', function(){
		if(document.getElementById('button').value === "Start"){
			document.getElementById('button').value = "Stop";
			toStart = true;
		} 
		else{
			document.getElementById('button').value = "Start";
			toStart = false;
		}
	})

	document.querySelector('#slider').addEventListener('mouseup', function(){
		brushWidth = parseInt($(this).children().children().text());
        document.querySelector('label').style.background = color;
	});

	// ball stuff
	window.painterCanvas.declareProperties = function(canvas){
		
		var x = canvas.width/2, y = canvas.height/2, xlast = x, ylast = y;

		var current = {x: x, y: y};
		var last = {x: x, y: y};

		console.log("running now", canvas, last, current, color);
		// window.painterLocation.emit('PaintCoord', last, current, color);

		if (window.DeviceMotionEvent !== undefined) {
		    window.ondeviceorientation = function(e){
		        if(e.beta || e.gamma){
		            xlast = x;
		            ylast = y;
		            y = -e.beta * (canvas.height) / 90 + canvas.height;
		            // x = e.gamma * (canvas.width)/180 + (canvas.width / 2);
		            if(e.alpha <= 90){
		            	x = -e.alpha * (canvas.width/2) / 90 + canvas.width/2; 
		            }else if(e.alpha >= 270){
		            	x = (canvas.width/2)/(270-360)*(e.alpha - 270) + canvas.width;
		            }else if(e.alpha <= 180){
		            	x = 0;
		            }else{
		            	x = canvas.width;
		            }
		        }
		    };

		} 
		window.addEventListener('devicemotion', function(e){
		    if(e.rotationRate.beta|| e.rotationRate.gamma){        
		        last.x = x;
		        last.y = y;    
		        current.x = xlast;
		        current.y = ylast;
				
				window.painterLocation.emit('PaintCoord', last, current, color, brushWidth, toStart);
		    }
		});

	};

});