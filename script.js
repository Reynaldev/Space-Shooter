function StartGame() {
    document.getElementById("game-overlay").style.display = "none";

    // Start game
    gameArea.start();

    background = new component(gameArea.canvas.width, gameArea.canvas.height,
        "src/game/background.png", 0, 0);
        
    // Create player
    player = new component(30, 30, "src/game/player.png", (gameArea.canvas.width - 30) / 2, 380);

    // Create 3 meteors
    for (let i = 0; i < 3; i++) {
        var meteor = new component(30, 30, "src/game/meteor.png", Math.random() * (gameArea.canvas.width - 30), 0);
        meteor.speedY = Math.random() * 20;
        meteors.push(meteor);
    }
}

// Game System 
var background, player, meteors = [], score = 0;

// Canvas
var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 240;
        this.canvas.height = 426;
        this.canvas.style.border = "2px solid black";
        this.context = this.canvas.getContext("2d");

        document.getElementById("game-section").appendChild(this.canvas);

        this.frameNo = 0;
        this.interval = setInterval(updateFrame, 20);

        window.addEventListener('keydown', function(e) {
            gameArea.key = e.code;
        });

        window.addEventListener('keyup', function(e) {
            gameArea.key = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

// Component constructor
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;

    this.image = new Image();
    this.image.src = color;

    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function() {
        ctx = gameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.collideWith = function(otherObject) {
        var top = this.y;
        var bottom = this.y + this.height;
        var left = this.x;
        var right = this.x + this.width;

        var otherTop = otherObject.y;
        var otherBottom = otherObject.y + otherObject.height;
        var otherLeft = otherObject.x;
        var otherRight = otherObject.x + otherObject.width;

        var crash = true;
        if ((bottom < otherTop) ||
            (top > otherBottom) ||
            (right < otherLeft) ||
            (left > otherRight)) {
                crash = false;
        }

        return crash;
    }
}

// Interval
function everyInterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) { return true; }

    return false;
}

// Frame update
function updateFrame() {
    // If player collided with meteor
    for (let i = 0; i < meteors.length; i++) {
        if (player.collideWith(meteors[i])) {
            gameArea.stop();
    
            document.getElementById("scoreboard").innerText = `Your score: ${score}`;
            document.getElementById("game-overlay").style.display = "";
            
            score = 0;
            meteors = [];

            return;
        }
    }

    // Clear frame
    gameArea.clear();
    gameArea.frameNo++;

    // Score
    score++;
    document.getElementById("score").innerText = score;

    // Player Movement
    player.speedX = 0;
    if (gameArea.key == "KeyA") { player.speedX = -5 }
    if (gameArea.key == "KeyD") { player.speedX = 5 }

    // Player border
    if (player.x > (gameArea.canvas.width - player.width)) { player.x = 0; }
    else if (player.x < 0) { player.x = gameArea.canvas.width - player.width; }

    // Update background
    background.newPos();
    background.update();

    // Meteor movement
    for (let i = 0; i < meteors.length; i++) {
        // If the meteor was below the canvas
        if (meteors[i].y > gameArea.canvas.height) { 
            meteors[i].x = Math.random() * (gameArea.canvas.width - 30);
            meteors[i].y = 0;
    
            meteors[i].speedY = Math.random() * 20; 
        }
        
        // Update meteor frame 
        meteors[i].newPos();
        meteors[i].update();
    }

    // Update player frame
    player.newPos();
    player.update();
}

// Game System 