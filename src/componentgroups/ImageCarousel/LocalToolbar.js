// Libraries
import React from "react";

// Components
import IndicatorCircles from "./IndicatorCircles";
import SVG from "../../components/SVG";

// SVGs
import SVG_Caret_Left from "../../svgs/SVG_Caret_Left";
import SVG_Caret_Right from "../../svgs/SVG_Caret_Right";

const SVG_FILL_GREY = "#2A2D34";
const SVG_FILL_WHITE = "white";

const LocalToolbar = (props) => {
  // @props: indexOfImageSelected - Number
  // @props: pagination - Object{}
  // @props: paginationClassName - String
  // @props: onFullscreen - Function()
  // @props: onSelectImage - Function(imageIndex)

  const indexOfImageSelected = Number(props.indexOfImageSelected) || 0;
  const pagination = props.pagination || {};

  const disablePrevious = !pagination.previous;
  const disableNext = !pagination.next;

  const handleSelectImage = (imageIndex) => {
    if(props.onSelectImage instanceof Function) {
      props.onSelectImage(imageIndex);
    }
  };

  return (
    <div
      className={props.className || "d-flex justify-content-center"}
      style={props.style || {
        bottom: 0,
        left: 0,
        position: "absolute",
        width: "100%",
      }}
    >
      {/* Pagination Buttons */}
      {!pagination.isPaginationDisabled && (
        <div className={props.paginationClassName || "d-flex rounded kit-bg-haze-strong"}>

          {/* Previous Button */}
          <button
            className={`btn p-1 ${disablePrevious && "disabled"}`}
            onClick={() => !disablePrevious && handleSelectImage(Number(indexOfImageSelected) - 1)}
          >
            <SVG
              fill={SVG_FILL_GREY}
              size={"2rem"}
              stroke={SVG_FILL_WHITE}
              strokeWidth={"0.5px"}
            >
              {SVG_Caret_Left}
            </SVG>
          </button>

          {/* Position Indicator Circles */}
          <IndicatorCircles
            indexOfImageSelected={indexOfImageSelected}
            pagination={pagination}
            onSelectImage={(imageIndex) => handleSelectImage(imageIndex)}
          />

          {/* Next Button */}
          <button
            className={`btn p-1 ${disableNext && "disabled"}`}
            onClick={() => !disableNext && handleSelectImage(Number(indexOfImageSelected) + 1)}
          >
            <SVG
              fill={SVG_FILL_GREY}
              size={"2rem"}
              stroke={SVG_FILL_WHITE}
              strokeWidth={"0.5px"}
            >
              {SVG_Caret_Right}
            </SVG>
          </button>
        </div>
      )}
    </div>
  );
};
export default LocalToolbar;
