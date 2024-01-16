import React from "react";
import { Algorithm } from "../Algorithm";
import { Node, Position, Status } from "../../components/Tile";
import { MazeSettings } from "../../components/Maze";

export class RecursiveBacktracking extends Algorithm {
  visited: Position[];

  constructor(state: Node[][], setState: Function,mazeSettings:MazeSettings) {
    super(state, setState,mazeSettings);
    this.visited = [];
  }

  async algorithm() {
    let start = this.getRandomPosition();
    await this.recursiveHelper(start);
  }

  async recursiveHelper(cur: Position) {
    if (!cur) return;
    this.visited.push(cur);
    let { x, y } = cur;
    this.temp[x][y].status = Status.Current;
    for (const i of this.getRandomUnvisitedNeighbors(cur)) {
      if (this.isUnvisited(i)) {
        let { x, y } = i;
        this.temp[x][y].status = Status.Visited;
        this.removeWall(i, cur);
        await this.recursiveHelper(i);
      }
    }
    await this.update(); // update render

    return;
  }

  getRandomUnvisitedNeighbors(start: Position) {
    let unvisitedNeighbors = this.getNeighbors(start).filter((n) =>
      this.isUnvisited(n)
    );
    return unvisitedNeighbors.sort(() => Math.random() - 0.5);
  }

  isUnvisited(pos: Position) {
    return !this.visited.some((obj) => obj.x == pos.x && obj.y == pos.y);
  }
}
