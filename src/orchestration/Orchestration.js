class Orchestration {
  static httpRequest(requestType, requestPath, requestHeaders, requestBody, httpError, httpResponseBody) {

    // Content Negotiation
    const contentNegotiation = {
      "Accept": "application/" + Orchestration.contentType,
      "Content-Type": "application/" + Orchestration.contentType,
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
    .then((response) => response.clone().json().catch(() => response.text()))
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
