import { MazeSettings } from "../components/Maze";
import { Node, Position, Status } from "../components/Tile";

/**
 * Recursive Backtracking:

Simple and efficient algorithm.
Uses backtracking to carve paths.
Starts from a random cell and keeps exploring until it reaches a dead end, then backtracks.
Can generate perfect mazes (no loops or isolated areas).
Prim's Algorithm:

Originated from the Minimum Spanning Tree concept.
Randomized version known as "Randomized Prim's Algorithm" generates mazes efficiently.
Starts with a grid and expands regions randomly by adding walls between cells.
Forms a spanning tree until all cells are connected.
Kruskal's Algorithm:

Another Minimum Spanning Tree-based algorithm.
Starts with walls between all cells and then gradually removes walls to connect regions.
Operates by merging sets of cells into larger sets until all cells belong to the same set.
Eller's Algorithm:

Works row by row, connecting adjacent cells.
Builds the maze horizontally, ensuring each set of cells in a row is connected.
Efficiently creates mazes without needing to backtrack.
Binary Tree Algorithm:

Simple and fast algorithm.
Divides the grid into quarters or halves and connects neighboring cells.
Generates mazes with a bias in paths, leading to a diagonal or vertical/horizontal preference.
 */

/**
 * Right now base Algorithm class for maze gen and path finding
 * don't know if need separate class
 * how many await update do you need?
 */

export interface AlgorithmProps {
  temp: Node[][];
  setState: Function;
  mazeSettings: MazeSettings;
}

export class Algorithm {
  temp: Node[][];
  setState: Function;
  rows: number;
  cols: number;
  speed: number;

  constructor(state: Node[][], setState: Function, mazeSettings: MazeSettings) {
    this.temp = [...state]; // algorithm temp state where changes are made
    this.setState = setState; // change to state(render): changes actually go into effect
    this.rows = mazeSettings.rows;
    this.cols = mazeSettings.cols;
    this.speed = mazeSettings.speed;
  }

  async algorithm() {
    // dummy algo: selects all tiles
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.temp[i][j].status = Status.Visited;
        await this.update();
      }
    }
  }

  /* renders changes and has timeout to pause program execution to view state changes */
  async update(speed = this.speed) {
    this.setState([...this.temp]);
    await new Promise((resolve) => setTimeout(resolve, speed));
  }

  async setStatus(pos: Position, status: Status, update: boolean = false) {
    let { x, y } = pos;
    this.temp[x][y].status = status;
    if (update) await this.update(); // update render
  }

  /* valid neigboring nodes based pos  */
  getNeighbors(pos: Position, random: boolean = false) {
    let [r, c] = [this.rows, this.cols];
    let neighbors: Position[] = [];
    let { x, y } = pos;
    if (x > 0) neighbors.push({ x: x - 1, y: y }); // top
    if (x < r - 1) neighbors.push({ x: x + 1, y: y }); // bottom
    if (y > 0) neighbors.push({ x: x, y: y - 1 }); // left
    if (y < c - 1) neighbors.push({ x: x, y: y + 1 }); // right
    return random ? neighbors.sort(() => Math.random() - 0.5) : neighbors;
  }

  /* assuming outside and inside are adjacent, handles wall removal  */
  removeWall(outside: Position, inside: Position) {
    let { temp } = this;
    let [x1, y1] = [outside.x, outside.y];
    let [x2, y2] = [inside.x, inside.y];
    if (y1 == y2) {
      //top
      if (x2 < x1) {
        temp[x1][y1].walls[0] = 0;
        temp[x2][y2].walls[2] = 0;
      }
      //bottom
      else {
        temp[x1][y1].walls[2] = 0;
        temp[x2][y2].walls[0] = 0;
      }
    } else {
      //right
      if (y2 > y1) {
        temp[x1][y1].walls[1] = 0;
        temp[x2][y2].walls[3] = 0;
      }
      //left
      else {
        temp[x1][y1].walls[3] = 0;
        temp[x2][y2].walls[1] = 0;
      }
    }
  }

  getRandomPosition(): Position {
    return {
      x: this.random(this.rows),
      y: this.random(this.cols),
    };
  }

  /* auxilary */
  random(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getRandomHexColor(): string {
    // Generate a random hexadecimal color code
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Ensure the color code has 6 digits by padding with zeros if needed
    return "#" + "0".repeat(6 - randomColor.length) + randomColor;
  }

  /* set functions */
  findInSet(set: Set<Position>, obj: Position) {
    for (const a of set) {
      if (a.x == obj.x && a.y == obj.y) return true;
    }
    return false;
  }

  popRandomSet(set: Set<Position>, del = true): Position {
    let r_index = Math.floor(Math.random() * set.size);

    let i = 0;
    for (const v of set.values()) {
      if (i == r_index) {
        if (del) set.delete(v);
        return v;
      }
      i++;
    }
    return { x: -1, y: -1 };
  }
}
