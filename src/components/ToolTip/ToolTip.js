import React from "react";
import "./ToolTip.css";

const ToolTip = ({gender, age, ethnicity, width}) => {
  return (
      <div style={{width:'200px'}} className="info-box top-2 left-0 mt3 z-1 w5-l pa0
      p f6 ma0 dn absolute f1 tooltip o-90">
          <div className="f6 near-white ma0">
          <div className="bg-white-90"><p className="b ma0 blue tl ml1-ns">Detection</p></div>
             <p>Gender: {gender}</p>
             <p>Age: {age}</p>
             <p>Ethnicity: {ethnicity}</p></div>
      
       </div>
  );
};

export default ToolTip;