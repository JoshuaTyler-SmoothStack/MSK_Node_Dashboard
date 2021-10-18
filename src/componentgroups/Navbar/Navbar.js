// Libraries
import Orchestration from "../../orchestration/Orchestration";
import React, { useEffect, useState } from "react";

// Components
import ConnectionIndicator from "../../components/ConnectionIndicator";
import InputText from "../InputText";
import VerticalRule from "../../components/VerticalRule";

// Constants (Local)
const DEFAULT_CLASSNAME =
  "navbar align-items-center justify-content-start px-2 py-0 kit-gradient-grey";
const DEFAULT_CONNECTION_PING = 1000;

const Navbar = (props) => {
  const [connectionInformation, setConnectionInformation] = useState({});
  const [connectionIsLoading, setConnectionIsLoading] = useState(false);
  const [connectionNeedsUpdate, setConnectionNeedsUpdate] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("warning");
  const [connectionUrl, setConnectionUrl] = useState("");

  // ping MSK Connection
  const pingMskConnection = () => {
    setConnectionIsLoading(true);
    Orchestration.createRequest(
      "GET",
      `${connectionUrl}/kafka`,
      (/*error*/) => {
        setConnectionStatus("danger");
        setTimeout(() => setConnectionIsLoading(false), DEFAULT_CONNECTION_PING);
      },
      (response) => {
        setConnectionInformation(response);
        if(response.bootstrapBroker && response.zookeeperConnectionString) {
          setConnectionStatus("success");
        }
        else {
          setConnectionStatus("warning");
        }
        setTimeout(() => setConnectionIsLoading(false), DEFAULT_CONNECTION_PING);
      }
    );
  };

  useEffect(() => {
    if(connectionNeedsUpdate && connectionUrl) {
      pingMskConnection();
    }
  },
  [
    connectionNeedsUpdate,
    connectionUrl,
    pingMskConnection,
  ]);

  return (
    <nav className={props.className || DEFAULT_CLASSNAME} style={props.style}>

      {/* MSK Connection */}
      <div className={"bg-light d-flex rounded p-1"}>

        {/* Label */}
        <div className={"bg-info m-auto p-1 rounded text-light kit-border-shadow-sm"}>
          {"MSK Node"}
        </div>

        {/* Indicator */}
        <ConnectionIndicator
          className={"m-1"}
          isLoading={connectionIsLoading}
          status={connectionStatus}
        />

        {/* Vertical Divider */}
        <VerticalRule className={"ml-2"}/>

        {/* Connection Input */}
        <InputText
          placeholder={"Connection Address"}
          searchSuggestions={["ec2-3-86-207-38.compute-1.amazonaws.com:8080"]}
          onChange={(value) => setConnectionUrl(value)}
        />
        <button
          className={"btn btn-success ml-1"}
          onClick={() => pingMskConnection()}
        >
          {"Connect"}
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
