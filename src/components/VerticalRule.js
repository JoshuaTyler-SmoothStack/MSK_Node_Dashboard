import React from "react";

const BORDER_DEFAULT = "1px solid rgba(42, 45, 52, 0.1)";

const VerticalRule = (props) => {
  // @props: border - String
  // @props: height - String

  return (
    <div
      className={props.className}
      style={{
        border: 0,
        borderLeft: BORDER_DEFAULT,
        height: props.height,
        marginRight: "20px",
        minWidth: "2.5px",
        width: props.width
      }}
    />
  );
};
export default VerticalRule;
