import React, { useState } from "react";

const Toggle = (props) => {
  // @props: initialState - Boolean
  // @props: toggleOnText - String
  // @props: toggleOffText - String
  // @props: onToggleOn - Function()
  // @props: onToggleOff - Function()

  const [toggleState, setToggleState] = useState(props.initialState || false);
  const toggle = (boolean) => {
    if(boolean !== toggleState) {
      setToggleState(boolean);
      if(boolean && props.onToggleOn instanceof Function) {
        props.onToggleOn();
      }
      else if (!boolean && props.onToggleOff instanceof Function) {
        props.onToggleOff();
      }
    }
  };

  return (
    <div className={"bg-white d-flex overflow-hidden rounded"}>
      <button
        className={`btn btn-small p-0 px-1 rounded-0 ${toggleState ? "btn-success" : "btn-dark"}`}
        onClick={() => toggle(true)}
      >
        {props.toggleOnText || "On"}
      </button>
      <button
        className={`btn btn-small p-0 px-1 rounded-0 ${toggleState ? "btn-dark" : "btn-danger"}`}
        onClick={() => toggle(false)}
      >
        {props.toggleOffText || "Off"}
      </button>
    </div>
  );
};
export default Toggle;
