// Libraries
import Model from "./Model.js";
import UuidUtils from "../utils/UuidUtils.js";
import Validations from "./Validations.js";

// Constants (Local)
const STATUS_CONNECTED = "CONNECTED";
const STATUS_NOT_CONNECTED = "NOT_CONNECTED";

class Producer extends Model {
  constructor(props) {
    super();
    this.state = {
      id: UuidUtils.uuid(),
      isProducing: false,
      lastMessageTimestamp: Date.now(),
      name: "",
      status: STATUS_NOT_CONNECTED,
      topics: []
    }

    if(props) {
      this.setIsProducing(props.isProducing);
      this.setLastMessageTimeStamp(props.lastMessageTimestamp);
      this.setName(props.name);
      this.setStatus(props.status);
      this.setTopics(props.topics);
    }
  }

  // getters
  getId() { return String(this.state.id); }
  getIsProducing() { return Boolean(this.state.isProducing); }
  getLastMessageTimestamp() { return Number(this.state.lastMessageTimestamp); }
  getName() { return String(this.state.name); }
  getStatus() { return String(this.state.status); }
  getTopics() {return [ ...this.state.topics ]; }

  // setters
  setIsProducing(boolean, suppressOnChange) {
    this.state.isProducing = Boolean(boolean);
    if(!suppressOnChange) this.onChange();
    return this.getIsProducing();
  }

  setLastMessageTimeStamp(lastMessageTimestamp, suppressOnChange) {
    if(Validations.number(lastMessageTimestamp)) {
      this.state.lastMessageTimestamp = Number(lastMessageTimestamp);
    }
    if(!suppressOnChange) this.onChange();
    return this.getLastMessageTimestamp();
  }

  setName(name, suppressOnChange) {
    if(Validations.string(name)) {
      this.state.name = String(name);
    }
    else {
      this.state.name = "";
    }
    if(!suppressOnChange) this.onChange();
    return this.getName();
  }

  setStatus(status, suppressOnChange) {
    if(status === STATUS_CONNECTED ||
      status === STATUS_NOT_CONNECTED
    ) {
      this.state.status = String(status);
    }
    if(!suppressOnChange) this.onChange();
    return this.getStatus();
  }

  setStatusConnected(suppressOnChange) {
    this.setStatus(STATUS_CONNECTED, suppressOnChange);
  }

  setStatusNotConnected(suppressOnChange) {
    this.setStatus(STATUS_NOT_CONNECTED, suppressOnChange);
  }

  setTopics(topics, suppressOnChange) {
    const tempTopics = [];
    for(const index in topics) {
      if(topics[index]) {
        const topic = topics[index];
        tempTopics.push(topic);
      }
    }
    this.state.topics = [ ...tempTopics ];
    if(!suppressOnChange) this.onChange();
    return this.getTopics();
  }

  // helpers
  addTopic(topic, suppressOnChange) {
    if(topic) {
      const { topics } = this.state;
      if(!topics.includes(topic)) {
        const tempTopics = [ ...topics ];
        tempTopics.push(topic);
        this.state.topics = [ ...tempTopics ];
      }
    }
    if(!suppressOnChange) this.onChange();
    return this.getTopics();
  }
}
export default Producer;
