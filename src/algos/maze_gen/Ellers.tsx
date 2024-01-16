
import { MazeSettings } from "../../components/Maze";
import { Node, Position, Status } from "../../components/Tile";
import { Algorithm } from "../Algorithm";


export class Ellers extends Algorithm {
  color: { [key: string]: Position[] }; // color -> edges
  edges: { [key: string]: Position[] };

  constructor(state: Node[][], setState: Function, mazeSettings:MazeSettings) {
    super(state, setState,mazeSettings);
    this.color = {};
    this.edges = {};
  }
  async algorithm() {
    for (let i = 0; i < this.rows; i++) {
      await this.assignNodesWithoutColor(i);
      // adjacent connection
      await this.handleAdjacentConnect(i);
      // vertical connection
      await this.handleVerticalConnect(i);
    }
  }

  async handleVerticalConnect(i: number) {
    if (i != this.rows - 1) {
      for (const color of Object.keys(this.color)) {
        let colorNodesInRow = this.color[color].filter((obj) => obj.x == i);
        let mustConnect = this.random(colorNodesInRow.length);
        colorNodesInRow.map(async (a, index) => {
          if (index == mustConnect || this.random(2) == 1) {
            let aNode = this.temp[a.x][a.y];
            let bNode = this.temp[a.x + 1][a.y];
            this.removeWall(aNode.pos, bNode.pos); // 2. remove Wall
            this.color[aNode.color].push(bNode.pos);
            bNode.status = Status.Color;
            bNode.color = aNode.color;
            await this.update();
          }
        });
      }
    }
  }

  async handleAdjacentConnect(i: number) {
    for (let j = 0; j < this.cols; j++) {
      let aNode = this.temp[i][j];
      const lastRowCondition =
        i == this.rows - 1 &&
        j != this.cols - 1 &&
        aNode.color != this.temp[i][j + 1].color;
      if (i == this.rows - 1 && !lastRowCondition) continue;
      if (lastRowCondition || this.random(2) == 1) {
        let bNode;
        if (lastRowCondition || j == 0) bNode = this.temp[i][j + 1];
        else if (j == this.cols - 1) bNode = this.temp[i][j - 1];
        else {
          bNode = this.random(2) ? this.temp[i][j + 1] : this.temp[i][j - 1];
        }
        let [aColor, bColor] = [aNode.color, bNode.color];
        let [aPosition, bPosition] = [aNode.pos, bNode.pos];
        if (aColor == bColor) continue; // 1. both elements in same set(setColor)
        this.removeWall(aPosition, bPosition); // 2. remove Wall

        for (const member of this.color[bColor]) {
          this.toNode(member).color = aColor; //3. update color to aColor
          this.color[aColor].push(member); //4. merge members to aColor
        }
        delete this.color[bColor]; //5. delete bColor entry, that set ceases to exist
        await this.update();
      }
    }
  }

  async assignNodesWithoutColor(row: number) {
    for (let j = 0; j < this.cols; j++) {
      // 1. unasigned tiles -> set
      let node = this.temp[row][j];
      if (node.status != Status.Color) {
        let setColor = this.getRandomHexColor();
        let pos = { x: row, y: j };
        this.color[setColor] = [pos];
        node.color = setColor;
        node.status = Status.Color;
      }
      await this.update();
    }
  }

  getIndex(arr: Position[], pos: Position) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].x == pos.x && arr[i].y == pos.y) return i;
    }
  }

  toString(pos: Position) {
    return `${pos.x},${pos.y}`;
  }

  toNode(pos: Position) {
    return this.temp[pos.x][pos.y];
  }

  toPosition(str: string) {
    let a = str.split(",");
    return { x: parseInt(a[0]), y: parseInt(a[1]) };
  }

  toColor(pos: Position) {
    return this.temp[pos.x][pos.y].color;
  }

  randomKey(obj: Object) {
    return Object.keys(obj)[this.random(Object.keys(obj).length)];
  }
}
