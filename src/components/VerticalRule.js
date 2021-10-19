import React from "react";

const BORDER_DEFAULT = "1px solid rgba(42, 45, 52, 0.1)";

const VerticalRule = (props) => {
  // @props: border - String
  // @props: height - String
  // @props: width - String

  return (
    <div
      className={props.className}
      style={props.style || {
        border: 0,
        borderLeft: BORDER_DEFAULT,
        height: props.height,
        minWidth: "2.5px",
        width: props.width
      }}
    />
  );
};
export default VerticalRule;
