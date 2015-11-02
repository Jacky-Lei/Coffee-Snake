(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Game = SG.Game = function ($el) {

    this.$el = $el;
    this.board = {};
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    // new SG.Board(10, $el);
  }

  Game.prototype.handleKeyEvent = function (event) {
    if (event.keyCode === 13 && typeof(this.board.dimensions) === "undefined") {
      this.board = new SG.Board(10, this.$el);
      var $document = $(document);
      $("#enter-play").remove();
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

    while (snake.isOccupying(dimensions)) {
      appleX = Math.floor(dimensions * Math.random());
      appleY = Math.floor(dimensions * Math.random());
      this.dimensions = [[appleX, appleY]];
    }
  }

  // Board.prototype.makeApple = function (){
  //
  //   new Apple(this.dimensions);
  // }


  var Snake = SG.Snake = function (board) {

    this.board = board;

    var snakePos = Math.floor(this.board.dimensions/2);
    this.segments = [[snakePos, snakePos]];


    this.symbol = "s";
    this.growTurns = 0;
    this.direction = [-1, 0]

  }

  Snake.prototype.head = function () {
    return this.segments[this.segments.length-1];
  }

  Snake.prototype.move = function () {

    this.segments.push([this.head()[0] + this.direction[0], this.head()[1] + this.direction[1]]);
    if (!this.validPosition()){
      console.log("game over!");
    }

    if (this.eatApple(this.board.apple)){
      this.board.score += 100;
      $("#score").text(this.board.score);
      this.board.apple.replace(this.board.dimensions, this);
    }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
    this.segments.shift();

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
      this.growTurns += 1;
      return true;
    } else {
      return false
    }
  };

  Snake.prototype.turn = function (direction) {
    this.direction = direction
  }

  Snake.prototype.validPosition = function () {
    if ((this.head()[0] >= 0) &&
    (this.head()[1] >= 0) &&
    (this.head()[0] < this.board.dimensions) &&
    (this.head()[1] < this.board.dimensions)) {
      return true;
    } else {
      return false;
    }
  }

  var Board = SG.Board = function (dimensions, $el) {
    this.score = 0;
    var $score = $("#score");
    $score.text(this.score);

    this.dimensions = dimensions;
    this.snake = new Snake(this);
    this.apple = new Apple(dimensions, this.snake);

    this.$el = $el;
    $(window).on("keydown", this.handleKeyEvent.bind(this));


    this.render();
    // this.snake.move();
    // this.render();
    setInterval(function () {
      this.snake.move();

      // if (this.snake.eatApple?(this.apple)){
      //   this.snake.grow();
      // }
      this.render();

    }.bind(this), 300)
  };

Board.prototype.blankGrid = function (dimensions) {
  var grid = []
  i = 0;
  while (i < dimensions) {
    row = [];
    var j = 0;
    while (j < dimensions) {
      row.push(".");
      j++;
    }

    grid.push(row);
    i++;
  }
  return grid;
}

  KEYS = {
    38: [-1, 0],
    39: [0, 1],
    40: [1, 0],
    37: [0, -1]
  };

  Board.prototype.handleKeyEvent = function (event) {
    if (KEYS[event.keyCode]) {
          this.snake.turn(KEYS[event.keyCode]);
    }
  };

  Board.prototype.render = function () {
    var grid = this.blankGrid(this.dimensions);

    this.snake.segments.forEach(function (segment){
      grid[segment[0]][segment[1]] = "S";
    })

    // this.grid[this.snake.segments[0][0]][this.snake.segments[0][1]] = "S";


    grid[this.apple.dimensions[0][0]][this.apple.dimensions[0][1]] = "A";

    // if ((this.snake.oldSegments.length !== 0) && !(this.snake.eatApple(this.apple))) {
    //     this.segments.shift
    //   // this.grid[this.snake.oldSegments[0]][this.snake.oldSegments[1]] = ".";
    // } else if ((this.snake.oldSegments.length !== 0) && (this.snake.eatApple(this.apple))) {
    //   this.grid[this.snake.oldSegments[0]][this.snake.oldSegments[1]] = "S";
    //   this.grid[this.apple.dimensions[0][0]][this.apple.dimensions[0][1]] = ".";
    //   this.apple = new Apple(dimensions);
    // }

    // needt to make new joinedGrid because old one will be a string and cannot be
    // re-rendered with a join

    var joinedGrid = grid.map( function (row) {
      return row.join("");
    });
    this.$el.html("<pre>" + joinedGrid.join("\n") + "</pre>");
  };


  // var sampleBoard = new Board(10);
  //
  // sampleBoard.render();
  // window.sampleGrid = sampleBoard.grid;

    // row = row.join("");
// this.grid = this.grid.join("\n");


})();
