window.whiteboard = new window.EventEmitter();

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
    var x = 1286/2, y = 543/2,
    vx = 0, vy = 0,
    ax = 0, ay = 0,
    xlast = 0, ylast = 0,
    vxlast = 0, vylast = 0;
    
    var sphere = document.getElementById("sphere");

    if (window.DeviceMotionEvent !== undefined) {

        window.ondeviceorientation = function(e){
            xlast = x;
            ylast = y;


            y = e.beta * (543) / 90;
            x = e.gamma * (1286)/180 + (1286 / 2);

            // if(e.alpha < 45){
            //     x2 = -1 * e.alpha * (1286/2)/45 + 1286/2;
            // }else if(e.alpha > 315){
            //     x2 = -14.29 * e.alpha + 18.369;
            // }

            // x+=x2;

            sphere.style.top = y + "px";
            sphere.style.left = x + "px";
        };

        // window.ondevicemotion = function(e) {
        //     axlast = ax;
        //     aylast = ay;
        //     ax = e.acceleration.x*1000;
        //     ay = e.acceleration.z*1000;
        //     var interval = e.interval;

        //     vxlast = vx;
        //     vylast = vy;
        //     vx = vxlast + ax * interval * Math.pow(10, -3);
        //     vy = vylast + ay * interval * Math.pow(10, -3);

        //     xlast = x;
        //     ylast = y;

        //     x = (vxlast + vx) / 2 * interval * Math.pow(10, -3) + xlast;
        //     y = -1 * (vylast + vy) / 2 * interval * Math.pow(10, -3) + ylast;
        // };

        // setInterval( function() {
        //     var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
        //     if ( landscapeOrientation) {
        //         vx = vx + ay;
        //         vy = vy + ax;
        //     } else {
        //         vy = vy - ay;
        //         vx = vx + ax;
        //     }
        //     vx = vx * 0.98;
        //     vy = vy * 0.98;
            
        //     xlast = x;
        //     ylast = y;

        //     y = parseInt(y + vy / 400);
        //     x = parseInt(x + vx / 400);
            
        //     boundingBoxCheck();
            
        //     sphere.style.top = y + "px";
        //     sphere.style.left = x + "px";
            
        // }, 50);
    } 


    // function boundingBoxCheck(){
    //     if (x<0) { x = 0; vx = -vx; }
    //     if (y<0) { y = 0; vy = -vy; }
    //     if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
    //     if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }
        
    // }

//end of ball stuff*****************************************

    var scaleFactorx = 1;
    var scaleFactory = 1;

    var current = {x:1286/2, y:543/2};
    var last = {x:1286/2, y:543/2};

    window.addEventListener('devicemotion', function(e){
        last.x = x*scaleFactorx;
        last.y = y*scaleFactory;    
        current.x = xlast*scaleFactorx;
        current.y = ylast*scaleFactory;

        whiteboard.draw(last, current, color, true);
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