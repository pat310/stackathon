(function () {
    var canvas = document.querySelector('#paint');
    var sketch = document.querySelector('#sketch');
    var sketchStyle = getComputedStyle(sketch);
    var sphere = document.getElementById("sphere");

    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

/*    sphere.style.top = canvas.height/2;
    sphere.style.left = canvas.width/2;*/

    var ctx = canvas.getContext('2d');
    
    var canvasCopy = {
    	width: canvas.width,
    	height: canvas.height
    };

    canvasProperties.emit('canvasProps', canvasCopy);

    correctGuess.display = function(guess, user){
      console.log(guess, user);
      $('.winner').append('<h3>'+user+' Wins, the answer was: ' + guess + '</h3>');
    };


    window.colorBook.applyImage = function (imageName) {  
      var canvas = document.getElementById("paint");
      var context = canvas.getContext("2d");
      console.log('function is running', context)
      var image = new Image();
      image.src = "/coloringBook/" + imageName + ".jpg";
      image.onload = function() {
        context.drawImage(image, 0, 0);
      };
    };

  //   var currentMousePosition = {
  //       x: 0,
  //       y: 0
  //   };

  //   var lastMousePosition = {
  //       x: 0,
  //       y: 0
  //   };

  //   var drawing = false;

  //   canvas.addEventListener('properties', function(e){
  //   	console.log("properties event", e);
  //   })

  //   canvas.addEventListener('mousedown', function (e) {
  //       console.log('mousedown')
  //       drawing = true;
  //       currentMousePosition.x = e.pageX - this.offsetLeft;
  //       currentMousePosition.y = e.pageY - this.offsetTop;
  //   });

  //   canvas.addEventListener('mouseup', function () {
  //       drawing = false;
  //   });

  //   canvas.addEventListener('mousemove', function (e) {

  //       if (!drawing) return;

  //       lastMousePosition.x = currentMousePosition.x;
  //       lastMousePosition.y = currentMousePosition.y;

  //       currentMousePosition.x = e.pageX - this.offsetLeft;
  //       currentMousePosition.y = e.pageY - this.offsetTop;

  //       whiteboard.draw(lastMousePosition, currentMousePosition, color, true);

  //   });
    sphereMove.move = function (start, end, color, brushWidth) {
        console.log("shereMove.move in canvas.js")
        
        ctx.moveTo(end.x, end.y);
        
        //set color of sphere
        sphere.style.backgroundColor = color;

        //set width of sphere
        sphere.style.width = brushWidth + 'px';
        sphere.style.height = brushWidth + 'px';
        sphere.style.borderRadius = brushWidth + 'px';

        //set location
        sphere.style.top = (end.y - brushWidth/4) + "px";
        sphere.style.left = (end.x - brushWidth/4) + "px";
        //emit sphere move to listeners
        sphereMove.emit('move', start, end, color, brushWidth);
		};

    whiteboard.draw = function (start, end, strokeColor, brushWidth, shouldBroadcast) {
        console.log("whiteboard.draw in canvas.js", start, end, strokeColor, brushWidth, shouldBroadcast);
        // Draw the line between the start and end positions
        // that is colored with the given color.
        ctx.lineWidth = brushWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.strokeStyle = strokeColor || 'black';
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();

        // If shouldBroadcast is truthy, we will emit a draw event to listeners
        // with the start, end and color data.
        if (shouldBroadcast) {
            whiteboard.emit('draw', start, end, strokeColor, brushWidth);
        }
        
    };

})();
