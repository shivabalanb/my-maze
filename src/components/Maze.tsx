import React, {
  FC,

  useState,
} from "react";
import { Tile, Node, Walls, Status } from "./Tile";
import { motion } from "framer-motion";
import { Prims } from "../algos/maze_gen/Prims";
import { RecursiveBacktracking } from "../algos/maze_gen/RecursiveBacktracking";
import { Kruskals } from "../algos/maze_gen/Kruskals";
import { Ellers } from "../algos/maze_gen/Ellers";
import { RecursiveDivision } from "../algos/maze_gen/RecursiveDivision";

export interface MazeSettings {
  rows: number;
  cols: number;
  speed: number;
}

export interface TileSettings {
  tileSize: number;
  borderWidth: number;
}

// context api? way to share, maybe im overcomplicating, weird random error when changing
/**
 * step,play,reset button functionality needed
 * look into context api
 * overall design--last*/
const Maze: FC = () => {
  const [mazeSettings, setMazeSettings] = useState({
    rows: 20,
    cols: 20,
    speed: 50,
  });
  const [tileSettings, setTileSettings] = useState({
    tileSize: 20,
    borderWidth: 10,
  });

  const initState = () => {
    let temp: Node[][] = [];
    for (let i = 0; i < mazeSettings.rows; i++) {
      let row: Node[] = [];
      for (let j = 0; j < mazeSettings.cols; j++) {
        row.push(new Node(i, j));
      }
      temp.push(row);
    }
    return temp;
  };

  const [time, setTime] = useState("");
  const [state, setState] = useState(initState());

  const renderRow: FC<number> = (r: number) => {
    const row = Array.from({ length: mazeSettings.cols }, (_, i) => (
      <Tile key={i} node={state[r][i]} tileSettings={tileSettings} />
    ));

    return <div className="flex">{row}</div>;
  };

  const renderMaze = (): React.ReactNode => {
    const maze = Array.from({ length: mazeSettings.rows }, (_, i) => (
      <div key={i}>{renderRow(i)}</div>
    ));

    return <>{maze}</>;
  };

  const renderTile = (): React.ReactNode => {
    const walls: Walls = [1, 1, 1, 1];
    return (
      <Tile
        key={1}
        node={new Node(0, 0, walls, Status.Color, kruskals.getRandomHexColor())}
        tileSettings={tileSettings}
      />
    );
  };

  // algorithms
  const prims = new Prims(state, setState, mazeSettings);
  const recursiveBacktracking = new RecursiveBacktracking(
    state,
    setState,
    mazeSettings
  );
  const kruskals = new Kruskals(state, setState, mazeSettings);
  const ellers = new Ellers(state, setState, mazeSettings);
  const recursiveDivision = new RecursiveDivision(
    state,
    setState,
    mazeSettings
  );
  return (
    <>
      <div className=" flex flex-col gap-4 items-center ">
        {/* <div>{renderTile()}</div> */}
        <div>{state && renderMaze()}</div>
        <div className="flex w-32 justify-around text-xs text-white">
          <button
            onClick={async () => {
              await recursiveBacktracking.algorithm();
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
      </div>
    </>
  );
};

export default Maze;
