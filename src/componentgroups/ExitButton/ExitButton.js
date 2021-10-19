// Libraries
import React from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_X from "../../svgs/SVG_X";

const ExitButton = (props) => {
  const fill = props.fill || "white";
  const size = props.size || "2rem";

  return (
    <button
      className={props.className || "btn btn-danger p-1"}
      style={props.style}
      onClick={() => {
        if (props.onClick instanceof Function) {
          props.onClick();
        }
      }}
    >
      <SVG fill={fill} size={size}>
        {SVG_X}
      </SVG>
    </button>
  );
};
export default ExitButton;
