import React from "react";

const SVG = (props) => {
  // @props: background - String
  // @props: fill - String
  // @props: size - Number/String
  // @props: stroke - String
  // @props: strokeWidth - Number/String

  // @props: children - { defaultVals, lines: [{style, x1, x2, y1, y2, transform}], paths: [{fillRule, path}] }

  // @props: height - Number/String
  // @props: width - Number/String
  // @props: viewBox - Number, Number, Number, Number

  const svg = props.children || {};
  if(!svg.props) svg.props = {};

  const background = props.background || "transparent";
  const fill = props.fill || svg.props.fill || "#000000";
  const stroke = props.stroke || svg.props.stroke || "#000000";
  const strokeWidth = props.strokeWidth || svg.props.strokeWidth || 0;

  const height = props.height || props.size || svg.props.height || "2rem";
  const width = props.width || props.size || svg.props.width || "2rem";
  const viewBox = props.viewBox || svg.props.viewBox || "0 0 16 16";

  const xmlns = props.xmlns || svg.props.xmlns || "";

  return (
    <svg
      className={(props.className || "")}
      fill={fill}
      height={height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={{ ...props.style, background }}
      viewBox={viewBox}
      width={width}
      xmlns={xmlns}
    >
      {svg.props.children}
    </svg>
  );
};
export default SVG;
