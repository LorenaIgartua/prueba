
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var herramienta = "lapiz";
var tamano = 5;
var pintar = Boolean(false);
color_prim = "#333";
color_sec = "#FFFFFF";
ultimaX = 0;
ultimaY = 0;



// CODIGO PARA SUBIR IMAGENES:
var imagen = document.getElementById('subir');
    imagen.addEventListener('change', subirImagen, false);

function subirImagen(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
          if ((img.width > canvas.width ) || (img.height > canvas.height )){
            if ( (canvas.width/img.width) > (img.height/canvas.height) ){
                  ctx.drawImage(img, 0, (canvas.height - img.height*canvas.width/img.width)/2, canvas.width, img.height*canvas.width/img.width);
            }
            else {
                  ctx.drawImage(img, (canvas.width - img.width*canvas.height/img.height)/2, 0, img.width*canvas.height/img.height, canvas.height);
            }
          }
          else {
                  ctx.drawImage(img,(canvas.width - img.width)/2,(canvas.height - img.height)/2);
          }
        }
        img.src = event.target.result;
    }
    esconderMenues();
    actualizarFiltros();
    reader.readAsDataURL(e.target.files[0]);
}

// CODIGO PARA LAPIZ Y GOMA:
document.getElementById("lapiz").addEventListener("click", function() {
document.getElementById("menuFiltros").style.display = 'none';
document.getElementById("menuBrillo").style.display = 'none';
document.getElementById("menuLapiz").style.display = 'inline';
});

document.getElementById("goma").addEventListener("click", function() {
  esconderMenues();
});

canvas.onmousedown = function (event){
  pintar = true;
  if( herramienta == "lapiz" ){
    // ctx.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    ctx.moveTo(event.layerX, event.layerY);
  }
};

canvas.onmouseup = function(){
  pintar = false;
  actualizarFiltros();
  ctx.beginPath();
};

canvas.onmousemove = function(event){
  if (pintar) {
    if (herramienta == "lapiz") {
        // ctx.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
      ctx.lineTo(event.layerX, event.layerY);
      ctx.lineWidth = tamano;
      ctx.strokeStyle = color_prim;
      ctx.stroke();
    }
    else if(herramienta == "borrador"){
        // ctx.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
      ctx.lineTo(event.layerX, event.layerY);
      ctx.lineWidth = 5;
      ctx.strokeStyle = color_sec;
      ctx.stroke();
    }
  }
};

canvas.onmouseout = function(){
  pintar = false;
};

function cambioGrosor(){
  var ancho = document.getElementById("grosor");
  tamano = ancho.options[ancho.selectedIndex].value;;
}

function cambioColor(reciboColor){
     color_prim = "#" + reciboColor;
};

// CODIGO PARA APLICAR BRILLO A UNA IMAGEN:
document.getElementById("brillo").addEventListener("click",function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroBrillo(imageData, 2);
  ctx.putImageData(imageData,0,0);
});

function filtroBrillo (imageData, valor) {
  for (x = 0;  x < imageData.width; x++) {
    for (y = 0; y < imageData.height; y++) {
      index =  (x + y * imageData.width) * 4;
      imageData.data[index + 0] = imageData.data[index + 0] + valor;
      imageData.data[index + 1] = imageData.data[index + 1] + valor;
      imageData.data[index + 2] = imageData.data[index + 2] +valor;
    }
  }
};

// CODIGO PARA APLICAR FILTROS A UNA IMAGEN:
function iniciarCanvas(idCanvas){
var elemento = document.getElementById(idCanvas);
if (elemento &&  elemento.getContext){
    var contexto = elemento.getContext('2d');
    if (contexto) {
       return contexto;
       }
    }
    return false;
};

function iniciarCanvasEjemplo(ids_canvas, filtro){
  var imagen = document.getElementById('canvas');
    var ctx = iniciarCanvas(ids_canvas);
    if (ctx) {
      ctx.drawImage(imagen,0,0,150,105);
      var	imageData = ctx.getImageData(0,0,imagen.width, imagen.height);
      filtro(imageData);
      ctx.putImageData(imageData,0,0);
  }
};

function actualizarFiltros() {
  iniciarCanvasEjemplo("ver_sepia", filtroSepia);
  iniciarCanvasEjemplo("ver_binario", filtroBinario);
  iniciarCanvasEjemplo("ver_negativo", filtroNegativo);
  // iniciarCanvasEjemplo("ver_byn", filtroBlancoYNegro);
  iniciarCanvasEjemplo("ver_blur", filtroBlur);
  iniciarCanvasEjemplo("ver_bordes", filtroDeteccionBordes);
};


