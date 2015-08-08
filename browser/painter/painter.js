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
        document.querySelector('label').classList.remove('background')
        document.querySelector('label').style.background = color;
    });

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
	        if(Math.abs(e.beta) > 5 || Math.abs(e.gamma) > 5){
	            xlast = x;
	            ylast = y;
	            y = -e.beta * (canvas.height) / 90 + canvas.height;
	            x = e.gamma * (canvas.width)/180 + (canvas.width / 2);
	            //x = e.alpha * (canvas.width)/180;
	        }
	    };

	} 

	window.addEventListener('devicemotion', function(e){
	    if(Math.abs(e.rotationRate.beta) > 5 || Math.abs(e.rotationRate.gamma) > 5){        
	        last.x = x;
	        last.y = y;    
	        current.x = xlast;
	        current.y = ylast;

			window.painterLocation.emit('PaintCoord', last, current, color, brushWidth);
	    }
	});

};

//start & stop painting
	//on click -> emit
// window.addEventListener('')


























