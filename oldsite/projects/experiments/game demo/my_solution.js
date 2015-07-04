 // U3.W7: Design Basic Game Solo Challenge

// This is a solo challenge

// Your mission description: 
// Overall mission: Collect gems
// Goals: Collect gems
// Characters: Spaceship
// Objects: Spaceship object, gem object, bg
// Functions: drawing

// Pseudocode
// Create 2 objects with attributes using object literal notation
// Within those objects, have varying methods and attributes
// Introduce the different game slates through updating and repeat animation
// Create visual interface through canvas
// 

// Initial Code
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Image loading, if this is not checked and run on browser side on github, may fail if drawn before fully loaded
// Background
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://www.desktopaper.com/wp-content/uploads/best-space-wallpapers.jpg"
// Ship image
var shipReady = false;
var shipImage = new Image();
shipImage.onload = function () {
	shipReady = true;
};
shipImage.src = "http://www.pixeljoint.com/files/icons/spaceship1_final.png"
// Gem image
var gemReady = false;
var gemImage = new Image();
gemImage.onload = function () {
	gemReady = true;
};
gemImage.src = "http://www.thesettlersonlinecompendium.com/static/TSOK/r/Gems.png"
// Objects, ship and gem positional
var ship = {
	speed: 500,
	x: 0,
	y: 0
};

var gem = {
	x: 0,
	y: 0,
};

var gemsCollected = 0;

//keyboard inputs
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//Reset gem

var resetGem = function () {
	gem.x = 32 + (Math.random() * (canvas.width - 64));
	gem.y = 32 + (Math.random() * (canvas.height - 64))
};

//Main Update 
var update = function (modifier) {
	if (38 in keysDown) {
		ship.y -= ship.speed * modifier;
	}

	if (40 in keysDown) {
		ship.y += ship.speed * modifier;
	}

	if (37 in keysDown) {
		ship.x -= ship.speed * modifier;
	}

	if (39 in keysDown) {
		ship.x += ship.speed * modifier;
	}
//constrain the ship within the canvas
	ship.x = Math.max(0, Math.min(ship.x, canvas.width - shipImage.width));
	ship.y = Math.max(0, Math.min(ship.y, canvas.height - shipImage.height));

//Collision
	if (
		ship.x <= (gem.x + 40)
		&& gem.x <= (ship.x + 40)
		&& ship.y <= (gem.y + 40)
		&& gem.y <= (ship.y + 40)
	) {
		++gemsCollected;
		resetGem();
	}


};

//DRAW EVERYTHING
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (shipReady) {
		ctx.drawImage(shipImage, ship.x, ship.y);
	}

	if (gemReady) {
		ctx.drawImage(gemImage, gem.x, gem.y);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Courier";
	ctx.textBaseline = "right";
	ctx.fillText("Gems collected: " + gemsCollected, 32, 32);
};

var play = function () {
	var now = Date.now();
	var timeElapsed = now - then;

	update(timeElapsed / 1000);
	render();

	then = now;
	requestAnimationFrame(play);
};

var then = Date.now();
resetGem();
play();

// Refactored Code
// need to create new features... struggled with rock generation....





// Reflection
// This challenge took me awhile to actually comprehend every piece before I felt like a script kiddie... even then the basics of game generation I get from the various tutorials I got from the internet but something I'll definitely have to look into later. Overall... it took me quite a while and a lot of revisions and the game isn't even beatable but... it's finished.
//
//
//
//
//
//
//