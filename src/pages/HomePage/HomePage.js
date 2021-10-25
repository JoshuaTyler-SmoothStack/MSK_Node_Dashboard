// Libraries
import Orchestration from "../../orchestration/Orchestration";
import React, { Component } from "react";
import { WebSocketClient } from "../../orchestration/WebSocket";

// Components
import ConnectionMonitor from "../../componentgroups/ConnectionMonitor";
import KafkaTopicInputOutput from "../../componentgroups/KafkaTopicInputOutput";
import KafkaTopicsTable from "../../componentgroups/KafkaTopicsTable";
import Modal from "../../componentgroups/Modal";
import RefreshButton from "../../componentgroups/RefreshButton";
import SVG from "../../components/SVG";

// SVGs
import SVG_Shield_Exclamation from "../../svgs/SVG_Shield_Exclamation";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionUrl: "",
      error: "",
      selectedTopic: "",
      selectedTopicIsLoading: false,
      selectedTopicOutput: [],
      topics: [],
      topicsAreLoading: false,
      topicWebSocket: null,
    };
  }

  render() {
    const {
      error,
      selectedTopic,
      selectedTopicIsLoading,
      selectedTopicOutput,
      topics,
      topicsAreLoading,
    } = this.state;

    return (
      <div className={this.props.className || ""} style={this.props.style}>
        {/* Icon gallery of technologies */}
        <section
          className={"jumbotron text-center mt-2 px-4 py-2 kit-border-shadow"}
        >
          {/* Kafka Cluster Connection Interface */}
          <div className={"row"}>
            {/* MSK ConnectionMonitor */}
            <ConnectionMonitor
              searchSuggestions={[ "http://ec2-160-1-83-9.us-gov-west-1.compute.amazonaws.com:8080" ]}
              onConnection={(connectionUrl) => this.setState({ connectionUrl })}
            />
          </div>

          {/* Kafka Topic Interface */}
          <div className={"justify-content-around row"}>

            {/* Topics */}
            <div className={"card flex-grow-1 mr-1 kit-border-shadow-sm"}>

              {/* Header */}
              <div className={"bg-white card-header d-flex align-items-center"}>
                <div className={"card-title h3"}>{"Topics"}</div>
                <RefreshButton
                  className={"btn btn-light ml-auto kit-border-shadow-sm"}
                  isLoading={topicsAreLoading}
                  size={"1.5rem"}
                  onClick={() => this.handleGetTopics()}
                />
              </div>

              {/* Topics Table */}
              <div className={"card-body p-1"}>
                <KafkaTopicsTable
                  topics={topics}
                  topicSelected={selectedTopic}
                  onSelectTopic={(topicName) => this.handleSelectTopic(topicName)}
                />
              </div>
            </div>

            {/* Selected Topic Command Line Interface */}
            <div className={"card kit-border-shadow-sm"} style={{ width: "250px" }}>

              {/* Header */}
              <div className={"bg-white card-header pb-0"}>
                <div className={"card-title h4"}>{"Selected Topic I/O"}</div>
                <div className={"d-flex justify-content-center"}>
                  <SVG className={"m-1"} fill={"red"} size={"1.25rem"}>
                    {SVG_Shield_Exclamation}
                  </SVG>
                  <p style={{ fontSize: "11px", maxWidth: "150px" }}>
                    {"Uploading to the topic creates a new data event record."}
                  </p>
                </div>
              </div>

              {/* Topic CLI */}
              <div className={"card-body p-1"}>
                <div className={"bg-dark mb-1 rounded text-light"}>
                  {selectedTopic
                    ? <div>{selectedTopic}</div>
                    : <div>{"Select a topic to interact with it."}</div>
                  }
                </div>
                <KafkaTopicInputOutput
                  isLoading={selectedTopicIsLoading}
                  output={selectedTopicOutput}
                  onInput={(input) => selectedTopicOutput.push(input)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Consumers */}
        {/* Producers */}

        {/* Error Modal */}
        {error && (
          <Modal onClose={() => this.setState({ error: "" })}>
            <div className={"d-flex align-items-center justify-content-center h-100 w-100"}>
              <div
                className={"bg-white d-flex justify-content-center p-1 rounded"}
                style={{ height: "200px", width: "200px"}}
              >
                <h5 className={"text-danger"}>{String(error)}</h5>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  handleGetTopics = () => {
    const { connectionUrl } = this.state;
    this.setState({
      selectedTopic: "",
      topicsAreLoading: true
    });

    Orchestration.createRequest(
      "GET",
      `${connectionUrl}/describe/topics`,
      (httpError) => {
        this.setState({
          error: httpError,
          topicsAreLoading: false
        });
      },
      (httpResponse) => {
        this.setState({
          topics: httpResponse,
          topicsAreLoading: false
        });
      }
    );
  };

  handleSelectTopic = (topicName) => {
    const { connectionUrl } = this.state;
    this.setState({
      selectedTopic: topicName,
      selectedTopicIsLoading: true,
    });
    Orchestration.createRequestWithBody(
      ("POST"),
      (`${connectionUrl}/consume`),
      ({ topicName, fromBeginning: true }),
      (httpError) => {
        this.setState({
          error: httpError,
          selectedTopicIsLoading: false,
        });
      },
      (/* httpResponse */) => {
        const topicWebSocket = new WebSocketClient(
          "ws://ec2-160-1-83-9.us-gov-west-1.compute.amazonaws.com:8081",
          topicMessage => this.state.selectedTopicOutput.push(topicMessage),
        );
        topicWebSocket.initialize();
        this.setState({
          selectedTopicIsLoading: false,
          topicWebSocket,
        });
      }
    );
  };
}
export default HomePage;
