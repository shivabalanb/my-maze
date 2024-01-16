import { MazeSettings } from "../../components/Maze";
import { Node, Position, Status } from "../../components/Tile";
import { Algorithm } from "../Algorithm";


interface edgeMeta {
  aStr: string;
  aPosition: Position;
  aColor: string;
  aIndex: number | undefined;
  bStr: string;
  bPosition: Position;
  bColor: string;
  bIndex: number | undefined;
}

export class Kruskals extends Algorithm {
  color: { [key: string]: Position[] }; // color -> edges
  edges: { [key: string]: Position[] };
  constructor(state: Node[][], setState: Function,mazeSettings:MazeSettings) {
    super(state, setState,mazeSettings);
    this.color = {};
    this.edges = {};
  }

  async algorithm() {
    await this.initializeSets();
    let i = 0;
    while (Object.keys(this.color).length != 1) {
      i++;

      // a and b are the nodes sharing an edge to be connected
      const {
        aStr,
        aPosition,
        aColor,
        aIndex,
        bStr,
        bPosition,
        bColor,
        bIndex,
      } = this.getEdgeMeta();
      //   remove this edge from a and b vertex, this edge should not be chosen again
      this.edges[aStr].slice(bIndex, 1);
      this.edges[bStr].slice(aIndex, 1);
      if (aColor == bColor) continue; // 1. both elements in same set(setColor)
      this.removeWall(aPosition, bPosition); // 2. remove Wall
      for (const member of this.color[bColor]) {
        this.toNode(member).color = aColor; //3. update color to aColor
        this.color[aColor].push(member); //4. merge members to aColor
      }
      delete this.color[bColor]; //5. delete bColor entry, that set ceases to exist
      await this.update();
    }

    // await this.setAllDefault();
  }

  getEdgeMeta(): edgeMeta {
    const aStr = this.randomKey(this.edges);
    const aPosition = this.toPosition(aStr);
    const aColor = this.toColor(aPosition);
    const bIndex = this.random(this.edges[aStr].length);
    const bPosition = this.edges[aStr][bIndex];
    const bStr = this.toString(bPosition);
    const bColor = this.toColor(bPosition);
    const aIndex = this.getIndex(this.edges[bStr], aPosition);
    return {
      aStr: aStr,
      aPosition: aPosition,
      aColor: aColor,
      aIndex: aIndex,
      bStr: bStr,
      bPosition: bPosition,
      bColor: bColor,
      bIndex: bIndex,
    };
  }

  async setAllDefault() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.temp[i][j].status = Status.Current;
      }
      await this.update(50);
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

  

  async initializeSets() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let setColor = this.getRandomHexColor();
        let pos = { x: i, y: j };
        this.color[setColor] = [pos];
        this.edges[this.toString(pos)] = [...this.getNeighbors(pos)];
        this.temp[i][j].color = setColor;
        this.temp[i][j].status = Status.Color;
      }
      //   await this.update();
    }
  }
}
