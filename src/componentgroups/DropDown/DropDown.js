import React, { useCallback, useEffect, useRef, useState } from "react";
import FocusLock from "../../components/FocusLock";

const DROPDOWN_MARGIN_DEFAULT = 0;
const ESCAPE_KEY = 27;

const DropDown = (props) => {
  // @props: align - String
  // @props: alt - String (name for screen-readers)
  // @props: buttonClassName - String
  // @props: buttonStyle - Object{}
  // @props: dropDownMargin - Number
  // @props: listClassName - String
  // @props: listStyle - Object{}
  // @props: options - String[]
  // @props: optionsClassName - String
  // @props: optionsName - String
  // @props: selection - String
  // @props: selectionClassName - String
  // @props: children (selectionDisplayOverride) - <html>
  // @props: type - String

  // @props: isActive - bool
  // @props: onSelect - f()
  // @props: onToggle - f()

  const {
    isActive,
    options,
    optionsClassName,
    selection,
    selectionClassName,
    children
  } = props;
  const dropDownMargin = props.dropDownMargin || DROPDOWN_MARGIN_DEFAULT;
  const [isDropDownActive, setDropDownActive] = useState(isActive || false);
  const rootNodeRef = useRef(null);

  const handleSelect = useCallback((value) => {
    setDropDownActive(false);
    if(props.onToggle instanceof Function) {
      props.onToggle(false);
    }
    if((props.onSelect instanceof Function) && value) {
      props.onSelect(value);
    }
  }, [props]);

  // Escape Key Listener
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { keyCode } = event;
      if (keyCode === ESCAPE_KEY) {
        event.preventDefault();
        handleSelect(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSelect]);

  // MouseDown & TouchDown Outside Element Listener
  useEffect(() => {
    const handleClick = (event) => {
      const { target } = event;
      if(rootNodeRef.current && !rootNodeRef.current.contains(target)) {
        handleSelect(null);
      }
    };

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchdown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("touchdown", handleClick);
    };
  }, [rootNodeRef, handleSelect]);

  let optionsRender = [];
  if(options) {
    if(options.length) {
      for(const i in options) {
        if(options[i]) {
          const option = options[i];
          const optionRender =
          <li key={"option-" + i}>
            {typeof(option) === "string"
              ? <button
                  alt={option + (props.optionsName || "")}
                  className={(selection === option ? (selectionClassName || "active") : (optionsClassName || "dropdown-item"))}
                  type={"button"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                  }}
                >
                  {option + (props.optionsName || "")}
                </button>
              : option
            }
          </li>;
          optionsRender.push(optionRender);
        }
      }
    } else {
      optionsRender =
      <li>
        <button
          alt={options + (props.optionsName || "")}
          className={(selection === options ? (selectionClassName || "active") : (optionsClassName || "dropdown-item"))}
          type={"button"}
          onClick={(e) => {
            e.preventDefault();
            handleSelect(options);
          }}
        >
          {options + (props.optionsName || "")}
        </button>
      </li>;
    }
  } else {
    optionsRender = options === "PENDING"
      ? <div className={"spinner-border m-auto"}/>
      : <div>{"No options available."}</div>;
  }

  return (
    <div
      className={String(`drop${(props.type || "down")} ${(props.className || "")}`)}
      ref={rootNodeRef}
      style={props.style}
    >
      <button
        alt={(props.alt || "")}
        className={String(`btn ${(props.buttonClassName || "")}`)}
        style={ props.buttonStyle || { textAlign: "left"}}
        type={"button"}
        onClick={() => {
          setDropDownActive(!isDropDownActive);
          if(props.onToggle instanceof Function) {
            props.onToggle(!isDropDownActive);
          }
        }}
      >
        {children ? children : (selection
          ? String(`${selection} ${(props.optionsName || "")}`)
          : "No selection available.")
        }
      </button>
      <FocusLock props={{isLocked: !isDropDownActive}}>
        <ul
          className={props.listClassName || (
            String(`dropdown-menu mt-${dropDownMargin} p-1
            ${props.align ? ("dropdown-menu-" + props.align) : ""}
            ${((isDropDownActive || props.isActive) ? "show" : "")}`)
          )}
          style={props.listStyle}
          >
          {optionsRender}
        </ul>
      </FocusLock>
    </div>
  );
};
export default DropDown;
