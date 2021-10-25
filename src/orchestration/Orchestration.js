class Orchestration {
  static httpRequest(requestType, requestPath, requestHeaders, requestBody, httpError, httpResponseBody) {

    // Content Negotiation
    const contentNegotiation = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    // Headers
    const headers = { ...contentNegotiation, ...requestHeaders };

    // Body
    const body = (requestType !== "GET" && requestType !== "DELETE")
      ? JSON.stringify(requestBody)
      : null;

    // Request
    fetch(requestPath, {
      headers,
      body,
      method: requestType,
    })
    .then((response) => response.clone().json())
    .then((data) => httpResponseBody(data))
    .catch((err) => httpError(err));
  }

  static createRequest(requestType, requestPath, httpError, httpResponseBody) {
    Orchestration.httpRequest(requestType, requestPath, {}, {}, httpError, httpResponseBody);
  }

  static createRequestWithHeader(requestType, requestPath, requestHeader, httpError, httpResponseBody) {
    Orchestration.httpRequest(requestType, requestPath, requestHeader, {}, httpError, httpResponseBody);
  }

  static createRequestWithBody(requestType, requestPath, requestBody, httpError, httpResponseBody) {
    Orchestration.httpRequest(requestType, requestPath, {}, requestBody, httpError, httpResponseBody);
  }
}
export default Orchestration;
