// Libraries
import UuidUtils from "./UuidUtils";

class InteractionUtils {
  static eventListeners = {};
  static subscribers = {};

  /*====================
  Event Listeners
  ====================*/
  static addEventListener(eventType) {
    if(eventType) {
      if(InteractionUtils.eventListeners.hasOwnProperty(eventType)) {
        InteractionUtils.eventListeners[eventType] += 1;
      }
      else {
        InteractionUtils.eventListeners[eventType] = 1;
        window.addEventListener(eventType, (e) => InteractionUtils.publish(e));
      }
    }
  }

  static removeEventListener(eventType) {
    if(InteractionUtils.eventListeners.hasOwnProperty(eventType)) {
      if(InteractionUtils.eventListeners[eventType] > 1) {
        InteractionUtils.eventListeners[eventType] -= 1;
      }
      else {
        delete(InteractionUtils.eventListeners[eventType]);
        window.removeEventListener(eventType);
      }
    }
  }

  /*====================
  Publish & Subcribe
  ====================*/
  static publish(event) {
    let eventPublished = false;
    for(const key in InteractionUtils.subscribers) {
      if(InteractionUtils.subscribers[key]) {
        const subscriber = InteractionUtils.subscribers[key];
        if(subscriber.eventType === event.type) {
          eventPublished = true;
          if(subscriber.onEvent instanceof Function) {
            subscriber.onEvent(event);
          }
        }
      }
      else {
        InteractionUtils.unsubscribe(key);
      }
    }

    if(!eventPublished) {
      InteractionUtils.removeEventListener(event.type);
    }
  }

  static subscribe(eventType, onEvent) {
    const key = String(`InteractionUtils-Subscriber-${UuidUtils.uuid()}`);
    InteractionUtils.addEventListener(eventType);
    InteractionUtils.subscribers[key] = {
      eventType,
      onEvent,
    };
    return key;
  }

  static unsubscribe(key) {
    if(InteractionUtils.subscribers.hasOwnProperty(key)) {
      delete(InteractionUtils.subscribers[key]);
    }
  }
}
export default InteractionUtils;
