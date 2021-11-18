// Libraries
import PublishSubscribeUtils from "../utils/PublishSubscribeUtils.js";

class Model {
  constructor(props) {
    this.state = {
      tags: {},
    };
    this.subscribers = {};

    if (props) {
      this.setTags(props.tags, true);
    }
  }

  // getters
  getTags() { return { ...this.state.tags }; }
  getSubsribers() { return { ...this.subscribers }; }

  // setters
  setTags(tags, suppressOnChange) {
    if (tags) {
      this.state.tags = { ...tags };
    }
    if (!suppressOnChange) this.onChange();
    return this.getTags();
  }

  /*====================
  onChange Publish & Subscribe
  ====================*/
  publish(message) {
    PublishSubscribeUtils.publish(message, this.subscribers);
  }

  subscribe(callback) {
    PublishSubscribeUtils.subscribe(callback, this.subscribers, "OnChange");
  }

  unsubscribe(key) {
    PublishSubscribeUtils.unsubscribe(key, this.subscribers);
  }

  onChange() {
    this.publish(this);
  }
}
export default Model;
