var EXPAND_TIME = 1000;
var SLIDE_TIME = 5000;
var OFFSET = 3000;
var PIXEL_BOX_SIZE = 350;
var GRID_SIZE = 8;
var EVENT_CREATION_INTERVALL = 400;
var EVENT_RESTART_INTERVALL = 30000;
var BLUE = '0564B2'
var RED = 'DF2626'
var GREEN = '0C8942'
var YELLOW = 'FBC211'
var pageX, pageY;
var docWidth = $(window).width();
var docHeight = $(window).height();
var refreshIntervallID;

$(document).ready(function() {
	$('body').css('background-image', 'url("nexusBG.png")').css('background-repeat', 'repeat');
	init();	
	setInterval('restart()', EVENT_RESTART_INTERVALL);	
});

$().mousemove(function(event){
	pageX = event.pageX;
	pageY = event.pageY;	
});

$().mousedown(function(){
	var pos = quantizePos(pageX, pageY);
	generateEvent(pos);
});

function restart() {
	clearInterval(refreshIntervallID);
	$('#wallpaper').empty();
	setTimeout('init()', 3000);
}

function init() {
	refreshIntervallID = setInterval(generateRandomEvents, Math.floor(Math.random()*EVENT_CREATION_INTERVALL));	
}

function quantizePos(xPos, yPos) {
	var quantizedXPos = xPos - (xPos % GRID_SIZE);
	console.log("quantizedXPos: " + quantizedXPos + '(' + quantizedXPos/8 + ')');
	var quantizedYPos = yPos - (yPos % GRID_SIZE);
	var pos = new Object();
	pos.x = quantizedXPos;
	pos.y = quantizedYPos;
	return pos;
}

function generateRandomEvents() {
	
	var randomXPos = randomIntervallNumber (-2000, 2000);
	var randomYPos = randomIntervallNumber (-2000, 2000);
	if (((randomXPos > docWidth || randomXPos < 0) && (randomYPos < docHeight && randomYPos > 0))
	   || ((randomYPos > docHeight || randomYPos < 0) && (randomXPos < docWidth && randomXPos > 0))) {
		var pos = quantizePos(randomXPos, randomYPos);
		generateEvent(pos);
	}
}


function randomIntervallNumber (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function fisherYates (array) {
  var i = array.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = array[i];
     var tempj = array[j];
     array[i] = tempj;
     array[j] = tempi;
   }
}

function generateEvent(pos) {
	var pixelsArray = new Array(4);	
	pixelsArray[0] = createPixels(BLUE, pos);
	pixelsArray[1] = createPixels(YELLOW, pos);
	pixelsArray[2] = createPixels(RED, pos);
	pixelsArray[3] = createPixels(GREEN, pos);
	
	fisherYates(pixelsArray);
	
	if(pos.x >= 0 && pos.x <= docWidth && pos.y >= 0 && pos.y <= docHeight) {
		slideRight(pixelsArray[0]);
		slideLeft(pixelsArray[1]);
		slideBottom(pixelsArray[2]);
		slideTop(pixelsArray[3]);
	}
	else if (pos.x < 0) 
		slideRight(pixelsArray[0]);
	else if (pos.x > docWidth) 
		slideLeft(pixelsArray[0]);	
	else if (pos.y < 0)
		slideBottom(pixelsArray[0]);	
	else if (pos.y > docHeight)
		slideTop(pixelsArray[0]);
}


function slideRight(element) {
	var color = element.attr("class");	
	var grad = '-webkit-gradient(linear, left top, right top, color-stop(0, transparent), color-stop(1, #' + color + '))';	
	element.css("background-image", grad);
	element.css("height", "8px");
	element.animate({
	  	width: PIXEL_BOX_SIZE
 		 }, EXPAND_TIME, function() {
		element.animate({
			  left: OFFSET
  			}, SLIDE_TIME, function() {
			element.remove();
  		});  	
	});		
}

function slideLeft(element) {
	var color = element.attr("class");	
	var grad = '-webkit-gradient(linear, left top, right top, color-stop(0, #' + color + '), color-stop(1, transparent))';	
	element.css("background-image", grad);
	element.css("height", "8px");	
	var cssLeft = element.css('left');
	var oldLeft = cssLeft.substring(0, cssLeft.length-2);
	var newLeft = '' + (oldLeft - PIXEL_BOX_SIZE);
	element.animate({
	  	width: PIXEL_BOX_SIZE,
		left: newLeft
 		 }, EXPAND_TIME, function() {
		element.animate({
			  left: -OFFSET
  			}, SLIDE_TIME, function() {
			element.remove();
  		});  	
	});
}

function slideTop(element) {
	var color = element.attr("class");	
	var grad = '-webkit-gradient(linear, left top, left bottom, color-stop(0, #' + color + '), color-stop(1, transparent))';	
	element.css("background-image", grad);
	element.css("width", "8px");
	var cssTop = element.css('top');
	var oldTop = cssTop.substring(0, cssTop.length-2);
	var newTop = '' + (oldTop - PIXEL_BOX_SIZE);
	element.animate({
	  	height: PIXEL_BOX_SIZE,
		top: newTop
 		 }, EXPAND_TIME, function() {
		element.animate({
			  top: -OFFSET
  			}, SLIDE_TIME, function() {
			element.remove();
  		});  	
	});
}

function slideBottom(element) {
	var color = element.attr("class");	
	var grad = '-webkit-gradient(linear, left top, left bottom, color-stop(0, transparent), color-stop(1, #' + color + '))';	
	element.css("background-image", grad);
	element.css("width", "8px");			
	element.animate({
	  	height: PIXEL_BOX_SIZE
 		 }, EXPAND_TIME, function() {
		element.animate({
			  top: OFFSET
  			}, SLIDE_TIME, function() {
			element.remove();
  		});  	
	});
}

function createPixels(color, pos) {
	var pixels = $('<div class="' + color + '"></div>').css("position", "fixed")
							             .css("left", pos.x)
				                     	             .css("top", pos.y)
								     .css("-webkit-opacity", "0.7");
	$('#wallpaper').append(pixels);
	return pixels;
}
