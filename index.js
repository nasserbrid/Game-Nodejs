const keypress = require("keypress");

keypress(process.stdin);

class Cell {
  constructor(position_x, position_y) {
    this.position_x = position_x;
    this.position_y = position_y;
  }

  print() {
    process.stdout.write("#");
  }

  printAsOccupied() {
    process.stdout.write("*");
  }

  printAsHoleOccupied() {
    process.stdout.write("O");
  }

  printAsHatOccupied() {
    process.stdout.write("^");
  }
}

class Field {
  constructor(length, width) {
    this.length = length;
    this.width = width;
    this.grid = [];
    this.holes = Math.floor(0.1 * this.length * this.width);
    this.star_location_x = Math.floor(Math.random() * (this.width - 1));
    this.star_location_y = Math.floor(Math.random() * (this.length - 1));
    this.previous_star_location_x = this.star_location_x;
    this.previous_star_location_y = this.previous_star_location_y;

    for (let row_index = 0; row_index < this.length; row_index++) {
      let row = [];
      for (let colum_index = 0; colum_index < this.width; colum_index++) {
        row.push(new Cell(colum_index, row_index));
      }
      this.grid.push(row);
    }

    for (let i = 0; i < this.holes; i++) {
      let hole_x = Math.floor(Math.random() * (this.width - 1));
      let hole_y = Math.floor(Math.random() * (this.length - 1));
      this.grid[hole_y][hole_x].isHole = true;
    }

    this.hat = {
      x: Math.floor(Math.random() * (this.width - 1)),
      y: Math.floor(Math.random() * (this.length - 1)),
    };
  }

  print() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    for (let row_index = 0; row_index < this.length; row_index++) {
      for (let colum_index = 0; colum_index < this.width; colum_index++) {
        let cell = this.grid[row_index][colum_index];
        if (
          this.previous_star_location_x == colum_index &&
          this.previous_star_location_y == row_index
        ) {
          cell.printAsOccupied;
        } else if (
          this.star_location_x === colum_index &&
          this.star_location_y === row_index
        ) {
          cell.printAsOccupied();
        } else if (cell.isHole) {
          cell.printAsHoleOccupied();
        } else if (this.hat.x === colum_index && this.hat.y === row_index) {
          cell.printAsHatOccupied();
        } else {
          cell.print();
        }
      }
      console.log();
    }
  }
}

const field = new Field(10, 10);
field.print();

process.stdin.on("keypress", function (ch, key) {
  if (key && key.ctrl && key.name === "c") {
    process.stdin.pause();
  } else {
    if (key.name === "up" && field.star_location_y > 0) {
      field.previous_star_location_y = field.star_location_y;
      field.star_location_y--;
    }
    if (key.name === "down" && field.star_location_y < field.length - 1) {
      field.previous_star_location_y = field.star_location_y;
      field.star_location_y++;
    }
    if (key.name === "left" && field.star_location_x > 0) {
      field.previous_star_location_x = field.star_location_x;
      field.star_location_x--;
    }
    if (key.name === "right" && field.star_location_x < field.width - 1) {
      field.previous_star_location_x = field.star_location_y;
      field.star_location_x++;
    }
    if (field.grid[field.star_location_y][field.star_location_x].isHole) {
      console.log("Sorry, you fell down!");
    }

    if (
      field.star_location_x === field.hat.x &&
      field.star_location_y === field.hat.y
    ) {
      console.log("Congrats, you win!");
      process.exit();
    }
    field.print();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
