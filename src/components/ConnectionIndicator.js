import React from "react";

const ConnectionIndicator = (props) => {
  // @props: indicatorSize - String
  // @props: isLoading - Boolean
  // @props: status - String (danger, success, warn)

  const indicatorSize = props.indicatorSize || "30px";
  const isLoading = props.isLoading || false;
  const status = props.status || "success";

  return (
    <div
      className={props.className}
      style={props.style}
    >
      {/* Indicator */}
      {isLoading
        ? (<div
            className={"bg-light spinner-border text-info kit-border-shadow-sm"}
            style={{ height: indicatorSize, width: indicatorSize }}
          />)
        : (<div
            className={`bg-${status} rounded-circle kit-border-shadow-sm`}
            style={{ height: indicatorSize, width: indicatorSize }}
          />)
      }
    </div>
  );
};
export default ConnectionIndicator;
