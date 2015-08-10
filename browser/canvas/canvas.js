(function () {
    var canvas = document.querySelector('#paint');
    var sketch = document.querySelector('#sketch');
    var sketchStyle = getComputedStyle(sketch);
    var sphere = document.getElementById("sphere");

    canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

    var ctx = canvas.getContext('2d');
    
    var canvasCopy = {
    	width: canvas.width,
    	height: canvas.height
    };

    canvasProperties.emit('canvasProps', canvasCopy);

    correctGuess.display = function(guess, user){
      window.whiteboard.clear();
      $('#winner').append('<h3>'+user+' Wins, the answer was: ' + guess + '</h3>');
    };

    var colorBookBool = false;
    window.colorBook.applyImage = function (imageName) {  
      colorBookBool = true;
      var image = new Image();
      image.src = "/coloringBook/" + imageName + ".jpg";
      image.onload = function() {
        ctx.drawImage(image, canvas.width/2 - this.width/2, canvas.height/2-this.height/2);
      };
    };

    window.whiteboard.clear = function(){
      colorBookBool = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    sphereMove.move = function (start, end, color, brushWidth) {  
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
		};

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
    }

    whiteboard.draw = function (start, end, strokeColor, brushWidth, shouldBroadcast) {
        // Draw the line between the start and end positions
        // that is colored with the given color.
        ctx.lineWidth = brushWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();

        if(!colorBookBool){
          ctx.strokeStyle = strokeColor || 'black';
        }else{
          var rgbVals = hexToRgb(strokeColor || "#000000");
          ctx.strokeStyle = "rgba(" + rgbVals.r + "," + rgbVals.g + "," + rgbVals.b + ", 0.1)";
        }
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        
    };

})();
