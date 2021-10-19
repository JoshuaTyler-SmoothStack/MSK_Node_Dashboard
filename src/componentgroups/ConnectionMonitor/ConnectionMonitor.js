// Libraries
import Orchestration from "../../orchestration/Orchestration";
import React, { useState } from "react";

// Components
import ConnectionIndicator from "../../components/ConnectionIndicator";
import InputText from "../InputText";
import VerticalRule from "../../components/VerticalRule";
import SVG from "../../components/SVG";

// SVGs
import SVG_Caret_Down from "../../svgs/SVG_Caret_Down";
import SVG_Caret_Up from "../../svgs/SVG_Caret_Up";

// Constants (Local)
const DEFAULT_CONNECTION_PING = 5000;
const TABLE_TD_ERROR_CLASSNAME = "bg-danger";
const TABLE_TD_STYLE = {
  maxWidth: "200px",
  overflow: "auto",
  textAlign: "start",
  whiteSpace: "nowrap",
};

const ConnectionMonitor = (props) => {
  const [connectionInformation, setConnectionInformation] = useState({});
  const [connectionIsLoading, setConnectionIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("danger");
  const [connectionUrl, setConnectionUrl] = useState("");
  const [showConnectionInformation, setShowConnectionInformation] = useState(false);

  // ping MSK Connection
  const pingMskConnection = () => {
    setConnectionIsLoading(true);
    Orchestration.createRequest(
      "GET",
      `${connectionUrl}/kafka`,
      (/*error*/) => {
        setConnectionIsLoading(false);
        setConnectionStatus("danger");
      },
      (response) => {
        setConnectionIsLoading(false);
        setConnectionInformation(response);
        if (response.bootstrapBroker && response.zookeeperConnectionString) {
          setConnectionStatus("success");
          if(props.onConnection instanceof Function) {
            props.onConnection(connectionUrl);
          }
        } else {
          setConnectionStatus("warning");
        }
        setTimeout(() => pingMskConnection(), DEFAULT_CONNECTION_PING);
      }
    );
  };

  return (
    <div className={"bg-light d-flex align-items-center rounded m-1 p-1 w-100 kit-border-shadow"}>
      {/* Label */}
      <div
        className={"bg-info p-1 rounded text-light kit-border-shadow-sm"}
      >
        {"MSK Node"}
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
        <SVG fill={"white"}>
          {showConnectionInformation ? SVG_Caret_Up : SVG_Caret_Down}
        </SVG>
        {showConnectionInformation && (
          <div
            className={"bg-light rounded kit-border-shadow-sm"}
            style={{
              left: "0px",
              overflow: "hidden",
              position: "absolute",
              top: "30px",
              userSelect: "text",
              zIndex: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <table className={"table table-bordered"}>
              <colgroup>
                <col span={1} />
                <col span={1} className={"bg-white"} />
              </colgroup>
              <tbody>
                <tr>
                  <th>{"Kafka Version:"}</th>
                  {connectionInformation.version
                    ? <td style={TABLE_TD_STYLE}>{connectionInformation.version}</td>
                    : <td className={TABLE_TD_ERROR_CLASSNAME} style={TABLE_TD_STYLE}>{"undefined"}</td>
                  }
                </tr>
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
                  <th>{"Bootstrap Broker:"}</th>
                  {connectionInformation.bootstrapBroker
                    ? <td style={TABLE_TD_STYLE}>{connectionInformation.bootstrapBroker}</td>
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
          </div>
        )}
      </button>

      {/* Vertical Divider */}
      <VerticalRule className={"ml-1 mr-2"} height={"30px"} />

      {/* Connection Input */}
      <InputText
        placeholder={"Connection Address"}
        searchSuggestions={[
          "http://ec2-3-86-207-38.compute-1.amazonaws.com:8080",
        ]}
        onChange={(value) => setConnectionUrl(value)}
      />
      <button
        className={"btn btn-success btn-sm ml-1"}
        onClick={() => pingMskConnection()}
      >
        {"Connect"}
      </button>
    </div>
  );
};
export default ConnectionMonitor;