document.getElementById("filtros").addEventListener("click", function() {
  actualizarFiltros();
  document.getElementById("menuBrillo").style.display = 'none';
  document.getElementById("menuLapiz").style.display = 'none';
  document.getElementById("menuFiltros").style.display = 'inline';
});

function filtroBlancoYNegro(imageData) {
  for (x = 0;  x < imageData.width; x++) {
    for (y = 0; y < imageData.height; y++) {
      index =  (x + y * imageData.width) * 4;
      color = (	imageData.data[index + 0] + imageData.data[index + 1] + imageData.data[index + 2] ) / 3;
      imageData.data[index + 0] = color;
      imageData.data[index + 1] = color;
      imageData.data[index + 2] = color;
    }
  }
};

document.getElementById("sepia").onclick = function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroSepia(imageData);
  ctx.putImageData(imageData,0,0);
  actualizarFiltros();
};

function filtroSepia(imageData) {
  for (x = 0;  x < imageData.width; x++) {
    for (y = 0; y < imageData.height; y++) {
      index =  (x + y * imageData.width) * 4;
      imageData.data[index + 0] = (imageData.data[index + 0] * .393) + (imageData.data[index + 1] *.769) + (imageData.data[index + 2] * .189);
      imageData.data[index + 1] = (imageData.data[index + 0] * .349) + (imageData.data[index + 1] *.686) + (imageData.data[index + 2] * .168);
      imageData.data[index + 2] =  (imageData.data[index + 0] * .272) + (imageData.data[index + 1] *.534) + (imageData.data[index + 2] * .131);
    }
  }
};

document.getElementById("negativo").onclick = function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroNegativo(imageData);
  ctx.putImageData(imageData,0,0);
  actualizarFiltros();
};

function filtroNegativo(imageData) {
  for (x = 0;  x < imageData.width; x++) {
    for (y = 0; y < imageData.height; y++) {
      index =  (x + y * imageData.width) * 4;
      imageData.data[index + 0] = 255- imageData.data[index + 0];
      imageData.data[index + 1] = 255- imageData.data[index + 1];
      imageData.data[index + 2] = 255- imageData.data[index + 2];
    }
  }
};

document.getElementById("binario").onclick = function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroBinario(imageData);
  ctx.putImageData(imageData,0,0);
  actualizarFiltros();
};

function filtroBinario(imageData) {
  for (x = 0;  x < imageData.width; x++) {
    for (y = 0; y < imageData.height; y++) {
      index =  (x + y * imageData.width) * 4;
      var color = imageData.data[index + 0] + imageData.data[index + 1] + imageData.data[index + 2];
      if (color < 128) {
        imageData.data[index + 0] = 0;
        imageData.data[index + 1] = 0;
        imageData.data[index + 2] = 0;
      }
      else {
        imageData.data[index + 0] = 255;
        imageData.data[index + 1] = 255;
        imageData.data[index + 2] = 255;
      }
    }
  }
};

document.getElementById("blur").onclick = function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroBlur(imageData);
  ctx.putImageData(imageData,0,0);
  actualizarFiltros();
};

function filtroBlur(imageData) {
    return convolucion(imageData, [ 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9 ]);
};

document.getElementById("bordes").onclick = function() {
  var	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  filtroDeteccionBordes(imageData);
  ctx.putImageData(imageData,0,0);
  actualizarFiltros();
};

function filtroDeteccionBordes(imageData) {
  filtroBlancoYNegro(imageData);
  var vertical = convolucionBordes(imageData, [ -1, 0, 1, -2, 0, 2, -1, 0, 1 ]);  //sobel
  var horizontal = convolucionBordes(imageData,[ -1, -2, -1, 0, 0, 0, 1, 2, 1 ]);   //sobel
  for ( var y = 0; y < imageData.height; y++ ) {
      for ( var x = 0; x < imageData.width; x++ ) {
        var indexImageData = ( y * imageData.width + x ) * 4;    //index!
        imageData.data[indexImageData] = vertical[indexImageData];
        imageData.data[indexImageData+1] = horizontal[indexImageData];
        imageData.data[indexImageData+2] = (vertical[indexImageData] + horizontal[indexImageData])/4;
      }
    }
  filtroBinario(imageData);
      return imageData ;
};

