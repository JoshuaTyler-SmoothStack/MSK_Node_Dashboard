// Libraries
import Model from "./Model.js";
import UuidUtils from "../utils/UuidUtils.js";
import Validations from "./Validations.js";

class Topic extends Model {
  constructor(props) {
    super();
    this.state = {
      config: {},
      consumers: [],
      id: UuidUtils.uuid(),
      lastMessageTimestamp: Date.now(),
      name: "UnnamedTopic",
      producers: [],
      topics: []
    }

    if(props) {
      this.setConfig(props.config);
      this.setConsumers(props.consumers);
      this.setLastMessageTimeStamp(props.lastMessageTimestamp);
      this.setName(props.name);
      this.setProducers(props.producers);
    }
  }

  // getters
  getConfig() { return { ...this.state.config }; }
  getConsumers() { return [ ...this.state.consumers ]; }
  getId() { return String(this.state.id); }
  getLastMessageTimestamp() { return Number(this.state.lastMessageTimestamp); }
  getName() { return String(this.state.name); }
  getProducers() { return [ ...this.state.producers ]; }

  // setters
  setConfig(config, suppressOnChange) {
    if(config) {
      this.state.config = { ...config };
    }
    if(!suppressOnChange) this.onChange();
    return this.getConfig();
  }

  setConsumers(consumers, suppressOnChange) {
    const tempConsumers = [];
    for(const index in consumers) {
      if(consumers[index]) {
        const topic = consumers[index];
        tempConsumers.push(topic);
      }
    }
    this.state.consumers = [ ...tempConsumers ];
    if(!suppressOnChange) this.onChange();
    return this.getConsumers();
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

  setProducers(producers, suppressOnChange) {
    const tempProducers = [];
    for(const index in producers) {
      if(producers[index]) {
        const topic = producers[index];
        tempProducers.push(topic);
      }
    }
    this.state.producers = [ ...tempProducers ];
    if(!suppressOnChange) this.onChange();
    return this.getProducers();
  }

  // helpers
  addConsumer(consumer, suppressOnChange) {
    if(consumer) {
      const { consumers } = this.state;
      if(!consumers.includes(consumer)) {
        const tempConsumers = [ ...consumers ];
        tempConsumers.push(consumers);
        this.state.consumers = [ ...tempConsumers ];
      }
    }
    if(!suppressOnChange) this.onChange();
    return this.getConsumers();
  }

  addProducer(producer, suppressOnChange) {
    if(producer) {
      const { producers } = this.state;
      if(!producers.includes(producer)) {
        const tempProducers = [ ...producers ];
        tempProducers.push(producers);
        this.state.producers = [ ...tempProducers ];
      }
    }
    if(!suppressOnChange) this.onChange();
    return this.getProducers();
  }

  hasActiveProducer() {
    const producers = this.getProducers();
    for(const index in producers) {
      if(producers[index].getIsProducing()) {
        return true;
      }
    }
    return false;
  }
}
export default Topic;
