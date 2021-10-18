// Libraries
import InteractionUtils from "./InteractionUtils";

const APPLICATION_DISPLAY_WIDTH_MINIMUM = 300;
const BREAKPOINT_XSMALL = 375;
const BREAKPOINT_SMALL = 576;
const BREAKPOINT_MEDIUM = 768;
const BREAKPOINT_LARGE = 992;
const BREAKPOINT_XLARGE = 1200;
const BREAKPOINT_XXLARGE = 1400;
const ERROR_BAD_CALLBACK = "Unable to initialize ResizeUtils, invalid callback functions";
const RESIZE_MINIMUM_WAIT_TIME = 100;

class ResizeUtils {
  static lastUpdate = 0;
  static warningActive = false;
  static onResize = null;
  static onWarning = null;
  static subscribers = {};

  static initialize(onResize, onWarning, onRevokeWarning) {
    return new Promise ((resolve, reject) => {
      if(onResize instanceof Function &&
        onWarning instanceof Function &&
        onRevokeWarning instanceof Function
      ) {
        ResizeUtils.onResize = onResize;
        ResizeUtils.onWarning = onWarning;
        ResizeUtils.onRevokeWarning = onRevokeWarning;
        const key = InteractionUtils.subscribe("resize", () => ResizeUtils.update());
        ResizeUtils.update();
        resolve(key);
      }
      else {
        reject(ERROR_BAD_CALLBACK);
      }
    });
  }

  static update() {
    if(Date.now() - ResizeUtils.lastUpdate > RESIZE_MINIMUM_WAIT_TIME) {
      ResizeUtils.lastUpdate = Date.now();
      const minSizer = Math.min(window.innerWidth, window.outerWidth);
      let newSize = "xx_small";
      if (minSizer > BREAKPOINT_XSMALL) newSize = "x_small";
      if (minSizer >= BREAKPOINT_SMALL) newSize = "small";
      if (minSizer >= BREAKPOINT_MEDIUM) newSize = "medium";
      if (minSizer >= BREAKPOINT_LARGE) newSize = "large";
      if (minSizer >= BREAKPOINT_XLARGE) newSize = "x_large";
      if (minSizer >= BREAKPOINT_XXLARGE) newSize = "xx_large";

      ResizeUtils.onResize(newSize);
      if(minSizer < APPLICATION_DISPLAY_WIDTH_MINIMUM) {
        ResizeUtils.warningActive = true;
        ResizeUtils.onWarning(APPLICATION_DISPLAY_WIDTH_MINIMUM);
      }
      else if(ResizeUtils.warningActive) {
        ResizeUtils.warningActive = false;
        ResizeUtils.onRevokeWarning();
      }
    }
  }
}
export default ResizeUtils;
