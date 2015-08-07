app.controller('PhoneCtrl', function () {
	window.sphereMove = new window.EventEmitter();
	//ball stuff
    var x = canvas.width/2, y = canvas.height/2, xlast = x, ylast = y;
    var sphere = document.getElementById("sphere");
    sphere.style.top = y;
    sphere.style.left = x;

    var current = {x:canvas.width/2, y:canvas.height/2};
    var last = {x:canvas.width/2, y:canvas.height/2};

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

            sphereMove.move(current.y, current.x);

            //whiteboard.draw(last, current, color, true);
        }
    });

    sphereMove.move = function (top, left) {
        sphere.style.top = top + "px";
        sphere.style.left = left + "px";
        sphereMove.emit('move', top, left);
    };
})