import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * neccesary state of a node
 * better names for frontier, selected?
 * pos needed? : getNeigbors() likely suffices*/
export class Node {
  constructor(x, y, walls = [1, 1, 1, 1], selected = false) {
    this.pos = { x: x, y: y }; // pos as obj
    this.walls = walls; // [top,right,bottom,left] clockwise
    this.selected = false;
    this.frontier = false;
  }
}

/** where should tileSize, borderWidth be?
 * work on framer motion
 * could border be simpler/better understanding css */
export const Tile = ({ node }) => {
  const { x, y } = node.pos;
  let [top, right, bottom, left] = node.walls;
  const [tileSize, borderWidth] = [50, 10];
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
          className="absolute z-20 bg-blue-700"
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
          className="absolute z-20 bg-blue-700"
        ></motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: bottom,
            width: tileSize,
            height: borderWidth,
            bottom: 0,
          }}
          className="absolute z-20 bg-blue-700"
        ></motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: left,
            width: borderWidth,
            height: tileSize,
            left: 0,
          }}
          className="absolute z-20 bg-blue-700"
        ></motion.div>

        {/* content */}

        <motion.div
          animate={{
            backgroundColor: node.selected
              ? "#7dd2fc"
              : node.frontier
              ? "#c084fc"
              : "#fff",
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
