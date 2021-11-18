// Libraries
import Orchestration from "./Orchestration.js";
import { WebSocketClient } from "./WebSocket.js";

// Constants (Global)
import Config from "../resources/Config.json";
import PublishSubscribeUtils from "../utils/PublishSubscribeUtils.js";

class AwsKafka {
  static connectionUrl = String(`http://${Config.kafkaEC2Address}:8080`);
  static subscribers = {};
  static websocket = null;

  static createTopic(topicName) {
    return new Promise((resolve, reject) => {
      Orchestration.createRequestWithBody(
        ("POST"),
        (`${AwsKafka.connectionUrl}/topics`),
        ({ topicName }),
        (httpError) => reject(httpError),
        (httpResponse) => resolve(httpResponse)
      );
    });
  }

  static deleteTopic(topicName) {
    return new Promise((resolve, reject) => {
      Orchestration.createRequestWithBody(
        ("DELETE"),
        (`${AwsKafka.connectionUrl}/topics`),
        ({ topicName }),
        (httpError) => reject(httpError),
        (httpResponse) => resolve(httpResponse)
      );
    });
  }

  static getTopics() {
    return new Promise((resolve, reject) => {
      Orchestration.createRequest(
        ("GET"),
        (`${AwsKafka.connectionUrl}/topics`),
        (httpError) => reject(httpError),
        (httpResponse) => resolve(httpResponse)
      );
    });
  }

  static publishToTopic(topicName, topicData) {
    return new Promise((resolve, reject) => {
      Orchestration.createRequestWithBody(
        ("POST"),
        (`${AwsKafka.connectionUrl}/publish`),
        ({ topicName, topicData }),
        (httpError) => reject(httpError),
        (httpResponse) => resolve(httpResponse)
      );
    });
  }

  static websocketStart() {
    if(AwsKafka.websocket instanceof WebSocketClient) {
      AwsKafka.websocket.onWebSocketServerMessage = (topicMessage) => AwsKafka.publish(topicMessage);
      if(AwsKafka.websocket.webSocketClient.CLOSED) {
        AwsKafka.websocket.initialize();
      }
    }
    else {
      AwsKafka.websocket = new WebSocketClient(
        (`${AwsKafka.connectionUrl.replace("http", "ws").replace(":8080", ":8081")}`),
        (topicMessage) => AwsKafka.publish(topicMessage)
      );
    }
  }

  static websocketStop() {
    if (AwsKafka.websocket instanceof WebSocketClient) {
      AwsKafka.websocket.shutdown();
    }
  }

  /*====================
  Publish & Subscribe
  ====================*/
  static publish(message) {
    PublishSubscribeUtils.publish(message, AwsKafka.subscribers);
  }

  static subscribe(callback) {
    PublishSubscribeUtils.subscribe(callback, AwsKafka.subscribers, "AwsKafka");
  }

  static unsubscribe(key) {
    PublishSubscribeUtils.unsubscribe(key, AwsKafka.subscribers);
  }
}
export default AwsKafka;


