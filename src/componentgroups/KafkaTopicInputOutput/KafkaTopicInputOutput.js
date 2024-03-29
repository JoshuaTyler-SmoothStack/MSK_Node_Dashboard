// Libraries
import React, { useState } from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Cloud_Upload from "../../svgs/SVG_Cloud_Upload";


const KafkaTopicInputOutput = (props) => {
  const { isLoading, output } = props;
  const [inputValue, setInputValue] = useState("");

  const renderOutput = () => {
    const rows = [];
    for(const i in output) {
      if(output[i]) {
        rows.push(<span key={i}>{output[i]}</span>);
      }
    }
    if(rows.length > 0) {
      return rows;
    }
    else {
      return (<span>{props.displayMessage}</span>);
    }
  };

  return(
    <div className={props.className || "d-flex flex-column"} style={props.style}>

      {/* Output */}
      <div
        className={"bg-light d-flex flex-column align-items-start p-1 text-left text-nowrap kit-border-shadow-sm"}
        style={{ height: "200px", overflow: "auto" }}
      >
        {isLoading
          ? <div className={"spinner-border m-auto text-primary"}/>
          : renderOutput()
        }
      </div>

      {/* Input */}
      <div
        className={"d-flex kit-border-shadow-sm"}
        style={{ height: "38px", overflow: "hidden" }}
      >
        <input
          className={"form-control rounded-0"}
          disabled={props.disabled}
          placeholder={props.disabled ? "Select a topic" : ""}
          type={"text"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className={`btn btn-success p-0 rounded-0 w-25 ${props.disabled ? "disabled" : ""}`}
          onClick={() => {
            if(props.onInput instanceof Function &&
              inputValue.trim().length > 0
            ) {
              props.onInput(inputValue.trim());
            }
            setInputValue("");
          }}
        >
          <SVG fill={"white"}>{SVG_Cloud_Upload}</SVG>
        </button>
      </div>
    </div>
  );
};
export default KafkaTopicInputOutput;
