// Libraries
import React, { useState } from "react";

// Components
import DropDown from "../DropDown";

const InputText = (props) => {
  // @props: autocomplete - String
  // @props: defaultValue - String
  // @props: dropDownClassName - String
  // @props: error - String
  // @props: inputClassName - String
  // @props: placeholder - String
  // @props: searchSuggestions - [String]
  // @props: type - String
  // @props: onChange - Function()

  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(props.defaultValue || "");

  const handleValue = (newValue) => {
    setValue(newValue);
    if(props.onChange instanceof Function) {
      props.onChange(newValue);
    }
  };

  return (
    <div className={props.className || ""} style={props.style}>
      <input
        autoComplete={props.autoComplete}
        className={props.inputClassName || `form-control rounded kit-border-shadow-sm ${props.error && "is-invalid"}`}
        placeholder={props.placeholder}
        style={{
          ...props.style,
          cursor: "text",
          minHeight: (!props.style ? "2rem": null),
          minWidth: (!props.style ? "10rem" : null),
          overflow: "hidden",
          transition: "0.2s ease all",
        }}
        type={props.type || "text"}
        value={value}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => handleValue(e.target.value)}
      />
      {(props.searchSuggestions && props.searchSuggestions.length > 0) && (
        <DropDown
          buttonStyle={{ display: "none" }}
          className={props.dropDownClasName}
          isActive={isFocused}
          options={props.searchSuggestions}
          selection={" "}
          onSelect={(newValue) => handleValue(newValue)}
        />
      )}
    </div>
  );
};
export default InputText;
