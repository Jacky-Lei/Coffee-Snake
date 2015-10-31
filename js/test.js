(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }


  var Snake = SG.Snake = function (dimensions) {
    var snakePos = Math.floor(dimensions/2);
    this.segments = [[snakePos, snakePos]];
    this.oldSegments = [];
    this.symbol = "s";
    this.direction = [-1, 0]
    this.boardDimensions = dimensions;
  }

  Snake.prototype.move = function () {
    this.oldSegments = this.segments[0];
    this.segments[0] = [this.segments[0][0] + this.direction[0], this.segments[0][1] + this.direction[1]];
    if (!this.validPosition()){
      alert("game over!");
    }
  };

  Snake.prototype.turn = function (direction) {
    this.direction = direction
  }

  Snake.prototype.validPosition = function () {
    if ((this.segments[0][0] >= 0) &&
    (this.segments[0][1] >= 0) &&
    (this.segments[0][0] < this.boardDimensions) &&
    (this.segments[0][1] < this.boardDimensions)) {
      return true;
    } else {
      return false;
    }
  }

  var Board = SG.Board = function (dimensions, $el) {
    this.grid = [];
    this.snake = new Snake(dimensions);
    this.$el = $el;
    $(window).on("keydown", this.handleKeyEvent.bind(this));

    i = 0;
    while (i < dimensions) {
      row = [];
      var j = 0;
      while (j < dimensions) {
        row.push(".");
        j++;
      }

      this.grid.push(row);
      i++;
    }
    this.render();
    // this.snake.move();
    // this.render();
    setInterval(function () {
      this.snake.move();
      this.render();

    }.bind(this), 300)
  };

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

    // this.snake.segments.forEach(function (segment){
    //   this.grid[segment[0]][segment[1]] = "S";
    // }.bind(this));

    this.grid[this.snake.segments[0][0]][this.snake.segments[0][1]] = "S";

    if (this.snake.oldSegments.length !== 0) {
      // debugger;
      this.grid[this.snake.oldSegments[0]][this.snake.oldSegments[1]] = ".";
    }

    // needt to make new joinedGrid because old one will be a string and cannot be
    // re-rendered with a join

    var joinedGrid = this.grid.map( function (row) {
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
