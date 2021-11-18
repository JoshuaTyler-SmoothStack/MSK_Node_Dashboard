// Libraries
import React from "react";

// Constants (Local)
const DEFAULT_CLASSNAME = "navbar align-items-center justify-content-start px-2 py-0 kit-gradient-grey";

const Navbar = (props) => {
  return (
    <nav className={props.className || DEFAULT_CLASSNAME} style={props.style}>
      <div className={"text-light"}>{"MSK Node Dashboard"}</div>
    </nav>
  );
};
export default Navbar;