function convolucionBordes(imageData, matriz) {
    var lados = Math.round(Math.sqrt(matriz.length));
    var mitad = Math.floor(lados/2);
    var imgCalculo = imageData.data;
    var retorno = new Array(imageData.width * imageData.height * 4);

    for ( var y = 0; y < imageData.height; y++ ) {
        for ( var x = 0; x < imageData.width; x++ ) {
          var indexImageData = ( y * imageData.width + x ) * 4;    //index!
          var color = 0;
          if ( x != 0 || y != 0 || x != imageData.width || y != imageData.height ) {
            for (var i = 0; i < lados; i++) {      //ancho
                for (var j = 0; j < lados; j++) {    //alto
                    var ancho = y + i - mitad;
                    var alto = x + j - mitad ;
                    var indexAnalizado = (ancho * imageData.width + alto) * 4;
                    color += imgCalculo[indexAnalizado] * matriz[i * lados + j];
                  }
                }
            }
            retorno[indexImageData] = Math.abs(color);
            retorno[indexImageData + 1] = Math.abs(color);
            retorno[indexImageData + 2] = Math.abs(color);
        }
    }
    return retorno ;
};

function convolucion(imageData, matriz) {
    var lados = Math.round(Math.sqrt(matriz.length));  //matriz de 3 x 3, hace un arreglo de 9 .... side = 3
    var mitad = Math.floor(lados/2);
    var imgCalculo = imageData.data;  // imagen que queda para hacer los calculos
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var indexImageData = ( y * imageData.width + x ) * 4;    //index!
            var red = 0;
            var green = 0;
            var blue = 0;
          if ( x != 0 || y != 0 || x != imageData.width || y != imageData.height ) {
            for (var i = 0; i < lados; i++) {     //alto
                for (var j = 0; j < lados; j++) {    //ancho
                      var ancho = y + i - mitad;
                      var alto = x + j - mitad ;
                      var indexAnalizado = (ancho * imageData.width + alto) * 4;
                      red += imgCalculo[indexAnalizado] * matriz[i * lados + j];
                      green += imgCalculo[indexAnalizado + 1] * matriz[i * lados + j];
                      blue += imgCalculo[indexAnalizado + 2] * matriz[i * lados + j];
            }
          }
        }
        imageData.data[indexImageData] = red;
        imageData.data[indexImageData + 1] = green;
        imageData.data[indexImageData + 2] = blue;
      }
    }
    return imageData;
  };

  function filtroSharpen(imageData) {
     return convolucion(imageData, [ 0, -3/8,  0, -3/8, 20/8, -3/8, 0, -3/8, 0  ]);
  };

  function filtroEdge(imageData) {
    filtroBlancoYNegro(imageData);
     return convolucionBordes(imageData, [ -1, -1, -1, 2, 2, 2, -1, -1, -1  ]);
  };

  function filtroSuavizado(imageData) {
     return convolucion(imageData, [ 0.0030, 0.0133, 0.0219, 0.0133, 0.0030,
          0.0133, 0.0596, 0.0983, 0.0596, 0.0133,
          0.0219, 0.0983, 0.1621, 0.0983, 0.0219,
          0.0133, 0.0596, 0.0983, 0.0596, 0.0133,
          0.0030, 0.0133, 0.0219, 0.0133, 0.0030 ]);
  };

// CODIGO PARA LIMPIAR CANVAS:
function limpiarCanvas () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  esconderMenues();
  actualizarFiltros();
};

function esconderMenues() {
  document.getElementById("menuFiltros").style.display = 'none';
  document.getElementById("menuBrillo").style.display = 'none';
  document.getElementById("menuLapiz").style.display = 'none';
};

document.getElementById("limpiar").addEventListener("click",limpiarCanvas);

document.getElementById("logo").addEventListener("click",limpiarCanvas);

// CODIGO PARA GUARDAR IMAGEN DESDE CANVAS:
document.getElementById("guardar").addEventListener("click",function() {
  var link = window.document.createElement( 'a' ),     //crea un enlace, hace click sobre él y fuerza la descarga con el navegador
    url = canvas.toDataURL(),
    filename = 'screenshot.jpg';

    link.setAttribute( 'href', url );
    link.setAttribute( 'download', filename );
    link.style.visibility = 'hidden';
    window.document.body.appendChild( link );
    link.click();
    window.document.body.removeChild( link );
});
