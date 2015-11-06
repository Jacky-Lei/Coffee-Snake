(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Game = SG.Game = function ($el) {
    this.$el = $el;
    this.board = {};
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  Game.prototype.handleKeyEvent = function (event) {
    if (event.keyCode === 13 && typeof(this.board.dimensions) === "undefined") {
      this.board = new SG.Board(15, this.$el);
      var $document = $(document);
      $(".score-container").addClass("score-visible");
        // $(".score").addClass("score-visible");
      $(".enter-play").remove();
    }

    if (event.keyCode === 13 && !(this.board.snake.validPosition())) {

      $(".score-number").text(0);
      this.board = new SG.Board(15, this.$el);
      $(".game-over-visible").removeClass("game-over-visible");


    }
  }

  var Apple = SG.Apple = function (dimensions, snake) {
    this.replace(dimensions, snake);
  };






  Apple.prototype.replace = function (dimensions, snake) {
    this.symbol = "A";
    appleX = Math.floor(dimensions * Math.random());
    appleY = Math.floor(dimensions * Math.random());
    this.dimensions = [[appleX, appleY]];

    while (snake.isOccupying(this.dimensions[0])) {
      appleX = Math.floor(dimensions * Math.random());
      appleY = Math.floor(dimensions * Math.random());
      this.dimensions = [[appleX, appleY]];
    }
  }

  Apple.prototype.isOccupying = function (array) {
    (this.dimensions[0][0] === array[0] && this.dimensions[0][0] === array[1])
  }

  var PowerUpApple = SG.PowerUpApple = function (dimensions, snake, apple) {
    this.replace(dimensions, snake, apple);
  };

  PowerUpApple.prototype.replace = function (dimensions, snake, apple) {
    this.symbol = "P";
    powerUpAppleX = Math.floor(dimensions * Math.random());
    powerUpAppleY = Math.floor(dimensions * Math.random());
    this.dimensions = [[powerUpAppleX, powerUpAppleY]];

    while ( snake.isOccupying(this.dimensions[0]) || apple.isOccupying(this.dimensions[0]) ) {
      powerUpAppleX = Math.floor(dimensions * Math.random());
      powerUpAppleY = Math.floor(dimensions * Math.random());
      this.dimensions = [[powerUpAppleX, powerUpAppleY]];
    }
  }

  var Snake = SG.Snake = function (board) {
    this.board = board;

    var snakePos = Math.floor(this.board.dimensions/2);
    this.segments = [[snakePos, snakePos]];
    this.symbol = "s";
    this.growTurns = 0;
    this.powerTurns = 0;
    this.multiplier = 1;
    this.direction = [-1, 0];
    this.poweredUp = false;
    this.turnTracker = [];
    this.directionTracker = [];
  }

  Snake.prototype.head = function () {
    return this.segments[this.segments.length-1];
  }

//   Snake.prototype.scoreCommaSeparateNumber = function (val){
//   while (/(\d+)(\d{3})/.test(val.toString())){
//     val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
//   }
//   return val;
// }

Snake.prototype.scoreCommaSeparateNumber = function (val){
var digits = String(val).split("");
var result = [];
var commaIdx = ((digits.length % 3) - 1);
for ( var i = 0; i < digits.length; i++) {
  if ((i === commaIdx) && (i !== digits.length-1)) {
  result.push(digits[i] + ",");
    commaIdx += 3;
} else {
  result.push(digits[i]);
}

}
return result.join("");
}

  Snake.prototype.move = function () {

    this.segments.push([this.head()[0] + this.direction[0], this.head()[1] + this.direction[1]]);
    if (!this.validPosition()){
      console.log("game over! Hit enter to play again!");
      $(".game-over").addClass("game-over-visible");


      clearInterval(this.board.defaultInterval);






    } else if (this.head()[0] < 0 ){
      this.segments.push([this.board.dimensions - 1, this.head()[1]]);
      this.segments.shift();
    } else if (this.head()[0] > this.board.dimensions - 1 ){
      this.segments.push([0, this.head()[1]]);
      this.segments.shift();
    } else if (this.head()[1] < 0 ){
      this.segments.push([this.head()[0], this.board.dimensions - 1]);
      this.segments.shift();
    }
    // else if ((this.head()[1] > this.board.dimensions - 2 ) && (this.segments.length > 2)){
    //   this.segments.push([this.head()[0], 0]);
    //   this.segments.shift();
    // }
     else if (this.head()[1] > this.board.dimensions - 1 ){
      this.segments.push([this.head()[0], 0]);

      for(var i = 0; i < this.segments.length; i++){
        if( this.segments[i][1] > this.board.dimensions - 1){
          this.segments[i][1] = 0;
        }
      }

      this.segments.shift();
    }

    if (this.eatApple(this.board.apple)){
      this.board.score += (100 * this.multiplier);
      $(".score-number").text(this.scoreCommaSeparateNumber(this.board.score));
      this.board.apple.replace(this.board.dimensions, this);
    }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
    this.segments.shift();
    }

    if (this.eatPowerUpApple(this.board.powerUpApple)){
      this.board.powerUpAppleEaten = true;

      setTimeout(function () {
        this.board.powerUpAppleEaten = false;
      }.bind(this), 5000)

      setTimeout(function () {
        this.board.powerUpApple.replace(this.board.dimensions, this, this.board.apple);
      }.bind(this), 5000)
    }

    if (this.powerTurns > 0) {
      this.multiplier = 2;
      this.powerTurns -= 1;
      if (typeof (this.board.powerInterval) === "undefined" || (this.board.powerInterval < this.board.defaultInterval) ) {
      clearInterval(this.board.defaultInterval);
      this.board.powerInterval = setInterval( function () {
        this.board.moveSnake()}.bind(this), 100)
      }
      // this.board.moveSnake(100);
    } else {
      this.multiplier = 1;

      if ( (this.board.powerInterval) && (this.board.defaultInterval < this.board.powerInterval) ) {

      clearInterval(this.board.powerInterval);
      this.board.defaultInterval = setInterval( function () {
        this.board.moveSnake()}.bind(this), 300)
      }
    }

  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;
    this.segments.forEach( function (segment) {
      if (segment[0] === array[0] && segment[1] === array[1])
      result = true;
      return result;
    })
    return result;
  }

  Snake.prototype.eatApple = function (apple) {
    if (this.head()[0] === apple.dimensions[0][0] && this.head()[1] === apple.dimensions[0][1]){
      this.growTurns += 3;
      return true;
    } else {
      return false
    }
  };

  Snake.prototype.eatPowerUpApple = function (powerUpApple) {
    if (this.head()[0] === powerUpApple.dimensions[0][0] && this.head()[1] === powerUpApple.dimensions[0][1]){
      this.powerTurns = 30;
      return true;
    } else {
      return false
    }
  };

  Snake.prototype.turn = function (direction) {
    this.direction = direction
    this.turnTracker.push(this.head());
  }

  Snake.prototype.validPosition = function () {
    if (this.powerTurns > 0) {
      return true;
    }

    if (!((this.head()[0] >= 0) &&
    (this.head()[1] >= 0) &&
    (this.head()[0] < this.board.dimensions) &&
    (this.head()[1] < this.board.dimensions)))
     {
      return false;
    }

    for (var i = 0; i < this.segments.length - 1; i++){
      if ((this.segments[i][0] === (this.head())[0]) &&
          (this.segments[i][1] === (this.head())[1])) {
        return false;
      }
    }

    return true;
  }

  var Board = SG.Board = function (dimensions, $el) {
    this.score = 0;

    this.dimensions = dimensions;
    this.snake = new Snake(this);
    this.apple = new Apple(dimensions, this.snake);
    this.powerUpApple = new PowerUpApple(dimensions, this.snake, this.apple);
    this.$el = $el;
    this.speed = 300;
    this.powerUpAppleEaten = false;

    $(window).on("keydown", this.handleKeyEvent.bind(this));

    this.defaultInterval = setInterval( function () {
      this.moveSnake()}.bind(this), this.speed);
  };

  Board.prototype.moveSnake = function () {
    // debugger
    // clearInterval(window.intervalID);
    //
    // window.intervalID = setInterval(function () {

      this.snake.move();
      if (this.snake.validPosition()) {
        this.render();
      }


    // }.bind(this), speed)

  }

Board.prototype.blankGrid = function (dimensions) {
  var grid = []
  i = 0;
  while (i < dimensions) {
    row = [];
    var j = 0;
    while (j < dimensions) {
        // row.push(".");
      row.push("<div class='cell'></div>");
      j++;
    }
    grid.push(row);
    i++;
  }
  return grid;
}

  KEYS = {
    38: [[-1, 0], "N"],
    39: [[0, 1], "E"],
    40: [[1, 0], "S"],
    37: [[0, -1], "W"],
  };

  Board.prototype.handleKeyEvent = function (event) {
    // ignores input that forces snake to run backwards
    if ( ( (KEYS[event.keyCode]) && (KEYS[event.keyCode][0][0] !== this.snake.direction[0] + 2 && KEYS[event.keyCode][0][0] !== this.snake.direction[0] - 2) ) &&
        ( (KEYS[event.keyCode]) && (KEYS[event.keyCode][0][1] !== this.snake.direction[1] + 2 && KEYS[event.keyCode][0][1] !== this.snake.direction[1] - 2) ) )
     {
          this.snake.turn(KEYS[event.keyCode][0]);
          this.snake.directionTracker.push(KEYS[event.keyCode][1]);
    }
  };

  Board.prototype.render = function () {
    var grid = this.blankGrid(this.dimensions);

    grid[this.apple.dimensions[0][0]][this.apple.dimensions[0][1]] = "<div class='apple'><div class='appleImage'></div></div>";
    if (!this.powerUpAppleEaten){
    grid[this.powerUpApple.dimensions[0][0]][this.powerUpApple.dimensions[0][1]] = "<div class='coffee'>&#9749</div>";}

    var directionClass = "";
    if (String(this.snake.direction) === String([-1, 0]) ){
      var directionClass = "N";
    } else if (String(this.snake.direction)=== String([0, 1]) ){
      var directionClass = "E";
    } else if (String(this.snake.direction) === String([1, 0]) ){
      var directionClass = "S";
    } else if (String(this.snake.direction) === String([0, -1]) ){
      var directionClass = "W";
    }

    for (var i = 0; i < this.snake.segments.length; i++){
      if (this.snake.segments[i][0] < 0) {
        this.snake.segments[i][0] = this.dimensions - 1;
      } else if (this.snake.segments[i][0] > (this.dimensions -1 )){
        this.snake.segments[i][0] = 0;
      }

      if (i === this.snake.segments.length - 1) {
        grid[this.snake.segments[i][0]][this.snake.segments[i][1]] = "<div class='snakeHead" + directionClass + "'></div>";
      }  else if (this.snake.powerTurns > 0) {
        grid[this.snake.segments[i][0]][this.snake.segments[i][1]] = "<div class='caffeinatedSnake'></div>";
      } else {
    grid[this.snake.segments[i][0]][this.snake.segments[i][1]] = "<div class='snake'></div>";
  }
  }

    var joinedGrid = grid.map( function (row) {
      return row.join("");
    });
    this.$el.html("<pre>" + joinedGrid.join("\n") + "</pre>");
  };


})();
