import React, { FC, useState } from "react";
import { motion } from "framer-motion";
import { borderWidth, tileSize } from "./Maze";

export enum Status {
  Visited,
  Current,
  Frontier,
  Null,
  Color,
}

enum Direction {
  Top,
  Right,
  Bottom,
  Left,
}

export type Position = {
  x: number;
  y: number;
};

export type Walls = [number, number, number, number]; // [top, right, bottom, left]

/**
 * neccesary state of a node
 * better names for frontier, selected?
 * pos needed? : getNeigbors() likely suffices*/
export class Node {
  pos: Position;
  walls: Walls;
  status: Status;
  color: string;

  constructor(
    x: number,
    y: number,
    walls: Walls = [1, 1, 1, 1],
    status: Status = Status.Null,
    color: string = ""
  ) {
    this.pos = { x: x, y: y }; // pos as obj
    this.walls = walls; // [top,right,bottom,left] clockwise
    this.status = status;
    this.color = color;
  }
}

/** where should tileSize, borderWidth be?
 * work on framer motion
 * could border be simpler/better understanding css */
export const Tile: FC<{ node: Node }> = ({ node }) => {
  const { x, y } = node.pos;
  let [top, right, bottom, left] = node.walls;
  const borderColor = " bg-black";

  return (
    <div style={{ width: tileSize, height: tileSize }}>
      <div className=" relative w-full h-full">
        <motion.div
          initial={false}
          animate={{
            opacity: top,
            width: right ? tileSize + borderWidth : tileSize,
            height: borderWidth,
            top: 0,
            marginTop: -borderWidth,
          }}
          className={"absolute z-20" + borderColor}
        ></motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: right,
            width: borderWidth,
            height: tileSize,
            right: 0,
            marginRight: -borderWidth,
          }}
          className={"absolute z-20" + borderColor}
        ></motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: bottom,
            width: tileSize,
            height: borderWidth,
            bottom: 0,
          }}
          className={"absolute z-20" + borderColor}
        ></motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: left,
            width: borderWidth,
            height: tileSize,
            left: 0,
          }}
          className={"absolute z-20" + borderColor}
        ></motion.div>

        {/* content */}

        <motion.div
          animate={{
            backgroundColor:
              node.status == Status.Color
                ? node.color
                : node.status == Status.Current
                ? "#7dd2fc"
                : node.status == Status.Visited
                ? "#fde047"
                : node.status == Status.Frontier
                ? "#fb7185"
                : node.status == Status.Null
                ? "#6b7280"
                : "#020617",
          }}
          transition={{ duration: 0.2 }}
          className=" h-full text-center text-xl "
        >
          {/* {x},{y} */}
        </motion.div>
      </div>
    </div>
  );
};
