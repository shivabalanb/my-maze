import React, { useEffect, useState } from "react";
import { Tile, Node } from "./Tile";
import { motion } from "framer-motion";
import { Prims } from "../algos/maze_gen/Prims";
import { RecursiveBacktracking } from "../algos/maze_gen/RecursiveBacktracking";

// context api? way to share, maybe im overcomplicating, weird random error when changing
const s = 10;
export const rows = s;
export const cols = s;

/**
 * step,play,reset button functionality needed
 * look into context api
 * overall design--last*/
const Maze = () => {
  const initState = () => {
    let temp = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(new Node(i, j));
      }
      temp.push(row);
    }
    return temp;
  };

  const [state, setState] = useState(initState());

  const renderRow = (r) => {
    const row = Array.from({ length: cols }, (_, i) => (
      <Tile key={i} node={state[r][i]} />
    ));

    return <div className="flex">{row}</div>;
  };

  const renderMaze = () => {
    const maze = Array.from({ length: rows }, (_, i) => (
      <div key={i}>{renderRow(i)}</div>
    ));

    return <>{maze}</>;
  };

  const renderTile = () => {
    const walls = [0, 0, 0, 0];
    return <Tile node={new Node(0, 0, walls, false)} />;
  };

  // algorithms
  const prims = new Prims(state, setState);
  const recursiveBacktracking = new RecursiveBacktracking(state, setState);

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-evenly items-center bg-teal-100">
        {/* <div>{renderTile()}</div> */}
        <div>{state && renderMaze()}</div>
        <div className="flex w-60 justify-evenly">
          <button
            onClick={() => recursiveBacktracking.algorithm()}
            className="p-2 px-4  bg-green-300 rounded-md"
          >
            Test
          </button>
          <button
            onClick={() => setState(initState())}
            className="p-2 px-4 bg-green-300 rounded-md"
          >
            Revert
          </button>
        </div>
      </div>
    </>
  );
};

export default Maze;
