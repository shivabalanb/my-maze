import { MazeSettings } from "../../components/Maze";
import { Node, Position, Status } from "../../components/Tile";
import { Algorithm } from "../Algorithm";

export class RecursiveDivision extends Algorithm {
  constructor(state: Node[][], setState: Function, mazeSettings: MazeSettings) {
    super(state, setState, mazeSettings);
  }

  async algorithm() {
    await this.removeAllWalls();
    await this.helper();
  }

  async helper(
    rMin: number = 1,
    rMax: number = this.rows - 1,
    cMin: number = 0,
    cMax: number = this.cols - 2
  ) {
    // borders-> vertical: right, horizontal: top: because topBorder depends on rightborder
    if (cMax < cMin && rMax < rMin) return;
    let dir = this.getBiasedDirection(rMax - rMin, cMax - cMin);
    // let dir = this.randomDir();
    if (cMax < cMin) dir = "horizontal";
    if (rMax < rMin) dir = "vertical";
    let splitRCIndex =
      dir == "vertical"
        ? await this.randomI(cMin, cMax)
        : this.randomI(rMin, rMax);
    if (dir == "vertical") await this.verticalWall(splitRCIndex, rMin, rMax);
    else this.horizontalWall(splitRCIndex, cMin, cMax);

    if (dir == "vertical") {
      await this.helper(rMin, rMax, cMin, splitRCIndex - 1);
      await this.helper(rMin, rMax, splitRCIndex + 1, cMax);
    } else {
      await this.helper(rMin, splitRCIndex - 1, cMin, cMax);
      await this.helper(splitRCIndex + 1, rMax, cMin, cMax);
    }
  }

  async verticalWall(c: number, rMin: number, rMax: number) {
    const exclude = this.randomI(rMin - 1, rMax);
    for (let i = rMin - 1; i <= rMax; i++) {
      if (i != exclude) {
        this.temp[i][c].walls[1] = 1;
      }
    }
    await this.update();
  }

  async horizontalWall(r: number, cMin: number, cMax: number) {
    const exclude = this.randomI(cMin, cMax + 1);
    for (let i = cMin; i <= cMax + 1; i++) {
      if (i != exclude) {
        this.temp[r][i].walls[0] = 1;
      }
    }
    await this.update();
  }

  getBiasedDirection(rRange: number, cRange: number) {
    if (cRange > rRange)
      return this.random(2) == 1 && this.random(2) == 1
        ? "horizontal"
        : "vertical";
    else if (rRange > cRange)
      return this.random(2) == 1 && this.random(2) == 1
        ? "vertical"
        : "horizontal";
    else return this.randomDir();
  }

  randomI(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomDir() {
    return this.random(2) != 1 ? "vertical" : "horizontal";
  }

  async removeAllWalls() {
    let [rows, cols] = [this.rows, this.cols];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let [top, right, bottom, left] = [true, true, true, true];
        if (i == 0) top = false;
        if (i == rows - 1) bottom = false;
        if (j == 0) left = false;
        if (j == cols - 1) right = false;
        this.removeNodeWalls({ x: i, y: j }, top, right, bottom, left);
      }
    }
    await this.update();
  }

  removeNodeWalls(
    pos: Position,
    top: boolean,
    right: boolean,
    bottom: boolean,
    left: boolean
  ) {
    let prev = this.temp[pos.x][pos.y].walls;
    this.temp[pos.x][pos.y].walls = [
      top ? 0 : prev[0],
      right ? 0 : prev[1],
      bottom ? 0 : prev[2],
      left ? 0 : prev[3],
    ];
  }
}
