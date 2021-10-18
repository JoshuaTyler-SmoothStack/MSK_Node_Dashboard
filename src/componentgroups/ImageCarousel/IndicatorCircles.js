// Libraries
import React from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Circle from "../../svgs/SVG_Circle";

const SVG_FILL_GREY = "#2A2D34";
const SVG_FILL_WHITE = "white";

const IndicatorCircles = (props) => {
  // @props: indexOfImageSelected - Number
  // @props: pagination - Object{}
  // @props: onSelectImage - f()

  const indexOfImageSelected = Number(props.indexOfImageSelected) || 0;
  const pagination = props.pagination || {};
  const disablePos1 = pagination.pos1 !== indexOfImageSelected;
  const disablePos2 = pagination.pos2 !== indexOfImageSelected;
  const disablePos3 = pagination.pos3 !== indexOfImageSelected;

  const handleSelectImage = (imageIndex) => {
    if(props.onSelectImage instanceof Function) {
      props.onSelectImage(imageIndex);
    }
  };

  return (
    <div className={props.className || "d-flex"} style={props.style}>

      {/* Indicator Start */}
      <button
        className={`btn p-1 ${disablePos1 && "disabled"}`}
        onClick={() => disablePos1 && handleSelectImage(pagination.pos1)}
      >
        <SVG
          fill={SVG_FILL_GREY}
          size={"1.5rem"}
          stroke={SVG_FILL_WHITE}
          strokeWidth={"0.5px"}
        >
          {SVG_Circle}
        </SVG>
      </button>

      {/* Indicator Current */}
      {!pagination.isPos2Disabled && (
        <button
          className={`btn p-1 ${disablePos2 && "disabled"}`}
          onClick={() => disablePos2 && handleSelectImage(pagination.pos2)}
        >
          <SVG
            fill={SVG_FILL_GREY}
            size={"1.5rem"}
            stroke={SVG_FILL_WHITE}
            strokeWidth={"0.5px"}
          >
            {SVG_Circle}
          </SVG>
        </button>
      )}

      {/* Indicator End */}
      {!pagination.isPos3Disabled && (
        <button
          className={`btn p-1 ${disablePos3 && "disabled"}`}
          onClick={() => disablePos3 && handleSelectImage(pagination.pos3)}
        >
          <SVG
            fill={SVG_FILL_GREY}
            size={"1.5rem"}
            stroke={SVG_FILL_WHITE}
            strokeWidth={"0.5px"}
          >
            {SVG_Circle}
          </SVG>
        </button>
      )}
    </div>
  );
};
export default IndicatorCircles;
