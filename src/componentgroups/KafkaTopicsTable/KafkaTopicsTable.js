// Libraries
import React from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Caret_Right from "../../svgs/SVG_Caret_Right";
import SVG_Trash from "../../svgs/SVG_Trash";

const KafkaTopicsTable = (props) => {
  const topics = props.topics;
  const topicSelected = props.topicSelected || "";

  if (topics) {
    const rows = [];
    for (const i in topics) {
      if (topics[i]) {
        const topic = topics[i];
        const isSelected = topicSelected === topic;
        rows.push(
          <tr className={isSelected ? "bg-dark text-light" : ""} key={topic}>
            <th>{topic}</th>
            <td className={"pr-0"}>
              <button
                className={"btn btn-danger btn-sm"}
                onClick={() => {
                  if(props.onDeleteTopic instanceof Function) {
                    props.onDeleteTopic(topic);
                  }
                }}
              >
                <SVG fill={"white"}>{SVG_Trash}</SVG>
              </button>
            </td>
            <td className={"pr-0"}>
              <button
                className={`btn btn-primary btn-sm ${isSelected ? "disabled" : ""}`}
                onClick={() => {
                  if(props.onSelectTopic instanceof Function && !isSelected) {
                    props.onSelectTopic(topic);
                  }
                }}
              >
                <SVG fill={"white"}>{SVG_Caret_Right}</SVG>
              </button>
            </td>
          </tr>
        );
      }
    }
    return (
      <table className={props.className || "table table-bordered table-striped text-left"}>
        <tbody className={"bg-white"}>{rows}</tbody>
      </table>
    );
  } else {
    return (
      <div
        className={props.className || "bg-light p-1 rounded table-bordered"}
        style={{ maxWidth: "200px"}}
      >
        {"No Topics available, connect to a MSK Node and refresh Topics."}
      </div>
    );
  }
};
export default KafkaTopicsTable;

