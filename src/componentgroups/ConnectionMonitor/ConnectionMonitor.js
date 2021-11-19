// Libraries
import AwsKafka from "../../orchestration/AwsKafka";
import Config from "../../resources/Config.json";
import React, { useState } from "react";

// Components
import InputText from "../InputText";
import VerticalRule from "../../components/VerticalRule";
import SVG from "../../components/SVG";

// SVGs
import SVG_Caret_Down from "../../svgs/SVG_Caret_Down";
import SVG_Caret_Up from "../../svgs/SVG_Caret_Up";

// Constants (Local)
const TABLE_TD_ERROR_CLASSNAME = "bg-danger";
const TABLE_TD_STYLE = {
  maxWidth: "200px",
  overflow: "auto",
  textAlign: "start",
  whiteSpace: "nowrap",
};

const ConnectionMonitor = (props) => {
  const searchSuggestions = [ Config.kafkaEC2Address, AwsKafka.connectionUrl ];
  const [connectionIsLoading, setConnectionIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("danger");
  const [error, setError] = useState("");
  const [showConnectionInformation, setShowConnectionInformation] = useState(false);

  // initialize MSK Connection
  const initializeMskConnection = () => {
    AwsKafka.initialize()
    .then(() => {
      setError("");
      setConnectionStatus("success");
    })
    .catch((error) => {
      setError(error);
      setConnectionStatus("danger");
    })
    .finally(() => setConnectionIsLoading(false));
  };

  return (
    <div className={"bg-light d-flex align-items-center p-1 rounded kit-border-shadow"}>

      {/* Label */}
      <div className={"bg-info p-1 rounded text-light"}>
        {"AWS MSK Node"}
      </div>

      {/* Indicator */}
      <ConnectionIndicator
        className={"m-1"}
        isLoading={connectionIsLoading}
        status={connectionStatus}
      />

      {/* Connection Information DropTable */}
      <button
        className={"btn btn-primary btn-sm"}
        style={{ position: "relative" }}
        onClick={() => setShowConnectionInformation(!showConnectionInformation)}
      >
        <SVG fill={"white"}>{showConnectionInformation ? SVG_Caret_Up : SVG_Caret_Down}</SVG>
        {showConnectionInformation && <ConnectionInformation/>}
      </button>

      {/* Vertical Divider */}
      <VerticalRule className={"ml-1 mr-2"} height={"30px"} />

      {/* Connection Input */}
      <InputText
        placeholder={"Connection Address"}
        searchSuggestions={searchSuggestions}
        onChange={(value) => AwsKafka.connectionUrl(value)}
      />

      {/* Connect Button */}
      <button
        className={"btn btn-success btn-sm ml-1"}
        onClick={() => initializeMskConnection()}
      >
        {"Connect"}
      </button>
    </div>
  );
};
export default ConnectionMonitor;

export const ConnectionIndicator = (props) => {
  // @props: indicatorSize - String
  // @props: isLoading - Boolean
  // @props: status - String (danger, success, warn)

  const indicatorSize = props.indicatorSize || "25px";
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

export const ConnectionInformation = (props) => {
  // @props: connectionInformation - Object
  const connectionInformation = props.connectionInformation || {};

  return (
    <table
      className={"table table-bordered kit-border-shadow-sm"}
      style={{
        left: "0px",
        overflow: "hidden",
        position: "absolute",
        top: "30px",
        userSelect: "text",
        zIndex: 2,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <colgroup>
        <col span={1} className={"bg-light"}/>
        <col span={1} className={"bg-white"} />
      </colgroup>
      <tbody>
        <tr>
          <th>{"Kafka Arn:"}</th>
          {connectionInformation.arn
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.arn}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
        <tr>
          <th>{"AWS Region:"}</th>
          {connectionInformation.region
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.region}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
        <tr>
          <th>{"Bootstrap Brokers:"}</th>
          {connectionInformation.bootstrapBrokers
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.bootstrapBrokers}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
        <tr>
          <th>{"Zookeeper Connection:"}</th>
          {connectionInformation.zookeeperConnectionString
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.zookeeperConnectionString}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
        <tr>
          <th>{"Partition Count:"}</th>
          {connectionInformation.partitionCount
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.partitionCount}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
        <tr>
          <th>{"Replication Factor:"}</th>
          {connectionInformation.replicationFactor
            ? <td style={TABLE_TD_STYLE}>{connectionInformation.replicationFactor}</td>
            : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
          }
        </tr>
      </tbody>
    </table>
  );
};
