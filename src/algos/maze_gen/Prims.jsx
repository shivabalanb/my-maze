/*
Starts with a grid where all cells are walls.
Chooses a random cell as the initial cell and marks it as part of the maze.
Carves passages from the current cell to adjacent unvisited cells and adds them to the maze.
Continues until every cell has been visited.
*/

import { Algorithm } from "../Algorithm";
import { cols, rows } from "../../components/Maze";

/* Decision to use Set questionable, Obj elements require manual search, non iterable, 
don't see an advantage over say array */
export class Prims extends Algorithm {
  constructor(state, setState) {
    super(state, setState);
    this.maze = new Set(); // tracks nodes in maze(visited)
    this.frontier = new Set(); // tracks nodes in frontier(not visited, adjacent to maze)
  }

  async algorithm() {
    let start = this.getRandomPosition(rows, cols); // start at a random position
    while (this.maze.size != rows * cols) {
      // while all nodes visited
      let { x, y } = start;
      this.maze.add(start); //add to maze and update state [vis]
      this.temp[x][y].selected = true;
      await this.update(); // update render

      if (this.maze.size != rows * cols) {
        // on last iteration maze completed
        this.addToFrontier(start);
        await this.update(); // update render
        start = this.popRandomSet(this.frontier); // new start from frontier
        this.connectTotMaze(start); // remove wall
        await this.update(); // update render
      }
    }
  }

  /* handles finding a node in maze to connect to then hands off to removeWall*/
  connectTotMaze(outside) {
    let neighborsInMaze = this.getNeighbors(outside).filter(
      (n) => this.findInSet(this.maze, n) // gets neighbor nodes in maze
    );
    let inside = neighborsInMaze[this.random(neighborsInMaze.length)]; // random selection
    this.removeWall(outside, inside);
  }

  /* handles adding valid neighbors to frontier*/
  addToFrontier(start) {
    this.getNeighbors(start).map((n) => {
      if (!this.findInSet(this.frontier, n) && !this.findInSet(this.maze, n)) {
        let { x, y } = n;
        this.frontier.add(n);
        this.temp[x][y].frontier = true;
      }
    });
  }
}
