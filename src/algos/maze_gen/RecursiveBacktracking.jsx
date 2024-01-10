import React from "react";
import { Algorithm } from "../Algorithm";

export class RecursiveBacktracking extends Algorithm {
  constructor(state, setState) {
    super(state, setState);
    this.visited = [];
  }

  async algorithm() {
    let start = this.getRandomPosition();
    await this.recursiveHelper(start);
  }

  getRandomUnvisitedNeighbors(start) {
    let unvisitedNeighbors = this.getNeighbors(start).filter((n) =>
      this.isUnvisited(n)
    );
    return unvisitedNeighbors.sort(() => Math.random() - 0.5);
  }

  async recursiveHelper(cur) {
    console.log("running", this.visited);
    if (!cur) return;
    this.visited.push(cur);

    let { x, y } = cur;
    this.temp[x][y].selected = true;
    await this.update(); // update render
    for (const i of this.getRandomUnvisitedNeighbors(cur)) {
      if (this.isUnvisited(i)) {
        let { a, b } = i;
        this.temp[a][b].selected = false;
        // this.temp[a][b].frontier = true;
        await this.update(); // update render
        this.removeWall(i, cur);
        await this.recursiveHelper(i);
      }
    }
    return;
  }

  isUnvisited(pos) {
    return !this.visited.some((obj) => obj.x == pos.x && obj.y == pos.y);
  }
}
