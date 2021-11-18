// Global Libraries
import PublishSubscribeUtils from "./PublishSubscribeUtils.js";

// Constants - Global
import { ENVIRONMENTS } from "../statemanagement/Store.js";

class LoggerUtils {
  static debugActive = true;
  static errorActive = true;
  static infoActive = true;
  static warnActive = true;
  static subscribers = {};

  /*====================
  Initialization
  ====================*/
  static initialize(environment, suppress) {
    switch (String(environment)) {

      // Development
      case String(ENVIRONMENTS.development):
        this.debugActive = true;
        this.errorActive = true;
        this.infoActive = true;
        this.warnActive = true;
        break;

      // Testing
      case String(ENVIRONMENTS.testing):
        this.debugActive = false;
        this.errorActive = false;
        this.infoActive = false;
        this.warnActive = false;
        break;

      // Production - (!dev && !test)
      default:
        environment = String(ENVIRONMENTS.production);
        this.debugActive = false;
        this.errorActive = true;
        this.infoActive = true;
        this.warnActive = true;
    }

    if(!suppress && environment !== ENVIRONMENTS.testing) {
      LoggerUtils.debug("Debug Enabled");
      LoggerUtils.error("Error Enabled");
      LoggerUtils.info("Info Enabled");
      LoggerUtils.warn("Warning Enabled");
    }
  }

  /*====================
  Logging
  ====================*/
  static bypass(message) {
    console.log(message);
  }

  static debug(message) {
    if (this.debugActive) {
      const formattedMessage = String(`[DEBUG]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      if (formattedMessage === "[DEBUG]: [object Object]") {
        console.debug(message);
      } else {
        console.debug(formattedMessage);
      }
    }
  }

  static error(message) {
    if (this.errorActive) {
      const formattedMessage = String(`[ERROR]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.error(formattedMessage);
    }
  }

  static info(message) {
    if (this.infoActive) {
      const formattedMessage = String(`[INFO]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.info(formattedMessage);
    }
  }

  static warn(message) {
    if (this.warnActive) {
      const formattedMessage = String(`[WARN]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.warn(formattedMessage);
    }
  }

  /*====================
  Publish & Subscribe
  ====================*/
  static publish(message) {
    PublishSubscribeUtils.publish(message, LoggerUtils.subscribers);
  }

  static subscribe(onLog) {
    PublishSubscribeUtils.subscribe(onLog, LoggerUtils.subscribers, "LoggerUtils");
  }

  static unsubscribe(key) {
    PublishSubscribeUtils.unsubscribe(key, LoggerUtils.subscribers);
  }
}
export default LoggerUtils;
