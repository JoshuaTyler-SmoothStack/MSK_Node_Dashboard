// Libraries
import React, { useState } from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Arrow_Clockwise from "../../svgs/SVG_Arrow_Clockwise";

const RefreshButton = (props) => {
  const fill = props.fill || "#28a745";
  const isLoading = props.isLoading || false;
  const size = props.size || "1rem";

  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={props.className || "btn btn-light"}
      onClick={() => {
        if (!isLoading && !isPressed) {
          setIsPressed(true);
          setTimeout(() => setIsPressed(false), 500);
          if (props.onClick instanceof Function) {
            props.onClick();
          }
        }
      }}
    >
      {(isLoading || isPressed)
        ? (
          <div
            className={"spinner-border text-primary"}
            style={{ height: size, width: size }}
          />
        ) : (
          <SVG fill={fill} size={size}>
            {SVG_Arrow_Clockwise}
          </SVG>
      )}
    </button>
  );
};
export default RefreshButton;
