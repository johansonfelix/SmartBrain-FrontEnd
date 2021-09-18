import React from "react";
import "./FaceRecognition.css";
import ToolTip from "../ToolTip/ToolTip";

const FaceRecognition = ({ imageURL, boxes, isGroup}) => {


  const results = boxes.locations.map((box,i) => (
    <div key={i}
    className="bounding-box box"
    style={{
      top: box.topRow,
      right: box.rightCol,
      bottom: box.bottomRow,
      left: box.leftCol,
    }}
  >{isGroup ? null: <ToolTip gender={boxes.gender} width={box.leftCol - box.rightCol} age={boxes.age} ethnicity={boxes.ethnicity} style={{
    top: box.topRow,
    right: box.rightCol,
    bottom: box.bottomRow,
    left: box.leftCol,
  }}/>}</div>
  ));


  return (
    <div className="center ma mb5">
      <div className="absolute mt2">
        <img
          id="inputImage"
          alt=""
          src={imageURL}
          width="500px"
          height="auto"
        />

        <div>{results}</div> 
               
      </div>
    </div>
  );
};

export default FaceRecognition;
