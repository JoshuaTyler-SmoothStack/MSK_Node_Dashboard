// Libraries
import Orchestration from "./Orchestration.js";
import { WebSocketClient } from "./WebSocket.js";

// Constants (Global)
import Config from "../resources/Config.json";
import PublishSubscribeUtils from "../utils/PublishSubscribeUtils.js";

// Models
import Consumer from "../models/Consumer.js";
import Producer from "../models/Producer.js";
import Topic from "../models/Topic.js";

class AwsKafka {
  static awsMskArn = "";
  static awsMskBootstrapBrokers = "";
  static awsMskZookeeperConnection = "";
  static awsRegion = "";
  static connectionUrl = String(`http://${Config.kafkaEC2Address}:8080`);
  static consumers = [ new Consumer({ name: "kafkaNode-EC2" }), new Consumer({ name: "kafkaJava-EC2" }) ];
  static producers = [ new Producer({ name: "msk_node_s3_put" }) ];
  static subscribers = {};
  static topics = [ new Topic({ name: "TestTopic" }) ];
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
        (httpResponse) => resolve(AwsKafka.processTopics(httpResponse))
      );
    });
  }

  static initialize() {
    return new Promise((resolve, reject) => {
      Orchestration.createRequest(
        ("GET"),
        (`${AwsKafka.connectionUrl}/kafka`),
        (httpError) => reject(httpError),
        (httpResponse) => {
          if (httpResponse.bootstrapBrokers &&
            httpResponse.zookeeperConnectionString
          ) {
            AwsKafka.awsMskArn = httpResponse.arn;
            AwsKafka.awsMskBootstrapBrokers = httpResponse.bootstrapBrokers;
            AwsKafka.awsMskZookeeperConnection = httpResponse.zookeeperConnectionString;
            AwsKafka.awsRegion = httpResponse.region;
            resolve();
          } else {
            reject(`Invalid Kafka configuration data: ${httpResponse}`);
          }
        }
      );
    });
  }

  static processTopics(topics) {
    const currentTopics = [ ...AwsKafka.topics ];
    const currentTopicNames = currentTopics.map((topic) => topic.getName());
    const newTopics = [ ...topics ];

    for(const index in newTopics) {
      if(newTopics[index] && !currentTopicNames.includes(newTopics[index])) {
        currentTopics.push(new Topic({ name: newTopics[index] }));
      }
    }
    AwsKafka.topics = [ ...currentTopics ].sort((a, b) => {
      if (a.getName() < b.getName()) return -1;
      if (a.getName() > b.getName()) return 1;
      return 0;
    });
    return [ ...AwsKafka.topics ];
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


