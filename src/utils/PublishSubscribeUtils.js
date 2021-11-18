// Libraries
import UuidUtils from "./UuidUtils";

class PublishSubscribeUtils {
  static publish(message, subscribers) {
    if(!message) throw new Error("Cannot publish to subscribers, empty or undefined message.");
    if(!subscribers) throw new Error("Cannot publish message, undefined subscribers.");

    const subscriberKeys = Object.keys(subscribers);
    for (const key in subscriberKeys) {
      if (subscribers[subscriberKeys[key]] instanceof Function) {
        subscribers[subscriberKeys[key]](message);
      } else {
        PublishSubscribeUtils.unsubscribe(subscriberKeys[key], subscribers);
      }
    }
  }

  static subscribe(onChangeCallback, subscribers, customKey) {
    if (!onChangeCallback instanceof Function) {
      throw new Error("Callback is not an instance of Function, cannot subscribe.");
    }
    const key = String(`${customKey ? (customKey + "-") : ""}Subscriber-${UuidUtils.uuid()}`);
    subscribers[key] = onChangeCallback;
  }

  static unsubscribe(key, subscribers) {
    if (subscribers.hasOwnProperty(key)) {
      delete subscribers[key];
    }
  }
}
export default PublishSubscribeUtils;
