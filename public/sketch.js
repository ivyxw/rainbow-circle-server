/***********************************************************************
  IDEA9101 - Assignment 1 - Rainbow Circles - Receiving MQTT

  Author: Wei Xu
***********************************************************************/
/*
	Disabling canvas scroll for better experience on mobile interfce.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23.
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});

document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});


//////////////////////////////////////////////////
//FIXED SECTION: DO NOT CHANGE THESE VARIABLES
//////////////////////////////////////////////////
var HOST = window.location.origin;
var socket;

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - BEGIN: ENTER OUR CODE HERE
////////////////////////////////////////////////////

let xPos;
let yPos;

// let colourRed;
// let colourGreen;
// let colourBlue;

let song;
// let button;
let amp;

let rings = [];
let pi = 3.1415926;
let t1;
let t=0;

let ringNumber = [];

function setup() {
	/////////////////////////////////////////////
	// FIXED SECION - START: DO NOT CHANGE IT
	/////////////////////////////////////////////
	createCanvas(windowWidth, windowHeight);

	setupMqtt();
	/////////////////////////////////////////////
	// FIXED SECION - END
	/////////////////////////////////////////////


	/////////////////////////////////////////////
	// ADD YOUR SETUP CODE HERE
	/////////////////////////////////////////////
	xPos = windowWidth/2;
	yPos = windowHeight/2;

	saturation = 100; 
	brightness = 100; 
	breathRate = 5; // frameRate data

	rectMode(CENTER);


	// Var for amplitude
	song = loadSound('assets/Themadpixproject_WishYouWereHere.mp3', loaded);
	amp = new p5.Amplitude();
	// background(51);
	// button = createButton('play');
  	// button.mouseClicked(togglePlaying);

	// colorMode(RGB, 255, 255, 255, 1);
	// angleMode(DEGREES);
 	colorMode(HSB, 360, 100, 100, 100);
	noStroke();

	// background(50);

	
}

// Use button to control the play/stop of Sound input
function loaded(){
	// button = createButton('play');
	// button.mousePressed(togglePlaying);
	console.log('loaded');
}



function draw() {
	frameRate(breathRate);
	background(230, 30, 23);

	// Create a new ring(ranbow circles) object	
	let r = new Ring(xPos, yPos, 20, floor(random(3, 10)));
	rings.push(r);
	
	for (let i = 0; i < rings.length; i++) {
		rings[i].update();
		rings[i].draw();
	}

}

// function togglePlaying() {
// 	if (!song.isPlaying()) {
// 	  song.play();
// 	  song.setVolume(0.3);
// 	  button.html('pause');
// 	} else {
// 	  song.stop();
// 	  button.html('play');
// 	}
//   }


// Define the class of Ring
// Inspiration form https://blog.csdn.net/Slient116/article/details/102530181
class Ring{
	constructor(x, y, r, num){
		this.x = x;
		this.y = y;
		this.r = r;
		this.n = num;
	}
	
	update(){
		this.r = 100+(cos(10*frameCount/50)*50);
	}

	draw() {
		for (let i = 0; i < this.n; i++) {
		  if (i % 2 == 0) {
			let h1 = random(0, 360);
		   fill(h1, saturation, brightness);
		  } else {
		   fill(230, 30, 23);
		  }
		  ellipse(this.x, this.y, this.r - i * this.r / this.n, this.r - i * this.r / this.n);
		}
	}
  }

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - END: ENTER OUR CODE HERE
////////////////////////////////////////////////////


////////////////////////////////////////////////////
// MQTT MESSAGE HANDLING
////////////////////////////////////////////////////
// function setupMqtt() {
// 	socket = io.connect(HOST);
// 	socket.on('mqttMessage', receiveMqtt);
// }

// function receiveMqtt(data) {
// 	var topic = data[0];
// 	var message = data[1];
// 	console.log('Topic: ' + topic + ', message: ' + message);

// 	if (topic.includes('ideaLabtest')) {
// 		rgbColours = message.split(',');
// 		colourRed = rgbColours[0].trim();
// 		colourGreen = rgbColours[1].trim();
// 		colourBlue = rgbColours[2].trim();
// 	}
// }

// Reference from IDEA9101 - Week4 - Tutorial Example- Receiving MQTT
////////////////////////////////////////////////////
// MQTT MESSAGE HANDLING
////////////////////////////////////////////////////
function setupMqtt() {
	socket = io.connect(HOST);
	socket.on('mqttMessage', receiveMqtt);
}

function receiveMqtt(data) {
	var topic = data[0];
	var message = data[1];

	var xp;
	var yp;
	console.log('Topic: ' + topic + ', message: ' + message);

	if (topic.includes('ideaLabtest')) {

		ringDatas = message.split(',');

		if(ringDatas.length == 3){
			saturation = ringDatas[0].trim();
			brightness = ringDatas[1].trim();
			breathRate = ringDatas[2].trim();
		}
		if(ringDatas.length == 2){
			xp = ringDatas[0].trim();
			xPos = map(xp, -1, 1, 0, windowWidth);
			yp = ringDatas[1].trim();
			yPos = map(yp, -1, 1, 0, windowHeight);
		}
	}
}