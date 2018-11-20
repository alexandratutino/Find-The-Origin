// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';



// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';



function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  //tester
  var keep = true;

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev)
  { 
    click(ev, gl, canvas, a_Position); 
  };

  // End mouse movement with right click?
  //canvas.onmouseup = function(ev){};
  canvas.oncontextmenu = function () 
  {
    alert('Right Click');
    console.log(g_points);
    //break
    Abort();
  }

  // Move a line with the mouse
  canvas.onmousemove = function(ev)
  {
    moveMouse(ev, gl, canvas, a_Position);
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //gl.drawArrays(gl.POINTS, 0, 1);
}



var g_points = []; // The array for the position of a mouse press
var savedX, savedY; //use x and y in other functions
function click(ev, gl, canvas, a_Position) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect() ;

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // Store the coordinates to g_points array
  g_points.push(x); g_points.push(y);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i += 2) 
  {
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);

    // Attempt to draw lines
    //gl.drawArrays(gl.LINE_STRIP, 0, n);
  }

  // Print the position of each point to the console
  console.log("(" + x + "," + y +")");

  // Game : if 
  if(x == 0 && y == 0)
  {
    console.log("You Won!");
  }

  // Save x and y here
  savedX = x;
  savedY = y;

}


// Exit Function if Neccesarry
function Abort()
{
   throw new Error('This is not an error. This is just to abort javascript');
}

function moveMouse(ev, gl, canvas, a_Position)
{
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect() ;
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  gl.beginPath();
  gl.moveTo(savedX, savedY);
  gl.lineTo(x, y);
  gl.stroke();
}

