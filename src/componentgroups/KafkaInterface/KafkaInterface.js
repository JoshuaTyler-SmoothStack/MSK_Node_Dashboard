// Libraries
import AwsKafka from "../../orchestration/AwsKafka.js";
import React, { useState } from "react";

// Components
import Toggle from "../../components/Toggle";

// Models
import Consumer from "../../models/Consumer.js";
import Producer from "../../models/Producer.js";
import Topic from "../../models/Topic.js";

// Constants (Local)
const COLUMN_CLASSNAME = "d-flex flex-column flex-grow-1";
const HEADER_CLASSNAME = "bg-white h5 text-center kit-border-shadow-sm";

const KafkaInterface = (props) => {
  const consumers = AwsKafka.consumers;
  const producers = AwsKafka.producers;
  const topics = AwsKafka.topics;

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
        {topics.map((topic) => <TopicDisplay key={topic.getId()} topic={topic}/>)}
      </div>

      {/* Consumers */}
      <div className={COLUMN_CLASSNAME}>
        <div className={HEADER_CLASSNAME}>{"Consumers"}</div>
        {consumers.map((consumer) => <ConsumerDisplay key={consumer.getId()} consumer={consumer}/>)}
      </div>
    </div>
  );
};
export default KafkaInterface;

export const ConnectionBlinker = (props) => {
  // @props: isActive - Boolean
  // @props: isConnected - Boolean
  // @props: size - String

  const isActive = props.isActive || false;
  const isConnected = props.isConnected || false;
  const size = props.size || "20px";
  const blinkerStyle = { height: size, width: size };

  return(
    <div className={"bg-white d-flex justify-content-around m-1 p-1 rounded"}>
      <div className={`mx-1 rounded-circle ${isConnected ? "bg-success" : "bg-danger"}`} style={blinkerStyle}/>
      <div className={`bg-info mx-1 rounded-circle ${isActive ? "kit-blink" : "kit-opacity-50"}`} style={blinkerStyle}/>
    </div>
  );
};

export const ConsumerDisplay = (props) => {
  const [showToggle, setShowToggle] = useState(false);
  const [update, forceUpdate] = useState(false);

  const consumer = props.consumer || new Consumer();
  consumer.subscribe(() => forceUpdate(!update));

  return(
    <div className={"bg-info d-flex flex-column align-items-start align-self-center m-1 p-1 overflow-hidden rounded kit-border-shadow kit-z-1"}>
      <h5 className={"bg-white m-1 p-2 rounded"}>{consumer.getName()}</h5>
      <ConnectionBlinker
        isActive={consumer.getIsConsuming()}
        isConnected={consumer.getStatus() === "CONNECTED"}
      />
      <Toggle
        initialState={showToggle}
        toggleOnText={"Show Topics"}
        toggleOffText={"Hide Topics"}
        onToggleOn={() => setShowToggle(true)}
        onToggleOff={() => setShowToggle(false)}
      />
      {showToggle && (
        <ul className={"bg-white list-group p-1 rounded-0 w-100"}>
          {consumer.getTopics().length
            ? consumer.getTopics().map((topic) => <li key={topic} className={"list-item"}>{topic}</li>)
            : <li key={"notopics"} className={"list-item"}>{"No Topics."}</li>
          }
        </ul>
      )}
    </div>
  );
};

export const ProducerDisplay = (props) => {
  const [showToggle, setShowToggle] = useState(false);
  const [update, forceUpdate] = useState(false);

  const producer = props.producer || new Producer();
  producer.subscribe(() => forceUpdate(!update));

  return(
    <div className={"bg-primary d-flex flex-column align-items-start align-self-center m-1 p-1 overflow-hidden rounded kit-border-shadow kit-z-1"}>
      <h5 className={"bg-white m-1 p-2 rounded"}>{producer.getName()}</h5>
      <ConnectionBlinker
        isActive={producer.getIsProducing()}
        isConnected={producer.getStatus() === "CONNECTED"}
      />
      <Toggle
        initialState={showToggle}
        toggleOnText={"Show Topics"}
        toggleOffText={"Hide Topics"}
        onToggleOn={() => setShowToggle(true)}
        onToggleOff={() => setShowToggle(false)}
      />
      {showToggle && (
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

export const TopicDisplay = (props) => {
  const [error, setError] = useState("");
  const [showToggle, setShowToggle] = useState(false);
  const [topicConfig, setTopicConfig] = useState(null);

  const topic = props.topic || new Topic();
  const blinkerSize = props.blinkerSize || "20px";
  const blinkerStyle = { height: blinkerSize, width: blinkerSize };

  const getTopicConfig = () => {
    setError("Cannot get topic config. Topic config is not yet implemented.");
    // AwsKafka.getTopicConfig()
    // .then((config) => setTopicConfig(config))
    // .catch((error) => setError(error));
  };

  const toggleOn = () => {
    if(!topicConfig) getTopicConfig();
    setShowToggle(true);
  };

  return(
    <div
      className={"bg-light d-flex flex-column align-items-start align-self-center m-1 p-1 overflow-hidden rounded kit-border-shadow kit-z-1"}
      style={{ overflowX: "scroll", width: "300px" }}
    >
      <h6 className={"bg-white m-1 p-1 rounded w-100"} style={{ overflowX: "auto" }}>{topic.getName()}</h6>
      <div className={"d-flex flex-column"}>
        <div className={"d-flex"}>
          <div className={`bg-info mx-2 rounded-circle ${topic.hasActiveProducer() ? "kit-blink" : "kit-opacity-50"}`} style={blinkerStyle}/>
          <Toggle
            initialState={showToggle}
            toggleOnText={"Show Config"}
            toggleOffText={"Hide Config"}
            onToggleOn={() => toggleOn()}
            onToggleOff={() => setShowToggle(false)}
          />
        </div>
        {showToggle && (
            <ul className={"bg-white list-group p-1 rounded-0"}>
              {(topicConfig || error)
                ? <li key={"config"} className={`list-item ${error ? "text-danger" : ""}`}>
                    {topicConfig || error}
                  </li>
                : <div className={"spinner-border text-info"}/>
              }
            </ul>
          )}
      </div>
    </div>
  );
};
