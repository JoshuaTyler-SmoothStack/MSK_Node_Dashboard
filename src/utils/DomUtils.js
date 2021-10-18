class DomUtils {
  static mountScript(src) {
    return new Promise ((resolve, reject) => {
      const script = window.document.createElement("script");
      script.onload = () => resolve(script);
      script.onerror = (error) => reject(error);
      script.src = src;
      window.document.body.appendChild(script);
    });
  }
}
export default DomUtils;
