
var gl = null,
    canvas = null,
    glProgram = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexColorAttribute = null,
    trianglesColorBuffer = null;

var vertexShaderSource,
    fragmentShaderSource;


function initWebGL(){

    canvas=document.getElementById("my-canvas");

    try{
        gl = canvas.getContext("webgl");
    }catch(e){
        alert("Error al obtener el contexto");
    }

    if(gl){
        setupWebGL();
        initShaders();
        setupBuffers();
        drawScene();
        //gl.clearColor(1.0, 2.0, 0.05, 1.0); //Verde fondo ARREGLAR
        //gl.clear( gl.COLOR_BUFFER_BIT);		// pinto el fondo de azul
    }else{
        alert("Error: Su browser no soporta WebGL.");
    }
}


function setupWebGL(){

    gl.clearColor(1.0, 2.0, 0.05, 1.0); //Fondo verde ARREGLAR
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height); //Espacio a utilizar del canvas
}


function onResize(){
    gl.canvas.width=$canvas.width();
    gl.canvas.height=$canvas.height();
    aspect=$canvas.width()/$canvas.height();
}


function loadShaders(){

    $.when(loadVS(), loadFS()).done(function(res1,res2){
        //this code is executed when all ajax calls are done
        webGLStart();
    });

    function loadVS() {
        return  $.ajax({
            url: "shaders/vertexShader.glsl",
            success: function(result){
                vertexShaderSource=result;
            }
        });
    }

    function loadFS() {
        return  $.ajax({
            url: "shaders/fragmentShader.glsl",
            success: function(result){
                fragmentShaderSource=result;
            }
        });
    }
}



function getShader(gl,code,type) {

    var shader;

    if (type == "fragment")
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    else // "vertex"
        shader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}


function getShaderSource(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
};


function initShaders(){

    //get shader source
    var fragmentShader = getShader(gl, vertexShaderSource,"vertex");
    var vertexShader = getShader(gl, fragmentShaderSource,"fragment");

    //compile shaders
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();

    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    //use program
    gl.useProgram(glProgram);

    glProgram.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aPosition");
    gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);

    glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aNormal");
    gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);

    glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, "uPMatrix");
    glProgram.mMatrixUniform = gl.getUniformLocation(glProgram, "uMMatrix");
    glProgram.vMatrixUniform = gl.getUniformLocation(glProgram, "uVMatrix");
    glProgram.nMatrixUniform = gl.getUniformLocation(glProgram, "uNMatrix");
}


function makeShader(src, type){

    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }

    return shader;
}


function setupBuffers(){

    var data=[]; //Vertices de los triangulos

    trianglesVerticeBuffer = gl.createBuffer();                               // Crea el buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);                   // Activa el buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);   // Carga los datos en el buffer

    var color=[]; //Colores de los triangulos en rgb (vertice a vertice)

    trianglesColorBuffer = gl.createBuffer();                               // Crea el buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);                   // Activa el buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); // Carga los datos en el buffer
}


function drawScene(){

    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0,0); //Ultimos 2 atributos: Desde que triangulo hasta que triangulo del vertexBuffer quiero dibujar.
}


window.onload = initWebGL;
