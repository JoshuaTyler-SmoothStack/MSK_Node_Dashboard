class TestingUtils {
  static simulateNetworkDelay(delay) {
    return new Promise ((resolve) => {
      setTimeout(() => resolve(), delay);
    });
  }
}
export default TestingUtils;
