const IMAGE_CROSS_ORIGIN = "anonymous";
const IMAGE_FAILED_TO_LOAD_ERROR = "Could not load image:";
const MATH_MULTIPLIER_HALF = 0.5;

class ImageUtils {

  /*====================
  Canvas Management
  ====================*/
  static prepareCanvas(width, height) {
    const canvas = window.document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }

  static cleanCanvas(canvas) {
    canvas.remove();
    canvas = null;
  }

  /*====================
  Combine Images
  ====================*/
  static combine(
    background, foreground, clipToFit,
    backgroundWidth, backgroundHeight,
    foregroundWidth, foregroundHeight,
    backgroundXOffset, backgroundYOffset,
    foregroundXOffset, foregroundYOffset
  ) {
    return new Promise((resolve, reject) => {
      let backgroundLoaded = false;
      let foregroundLoaded = false;

      // setup executable as images may need to load first
      const combineImages = (foregroundImage, backgroundImage) => {
        // define the image size
        const bgHeight = backgroundHeight || backgroundImage.naturalHeight;
        const bgWidth = backgroundWidth || backgroundImage.naturalWidth;
        const fgHeight = foregroundHeight || foregroundImage.naturalHeight;
        const fgWidth = foregroundWidth || foregroundImage.naturalWidth;
        const heightLimit = Math.max(bgHeight, fgHeight);
        const widthLimit = Math.max(bgWidth, fgWidth);

        // define the image scaling
        const bgXscaler = widthLimit / Math.max(1, bgWidth);
        const bgYscaler = heightLimit / Math.max(1, bgHeight);
        const bgScaler = clipToFit
          ? Math.max(bgXscaler, bgYscaler)
          : Math.min(bgXscaler, bgYscaler);
        const fgXscaler = widthLimit / Math.max(1, fgWidth);
        const fgYscaler = heightLimit / Math.max(1, fgHeight);
        const fgScaler = clipToFit
          ? Math.max(fgXscaler, fgYscaler)
          : Math.min(fgXscaler, fgYscaler);

        // define the image offsets
        const bgX = backgroundXOffset || ((bgWidth * bgScaler) - bgWidth) * MATH_MULTIPLIER_HALF;
        const bgY = backgroundYOffset || ((bgHeight * bgScaler) - bgHeight) * MATH_MULTIPLIER_HALF;
        const fgX = foregroundXOffset || ((fgWidth * fgScaler) - fgWidth) * MATH_MULTIPLIER_HALF;
        const fgY = foregroundYOffset || ((fgHeight * fgScaler) - fgHeight) * MATH_MULTIPLIER_HALF;

        // prepare the canvas
        const boundsHeight = Math.max(bgHeight, fgHeight);
        const boundsWidth = Math.max(bgWidth, fgWidth);
        const canvas = ImageUtils.prepareCanvas(boundsWidth, boundsHeight);
        const ctx = canvas.getContext('2d');

        // draw on the canvas
        ctx.drawImage(backgroundImage, bgX, bgY, bgWidth, bgHeight);
        ctx.drawImage(foregroundImage, fgX, fgY, fgWidth, fgHeight);
 
        // callback with combined image
        const newImage = new Image();
        newImage.onload = () => {
          resolve(newImage);
          ImageUtils.cleanCanvas(canvas);
        }
        newImage.src = canvas.toDataURL();
      };

      // Load Background
      ImageUtils.loadImage(background)
      .then((loadedImage) => {
        background = loadedImage;
        backgroundLoaded = true;
        if(backgroundLoaded && foregroundLoaded) {
          combineImages(foreground, background);
        }
      })
      .catch((error) => reject(error));

      // Load Foreground
      ImageUtils.loadImage(foreground)
      .then((loadedImage) => {
        foreground = loadedImage;
        foregroundLoaded = true;
        if(backgroundLoaded && foregroundLoaded) {
          combineImages(foreground, background);
        }
      })
      .catch((error) => reject(error));
    });
  }

  /*====================
  File Conversion
  ====================*/
  static convertToBlob(image) {
    return new Promise ((resolve, reject) => {
      ImageUtils.loadImage(image)
      .then((loadedImage) => {
        // prepare the canvas
        const canvas = ImageUtils.prepareCanvas(loadedImage.naturalWidth, loadedImage.naturalWidth);
        const ctx = canvas.getContext('2d');

        // draw on the canvas
        ctx.drawImage(loadedImage,
          0, 0, loadedImage.naturalWidth, loadedImage.naturalHeight,
          0, 0, loadedImage.naturalWidth, loadedImage.naturalHeight
        );

        // callback with the image as a blob
        canvas.toBlob((blob) => {
          resolve(blob);
          ImageUtils.cleanCanvas(canvas);
        });
      })
      .catch((error) => reject(error));
    });
  }

  static loadImage(image) {
    return new Promise((resolve, reject) => {
      if(image.naturalHeight) resolve(image);
      else {
        const newImage = new Image();
        newImage.crossOrigin = IMAGE_CROSS_ORIGIN;
        newImage.onerror = (e) => reject(`${IMAGE_FAILED_TO_LOAD_ERROR} ${image}`);
        newImage.onload = () => resolve(newImage);
        newImage.src = image.src || image;
      }
    });
  }

  /*====================
  Resize Images
  ====================*/
  static resizeToLimit(image, sizeLimiter, clipToFit) {
    return ImageUtils.resize(image, sizeLimiter, sizeLimiter, clipToFit);
  }

  static resize(image, newWidth, newHeight, clipToFit) {
    return new Promise((resolve, reject) => {
      ImageUtils.loadImage(image)
      .then((loadedImage) => {
        // prepare the canvas
        const canvas = ImageUtils.prepareCanvas(newWidth, newHeight);
        const ctx = canvas.getContext('2d');

        // calculate the scaling and offsets
        const scalerX = newWidth / Math.max(1, loadedImage.naturalWidth);
        const scalerY = newHeight / Math.max(1, loadedImage.naturalHeight);
        const scaler = clipToFit
          ? Math.max(scalerX, scalerY)
          : Math.min(scalerX, scalerY);
        const scaledWidth = loadedImage.naturalWidth * scaler;
        const scaledHeight = loadedImage.naturalHeight * scaler;
        const offsetX = (newWidth - scaledWidth) * MATH_MULTIPLIER_HALF;
        const offsetY = (newHeight - scaledHeight) * MATH_MULTIPLIER_HALF;

        // draw on the canvas
        ctx.drawImage(loadedImage, offsetX, offsetY, scaledWidth, scaledHeight);

        // callback with the resized image
        const newImage = new Image();
        newImage.onload = () => {
          resolve(newImage);
          ImageUtils.cleanCanvas(canvas);
        };
        newImage.src = canvas.toDataURL();
      })
      .catch((error) => reject(error));
    });
  }
}
export default ImageUtils;
