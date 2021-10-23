// Libraries
import http from "http";
import UuidUtils from "../utils/UuidUtils";
import ws, { w3cwebsocket } from "websocket";

export class WebSocketServer {
  constructor(serverPort) {
    this.clients = {};
    this.httpServer = this.bindHttpServer(serverPort);
    this.webSocketServer = this.bindWebSocketServer(this.httpServer);
    this.initialize();
  }

  bindHttpServer(serverPort) {
    const httpServer = http.createServer();
    httpServer.listen(serverPort);
    return httpServer;
  }

  bindWebSocketServer(httpServer) {
    return new ws.server({ httpServer });
  }

  getClientIds() {
    return Object.keys(this.clients);
  }

  getWebSocketServerConnectionUrl() {
    const { address, port } = this.httpServer.address;
    return String(`ws://${address}:${port}`);
  }

  initialize() {
    const webSocketServer = this.webSocketServer;

    // Client Handshake
    webSocketServer.on("request", (request) =>{
      const clientId = UuidUtils.uuid(this.getClientIds());
      const clientConnection = request.accept(null, request.origin);
      this.clients[clientId] = {
        connection: clientConnection,
        isConnected: true,
      };
    });

    // Client Disconnect
    webSocketServer.on("close", (clientConnection) => {
      const clients = this.clients;
      for(const clientKeys in clients) {
        if(clients[clientKeys].connection.remoteAddress === clientConnection.remoteAddress) {
          clients[clientKeys].isConnected = false;
        }
      }
    });
  }

  publish(message) {
    const webSocketServer = this.webSocketServer;
    webSocketServer.broadcast(JSON.stringify(message));
  }
}

export class WebSocketClient {
  constructor(connectionUrl, onWebSocketServerMessage) {
    this.webSocketClient = this.bindWebSocketClient(connectionUrl);
    this.onWebSocketServerMessage = onWebSocketServerMessage;
  }

  bindWebSocketClient(connectionUrl) {
    const hasPrefix = String(connectionUrl).startsWith("ws://");
    return new w3cwebsocket(`${hasPrefix ? "" : "ws://"}${connectionUrl}`);
  }

  initialize() {
    const client = this.webSocketClient;
    const onWebSocketServerMessage = this.onWebSocketServerMessage;

    // Server Message
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if(onWebSocketServerMessage instanceof Function) {
        onWebSocketServerMessage(data);
      }
    };
  }

  publish(message) {
    const client = this.webSocketClient;
    client.send(JSON.stringify(message));
  }
}
