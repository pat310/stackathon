window.whiteboard = new window.EventEmitter();

window.sphereMove = new window.EventEmitter();

(function () {

    // Ultimately, the color of our stroke;
    var color;

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
        });

    });

    var canvas = document.querySelector('#paint');
    var sketch = document.querySelector('#sketch');
    var sketchStyle = getComputedStyle(sketch);

    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    var currentMousePosition = {
        x: 0,
        y: 0
    };

    var lastMousePosition = {
        x: 0,
        y: 0
    };

    var drawing = false;

    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY - this.offsetTop;
    });

    canvas.addEventListener('mouseup', function () {
        drawing = false;
    });

    canvas.addEventListener('mousemove', function (e) {

        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY - this.offsetTop;

        whiteboard.draw(lastMousePosition, currentMousePosition, color, true);

    });


//ball stuff
    var x = canvas.width/2, y = canvas.height/2, xlast = x, ylast = y;
    var sphere = document.getElementById("sphere");
    sphere.style.top = y;
    sphere.style.left = x;

    var current = {x:canvas.width/2, y:canvas.height/2};
    var last = {x:canvas.width/2, y:canvas.height/2};

    if (window.DeviceMotionEvent !== undefined) {

        window.ondeviceorientation = function(e){
            if(e.beta || e.gamma){
                xlast = x;
                ylast = y;
                y = e.beta * (canvas.height) / 90;
                x = e.gamma * (canvas.width)/180 + (canvas.width / 2);
            }
        };

    } 

    window.addEventListener('devicemotion', function(e){
        if(e.rotationRate.beta || e.rotationRate.gamma){        
            last.x = x;
            last.y = y;    
            current.x = xlast;
            current.y = ylast;

            sphereMove.move(current.y, current.x);

            whiteboard.draw(last, current, color, true);
        }
    });

    sphereMove.move = function (top, left) {
        sphere.style.top = top + "px";
        sphere.style.left = left + "px";
        sphereMove.emit('move', top, left);
    };

    whiteboard.draw = function (start, end, strokeColor, shouldBroadcast) {

        // Draw the line between the start and end positions
        // that is colored with the given color.
        ctx.beginPath();
        ctx.strokeStyle = strokeColor || 'black';
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();

        // If shouldBroadcast is truthy, we will emit a draw event to listeners
        // with the start, end and color data.
        if (shouldBroadcast) {
            whiteboard.emit('draw', start, end, strokeColor);
        }
        
    };

})();