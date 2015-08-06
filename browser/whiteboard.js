window.whiteboard = new window.EventEmitter();

(function () {

    var x = 0, y = 0,
    vx = 0, vy = 0,
    ax = 0, ay = 0;
        
    var sphere = document.getElementById("sphere");

    if (window.DeviceMotionEvent != undefined) {
        window.ondevicemotion = function(e) {
            ax = event.accelerationIncludingGravity.x * 5;
            ay = event.accelerationIncludingGravity.y * 5;
            document.getElementById("accelerationX").innerHTML = e.accelerationIncludingGravity.x;
            document.getElementById("accelerationY").innerHTML = e.accelerationIncludingGravity.y;
            document.getElementById("accelerationZ").innerHTML = e.accelerationIncludingGravity.z;

            if ( e.rotationRate ) {
                document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
                document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
                document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
            }       
        }

        setInterval( function() {
            var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
            if ( landscapeOrientation) {
                vx = vx + ay;
                vy = vy + ax;
            } else {
                vy = vy - ay;
                vx = vx + ax;
            }
            vx = vx * 0.98;
            vy = vy * 0.98;
            y = parseInt(y + vy / 50);
            x = parseInt(x + vx / 50);
            
            boundingBoxCheck();
            
            sphere.style.top = y + "px";
            sphere.style.left = x + "px";
            
        }, 25);
    } 


    function boundingBoxCheck(){
        if (x<0) { x = 0; vx = -vx; }
        if (y<0) { y = 0; vy = -vy; }
        if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
        if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }
        
    }

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