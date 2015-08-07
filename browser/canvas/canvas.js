window.canvasProperties = new window.EventEmitter();

(function () {
    var canvas = document.querySelector('#paint');
    var sketch = document.querySelector('#sketch');
	console.log("checking", canvas)
    var sketchStyle = getComputedStyle(sketch);

    var sphere = document.getElementById("sphere");
    sphere.style.top = y;
    sphere.style.left = x;


    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));


    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    canvasProperties.emit('canvasProps', canvas);

    var currentMousePosition = {
        x: 0,
        y: 0
    };

    var lastMousePosition = {
        x: 0,
        y: 0
    };

    var drawing = false;

    canvas.addEventListener('properties', function(e){
    	console.log("properties event", e);
    })

    canvas.addEventListener('mousedown', function (e) {
        console.log('mousedown')
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
