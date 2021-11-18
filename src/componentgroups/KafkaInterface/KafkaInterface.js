// Libraries
import React, { useState } from "react";

// Components
import Toggle from "../../components/Toggle";

// Models
import Producer from "../../models/Producer";

// Constants (Local)
const COLUMN_CLASSNAME = "d-flex flex-column flex-grow-1";
const HEADER_CLASSNAME = "bg-white h5 text-center kit-border-shadow-sm";

const KafkaInterface = (props) => {
  // @props: topics - Object []

  const producers = [ new Producer({ name: "msk_node_s3_put "}) ];
  const topics = props.topics || [];

  return(
    <div className={props.className || "d-flex justify-content-around"} style={props.style}>

      {/* Producers */}
      <div className={COLUMN_CLASSNAME}>
        <div className={HEADER_CLASSNAME}>{"Producers"}</div>
        {producers.map((producer) => <ProducerDisplay key={producer.getId()} producer={producer}/>)}
      </div>

      {/* Topics */}
      <div className={COLUMN_CLASSNAME}>
        <div className={HEADER_CLASSNAME}>{"Topics"}</div>
      </div>

      {/* Consumers */}
      <div className={COLUMN_CLASSNAME}>
        <div className={HEADER_CLASSNAME}>{"Consumers"}</div>
      </div>
    </div>
  );
};
export default KafkaInterface;

export const ConnectionBlinker = (props) => {
  // @props: isConnected - Boolean
  // @props: isProducing - Boolean
  // @props: size - String

  const isConnected = props.isConnected || false;
  const isProducing = props.isProducing || false;
  const size = props.size || "20px";
  const blinkerStyle = { height: size, width: size };

  return(
    <div className={"bg-white d-flex justify-content-around m-1 p-1 rounded"}>
      <div className={`mx-1 rounded-circle ${isConnected ? "bg-success" : "bg-danger"}`} style={blinkerStyle}/>
      <div className={`bg-info mx-1 rounded-circle ${isProducing ? "kit-blink" : "kit-opacity-50"}`} style={blinkerStyle}/>
    </div>
  );
};

export const ProducerDisplay = (props) => {
  const [showTopics, setShowTopics] = useState(false);
  const [update, forceUpdate] = useState(false);

  const producer = props.producer || new Producer({ name: "unnamed" });
  producer.subscribe(() => forceUpdate(!update));

  return(
    <div className={"bg-primary d-flex flex-column align-items-start align-self-center p-1 overflow-hidden rounded kit-border-shadow"}>
      <h5 className={"bg-white m-1 p-2 rounded"}>{producer.getName()}</h5>
      <ConnectionBlinker
        isConnected={producer.getStatus() === "CONNECTED"}
        isProducing={producer.getIsProducing()}
      />
      <Toggle
        initialState={showTopics}
        toggleOnText={"Show Topics"}
        toggleOffText={"Hide Topics"}
        onToggleOn={() => setShowTopics(true)}
        onToggleOff={() => setShowTopics(false)}
      />
      {showTopics && (
        <ul className={"bg-white list-group p-1 rounded-0 w-100"}>
          {producer.getTopics().length
            ? producer.getTopics().map((topic) => <li key={topic} className={"list-item"}>{topic}</li>)
            : <li key={"notopics"} className={"list-item"}>{"No Topics."}</li>
          }
        </ul>
      )}
    </div>
  );
};

export const TopicList = (props) => {
  // @props: topics - String[]
  const topics = props.topics || [];

  return (
    <table
      className={"table table-bordered kit-border-shadow-sm"}
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
      <tbody>{topics.map((topic) => <tr><td>{topic}</td></tr>)}</tbody>
    </table>
  );
};