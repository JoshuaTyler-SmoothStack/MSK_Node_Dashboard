// Libraries
import React from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Arrow_Right from "../../svgs/SVG_Arrow_Right";
import SVG_Image from "../../svgs/SVG_Image";

const SVG_FILL_BLUE = "#2176FF";

const ImageQualityRampingIndicator = (props) => {
  // @props: miniDisplay - Boolean
  // @props: onCrop - f()
  // @props: onFileUpload - f()
  // @props: onMirror - f()
  // @props: onRotate - f()

  const { miniDisplay } = props;

  return (
    <div
      className={props.className || "d-flex align-items-center p-1 kit-gradient-lightgrey kit-gradient-animated-fast-linear"}
      style={props.style}
    >
      {/* Spinner */}
      {!miniDisplay && (
        <div className={"spinner-border text-light mr-1"} style={{ height:"1.5rem", width: "1.5rem" }}/>
      )}

      {/* Small Image */}
      <SVG fill={SVG_FILL_BLUE} size={"1rem"}>
        {SVG_Image}
      </SVG>

      {/* Arrow */}
      <SVG fill={SVG_FILL_BLUE} size={"1.5rem"}>
        {SVG_Arrow_Right}
      </SVG>

      {/* Large Image */}
      <SVG fill={SVG_FILL_BLUE} size={"2rem"}>
        {SVG_Image}
      </SVG>
    </div>
  );
};
export default ImageQualityRampingIndicator;
