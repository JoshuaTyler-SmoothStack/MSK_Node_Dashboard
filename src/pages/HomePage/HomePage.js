// Libraries
import React, { Component } from "react";

// Components
import ConnectionInterface from "../../componentgroups/ConnectionMonitor";
import KafkaTopicInputOutput from "../../componentgroups/KafkaTopicInputOutput";
import KafkaTopicsTable from "../../componentgroups/KafkaTopicsTable";
import Modal from "../../componentgroups/Modal";
import RefreshButton from "../../componentgroups/RefreshButton";
import SVG from "../../components/SVG";

// SVGs
import SVG_Shield_Exclamation from "../../svgs/SVG_Shield_Exclamation";
import KafkaInterface from "../../componentgroups/KafkaInterface/KafkaInterface";
import AwsKafka from "../../orchestration/AwsKafka";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTopicName: "",
      deleteTopicName: "",
      error: "",
      inputIsLoading: false,
      selectedTopic: "",
      selectedTopicIsLoading: false,
      selectedTopicOutput: [],
      topicCreateIsActive: false,
      topicDeleteIsActive: false,
      topics: [],
      topicsAreLoading: false,
    };
  }

  render() {
    const {
      createTopicName,
      deleteTopicName,
      error,
      inputIsLoading,
      selectedTopic,
      selectedTopicIsLoading,
      selectedTopicOutput,
      topicCreateIsActive,
      topicDeleteIsActive,
      topics,
      topicsAreLoading,
    } = this.state;

    const createTopicDisabled = (topics.length < 1 || topicsAreLoading);

    return (
      <div className={this.props.className || ""} style={this.props.style}>

        {/* Kafka Cluster Connection Interface */}
        <section className={"jumbotron text-center mt-2 px-4 py-2 kit-border-shadow"}>
          <ConnectionInterface/>
        </section>

        {/* Kafka Topic Interface */}
        <section className={"bg-dark jumbotron p-0 pb-2 overflow-hidden rounded kit-border-shadow"}>
          <KafkaInterface/>
        </section>

        <section>
            {/* Topics */}
            <div className={"card flex-grow-1 mr-1 kit-border-shadow-sm"}>

              {/* Header */}
              <div className={"bg-white card-header d-flex align-items-center"}>
                <div className={"card-title h3"}>{"Topics"}</div>
                <button
                  className={`btn btn-success btn-sm ml-auto ${createTopicDisabled ? "disabled" : ""}`}
                  onClick={() => {
                    if (!createTopicDisabled) {
                      this.setState({ topicCreateIsActive: true });
                    }
                  }}
                >
                  {"+ Create Topic"}
                </button>
                <RefreshButton
                  className={"btn btn-light ml-3 kit-border-shadow-sm"}
                  isLoading={topicsAreLoading}
                  size={"1.5rem"}
                  onClick={() => this.handleGetTopics()}
                />
              </div>

              {/* Topics Table */}
              <div className={"card-body d-flex align-items-center justify-content-center p-1"}>
                <KafkaTopicsTable
                  topics={topics.map((topic) => topic.getName())}
                  topicSelected={selectedTopic}
                  onDeleteTopic={(topicName) => this.setState({ deleteTopicName: topicName, topicDeleteIsActive: true })}
                  onSelectTopic={(topicName) => this.handleSelectTopic(topicName)}
                />
              </div>
            </div>

            {/* Selected Topic Command Line Interface */}
            <div className={"card kit-border-shadow-sm"} style={{ width: "100%" }}>

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
                  disabled={!selectedTopic || inputIsLoading}
                  displayMessage={selectedTopic ? "Awaiting topic data . . ." : ""}
                  isLoading={selectedTopicIsLoading}
                  output={selectedTopicOutput}
                  onInput={(input) => this.handlePublishToTopic(selectedTopic, input)}
                />
              </div>
            </div>
        </section>


        {/* Topic Create Modal */}
        {topicCreateIsActive && (
          <Modal onClose={() => this.setState({ topicCreateIsActive: false })}>
            <div className={"d-flex align-items-center justify-content-center h-100 w-100"}>
              <div
                className={"bg-white d-flex flex-column align-items-center justify-content-center p-1 rounded"}
                style={{ height: "200px", width: "300px" }}
              >
                <h5 className={"text-dark text-center"}>{"Topic Name:"}</h5>
                <input
                  className={"form-control"}
                  onChange={(e) => this.setState({ createTopicName: e.target.value })}
                />
                <div className={"d-flex justify-content-around mt-3 w-100"}>
                  <button
                    className={"btn btn-secondary"}
                    onClick={() => this.setState({ topicCreateIsActive: false })}
                  >
                    {"Cancel"}
                  </button>
                  <button
                    className={"btn btn-success"}
                    onClick={() => {
                      this.setState({ topicCreateIsActive: false });
                      this.handleCreateTopic(createTopicName);
                    }}
                  >
                    {"Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Topic Delete Modal */}
        {topicDeleteIsActive && (
          <Modal onClose={() => this.setState({ topicDeleteIsActive: false })}>
            <div className={"d-flex align-items-center justify-content-center h-100 w-100"}>
              <div
                className={"bg-white d-flex flex-column align-items-center justify-content-center p-1 rounded"}
                style={{ height: "200px", width: "300px" }}
              >
                <h5 className={"text-danger text-center"}>
                  {"Confirm Topic Deletion:"}
                </h5>
                <h6 className={"p-2 text-danger text-center w-100"} style={{ overflowX: "auto", overflowY: "hidden" }}>
                  {deleteTopicName}
                </h6>
                <div className={"d-flex justify-content-around mt-3 w-100"}>
                  <button
                    className={"btn btn-secondary"}
                    onClick={() => this.setState({ topicDeleteIsActive: false })}
                  >
                    {"Cancel"}
                  </button>
                  <button
                    className={"btn btn-danger"}
                    onClick={() => {
                      this.setState({ topicDeleteIsActive: false });
                      this.handleDeleteTopic(deleteTopicName);
                    }}
                  >
                    {"Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Error Modal */}
        {error && (
          <Modal onClose={() => this.setState({ error: "" })}>
            <div className={"d-flex align-items-center justify-content-center h-100 w-100"}>
              <div
                className={"bg-white d-flex justify-content-center p-1 rounded"}
                style={{ height: "200px", width: "200px" }}
              >
                <h5 className={"text-danger"}>{String(error)}</h5>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    AwsKafka.websocketStop();
  }

  handleCreateTopic = (topicName) => {
    this.setState({ topicsAreLoading: true });
    AwsKafka.createTopic(topicName)
    .catch((error) => this.setState({ error }))
    .finally(() => this.handleGetTopics());
  };

  handleDeleteTopic = (topicName) => {
    this.setState({ topicsAreLoading: true });
    AwsKafka.deleteTopic(topicName)
    .catch((error) => this.setState({ error }))
    .finally(() => this.handleGetTopics());
  };

  handleGetTopics = () => {
    this.handleResetSelectedTopic();
    this.setState({ topicsAreLoading: true });
    AwsKafka.getTopics()
    .then((topics) => {
      this.setState({
        topics: topics.sort((topic) => topic.getName()),
        topicsAreLoading: false
      });
    })
    .catch((error) => {
      this.setState({
        error,
        topicsAreLoading: false
      });
    });
  };

  handlePublishToTopic = (topicName, topicData) => {
    this.setState({ inputIsLoading: true });
    AwsKafka.publishToTopic(topicName, topicData)
    .catch((error) => this.setState({ error }))
    .finally(() => this.setState({ inputIsLoading: false }));
  };

  handleSelectTopic = (topicName) => {
    this.setState({
      selectedTopic: topicName,
      selectedTopicIsLoading: true,
      selectedTopicOutput: [],
    });
  };

  handleResetSelectedTopic = () => {
    this.setState({
      selectedTopic: "",
      selectedTopicIsLoading: false,
      selectedTopicOutput: [],
    });
  };
}
export default HomePage;
