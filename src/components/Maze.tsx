import React, { FC, useEffect, useState } from "react";
import { Tile, Node, Walls, Status } from "./Tile";
import { motion } from "framer-motion";
import { Prims } from "../algos/maze_gen/Prims";
import { RecursiveBacktracking } from "../algos/maze_gen/RecursiveBacktracking";
import { Kruskals } from "../algos/maze_gen/Kruskals";
import { Ellers } from "../algos/maze_gen/Ellers";
import { RecursiveDivision } from "../algos/maze_gen/RecursiveDivision";

// context api? way to share, maybe im overcomplicating, weird random error when changing
const s = 20;
export const rows = s;
export const cols = s;
export const speed = 5;
export const [tileSize, borderWidth] = [25, 4];

/**
 * step,play,reset button functionality needed
 * look into context api
 * overall design--last*/
const Maze: FC = () => {
  let startTime: number;
  let timerInterval: NodeJS.Timeout;
  let isRunning = false;
  const initState = () => {
    let temp: Node[][] = [];
    for (let i = 0; i < rows; i++) {
      let row: Node[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(new Node(i, j));
      }
      temp.push(row);
    }
    return temp;
  };

  useEffect(() => {
    setState(initState());
  }, [rows, cols]);

  const [time, setTime] = useState("");
  const [state, setState] = useState(initState());

  const renderRow: FC<number> = (r: number) => {
    const row = Array.from({ length: cols }, (_, i) => (
      <Tile key={i} node={state[r][i]} />
    ));

    return <div className="flex">{row}</div>;
  };

  const renderMaze = (): React.ReactNode => {
    const maze = Array.from({ length: rows }, (_, i) => (
      <div key={i}>{renderRow(i)}</div>
    ));

    return <>{maze}</>;
  };

  const renderTile = (): React.ReactNode => {
    const walls: Walls = [1, 1, 1, 1];
    return (
      <Tile
        node={new Node(0, 0, walls, Status.Color, kruskals.getRandomHexColor())}
      />
    );
  };

  // algorithms
  const prims = new Prims(state, setState);
  const recursiveBacktracking = new RecursiveBacktracking(state, setState);
  const kruskals = new Kruskals(state, setState);
  const ellers = new Ellers(state, setState);
  const recursiveDivision = new RecursiveDivision(state, setState);
  return (
    <>
      <div className=" flex flex-col gap-4 items-center ">
        {/* <div>{renderTile()}</div> */}
        <div>{state && renderMaze()}</div>
        <div className="flex w-32 justify-around text-xs text-white">
          <button
            onClick={async () => {
              startStop();
              await recursiveBacktracking.algorithm();
              reset();
            }}
            className="p-2 px-4  bg-black rounded-md"
          >
            Recursive
          </button>
          {/* <button
            onClick={async () => {
              startStop();
              await prims.algorithm();
              reset();
            }}
            className="p-2 px-4  bg-black rounded-md"
          >
            Prims
          </button>
          
          <button
            onClick={async () => {
              startStop();
              await kruskals.algorithm();
              reset();
            }}
            className="p-2 px-4  bg-black rounded-md"
          >
            Kruskals
          </button>
          <button
            onClick={async () => {
              // startStop();
              await ellers.algorithm();
              // reset();
            }}
            className="p-2 px-4  bg-black rounded-md"
          >
            Ellers
          </button> */}
          <button
            onClick={async () => {
              // startStop();
              await recursiveDivision.algorithm();
              // reset();
            }}
            className="p-2 px-4  bg-black rounded-md"
          >
            Division
          </button>
          {/* <button
            onClick={() => setState(initState())}
            className="p-2 px-4 bg-green-300 rounded-md"
          >
            Revert
          </button> */}
        </div>
        <div className="p-2">{time}</div>
      </div>
    </>
  );

  function startStop() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
    } else {
      startTime = new Date().getTime();
      timerInterval = setInterval(updateStopwatch, 1000);
      isRunning = true;
    }
  }

  function reset() {
    clearInterval(timerInterval);
    isRunning = false;
  }

  function updateStopwatch() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    setTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  }
};

export default Maze;
