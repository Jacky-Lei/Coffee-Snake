(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Coord = SG.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };


  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j);
  };


  var Snake = SG.Snake = function (board) {
    this.dir = "N";
    this.turning = false;
    this.board = board;

    var center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];

  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };



  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function () {
    var head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    // snake will die if it crashes into itself

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.move = function () {

    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));

    this.turning = false;


    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    if (!this.isValid()) {
      this.segments = [];
    }
  };


  var Board = SG.Board = function (dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    // this.apple = new Apple(this);
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function (dim) {
    var grid = [];

    for (var i = 0; i < dim; i++) {
      var row = [];
      for (var j = 0; j < dim; j++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }

    return grid;
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);

    this.snake.segments.forEach(function (segment) {
      grid[segment.i][segment.j] = Snake.SYMBOL;
    });


    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i < this.dim) &&
      (coord.j >= 0) && (coord.j < this.dim);
  };
})();
