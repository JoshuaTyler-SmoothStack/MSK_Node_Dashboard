// Libraries
import React from "react";

// Components
import SVG from "../../components/SVG";

// SVGs
import SVG_Caret_Right from "../../svgs/SVG_Caret_Right";
import SVG_Harddrive from "../../svgs/SVG_Harddrive";

const KafkaTopicsTable = (props) => {
  const topics = props.topics;
  const topicSelected = props.topicSelected || "";

  if (topics && topics.length) {
    const rows = [];
    for (const i in topics) {
      if (topics[i]) {
        const topic = topics[i];
        const isSelected = topicSelected === topic.topicName;
        rows.push(
          <tr className={isSelected ? "bg-dark text-light" : ""} key={topic.topicName}>
            <th>{topic.topicName}</th>
            <td><DiskSpaceIndicator bytes={topic.bytes} fill={isSelected ? "white" : "black"}/></td>
            <td>
              <button
                className={`btn btn-primary btn-sm ${isSelected ? "disabled" : ""}`}
                onClick={() => {
                  if(props.onSelectTopic instanceof Function && !isSelected) {
                    props.onSelectTopic(topic.topicName);
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
      <div className={props.className || "rounded table table-bordered"}>
        {"No Topics available, connect to a MSK Node and refresh Topics."}
      </div>
    );
  }
};
export default KafkaTopicsTable;

export const DiskSpaceIndicator = (props) => {
  const BYTE_MULTIPLIER = 1024;
  const DECIMAL_LIMITER = 2;
  const formatBytes = (bytes) => {
    const suffix = Math.floor(Math.log(bytes) / Math.log(BYTE_MULTIPLIER));
    return "0" === String(bytes)
      ? "0 Bytes"
      : `${parseFloat((bytes / Math.pow(BYTE_MULTIPLIER, suffix)).toFixed(Math.max(0, DECIMAL_LIMITER)))} ` +
        `${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][suffix]}`;
  };

  return (
    <div className={"d-flex align-items-center"}>
      <SVG fill={props.fill}>{SVG_Harddrive}</SVG>
      <span className={"ml-1"}>{formatBytes(props.bytes)}</span>
    </div>
  );
};
