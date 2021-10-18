// Libraries
import React, { Component, createRef } from "react";

// Components
import ImageQualityRampingIndicator from "./ImageQualityRampIndicator";
import LoadingSpinner from "../../components/LoadingSpinner";

const IMAGE_DISPLAY_SIZE_DEFAULT = 100;
const IMAGE_SIZE_MEDIUM = "medium";
const IMAGE_SIZE_LARGE = "large";
const IMAGE_SIZE_SMALL = "small";
const IMAGE_SIZE_THUMBNAIL = "thumbnail";

class ImageFrame extends Component {
  constructor(props) {
    super(props);
    // @props: contain - Boolean
    // @props: imageClassName - String
    // @props: imageSizeLimit - String
    // @props: imageUrl - String
    // @props: imageUrls - Object{ thumbnail, small, medium, large }

    this.containerRef = createRef(null);
    this.imageRef = createRef(null);

    this.state = {
      _isMounted: false,
      imageDisplayHeight: IMAGE_DISPLAY_SIZE_DEFAULT,
      imageDisplayWidth: IMAGE_DISPLAY_SIZE_DEFAULT,
      imageLoaded: false,
      imageQualityRamping: false,
      imageUrl: null,
      isVisibile: false,
      lastPassedImageUrl: null,
      lastPassedImageUrls: null,
      scrollListenerKey: null,
    };
  }

  render() {
    const { className, style } = this.props;
    const {
      imageDisplayHeight,
      imageDisplayWidth,
      imageLoaded,
      imageQualityRamping,
      imageUrl,
    } = this.state;

    return (
      <div
        className={(className || "d-flex flex-column align-items-center justify-content-center text-center")}
        ref={this.containerRef}
        style={style || { position: "relative" }}
      >
        {/* No Image */}
        {!imageUrl && (
          <div
            className={"text-center text-dark w-100"}
            style={{ position: "absolute", top: 0 }}
          >
            {"No image available."}
          </div>
        )}

        {/* Image */}
        {imageUrl && (
          <img
            alt={""}
            className={(this.props.imageClassName || "rounded kit-border-shadow")}
            ref={this.imageRef}
            src={imageUrl}
            style={{
              height: imageDisplayHeight,
              width: imageDisplayWidth,
            }}
            onLoad={() => this.handleCenterImage()}
          />
        )}

        {/* Image Loading */}
        {!imageLoaded && (
          <div
            className={"d-flex h-75 w-100"}
            style={{ position: "absolute", top: 0 }}
          >
            <LoadingSpinner/>
          </div>
        )}

        {/* Image Quality Ramping */}
        {imageQualityRamping && (
          <ImageQualityRampingIndicator
            miniDisplay={true}
            style={{
              borderBottomLeftRadius: "0.5rem",
              maxHeight: "33%",
              maxWidth: "33%",
              position: "absolute",
              right: 0,
              top: 0,
              width: "7rem",
            }}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.setState({ _isMounted: true });
    this.handleInitialUrlSelection();
  }

  componentDidUpdate() {
    this.handleInitialUrlSelection();
  }

  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }

  handleCenterImage = () => {
    const { contain } = this.props;
    const { imageUrl } = this.state;
    if(imageUrl) {
      const loadedImage = new Image();
      loadedImage.onload = () => {
        const container = this.containerRef.current;
        if(container) {
          const heightScale = Math.max(container.clientHeight, 1) / Math.max(loadedImage.naturalHeight, 1);
          const widthScale = Math.max(container.clientWidth, 1) / Math.max(loadedImage.naturalWidth, 1);
          const scale = contain
            ? Math.min(heightScale, widthScale)
            : Math.max(heightScale, widthScale);

          const height = loadedImage.naturalHeight * scale;
          const width = loadedImage.naturalWidth * scale;

          this.handleSetState({
            imageLoaded: true,
            imageDisplayHeight: height,
            imageDisplayWidth: width,
          });
        }
      };
      loadedImage.src = imageUrl;
    }
  };

  handleImageQualityRamp = (nextImageSize) => {
    const { imageSizeLimit, imageUrls } = this.props;
    if(imageUrls && imageUrls[nextImageSize]) {
      const image = new Image();
      image.onload = () => {
        this.handleSetState({ imageUrl: imageUrls[nextImageSize] });
        if(imageSizeLimit && nextImageSize === imageSizeLimit) {
          this.handleSetState({ imageQualityRamping: false });
        }
        else if(nextImageSize === IMAGE_SIZE_THUMBNAIL) this.handleImageQualityRamp(IMAGE_SIZE_SMALL);
        else if(nextImageSize === IMAGE_SIZE_SMALL) this.handleImageQualityRamp(IMAGE_SIZE_MEDIUM);
        else if(nextImageSize === IMAGE_SIZE_MEDIUM) this.handleImageQualityRamp(IMAGE_SIZE_LARGE);
        else this.handleSetState({ imageQualityRamping: false });
      };
      image.src = imageUrls[nextImageSize];
    }
    else this.handleSetState({ imageQualityRamping: false });
  };

  handleInitialUrlSelection = () => {
    const { imageUrl, imageUrls } = this.props;
    const { lastPassedImageUrl, lastPassedImageUrls } = this.state;

    if(imageUrl !== lastPassedImageUrl || imageUrls !== lastPassedImageUrls) {
      this.handleSetState({
        lastPassedImageUrl: imageUrl,
        lastPassedImageUrls: imageUrls,
      });

      if(imageUrl) {
        this.handleSetState({ imageUrl });
      }
      else if (imageUrls && imageUrls[IMAGE_SIZE_THUMBNAIL]) {
        this.handleSetState({
          imageQualityRamping: true,
          imageUrl: imageUrls[IMAGE_SIZE_THUMBNAIL],
        });
        this.handleImageQualityRamp(IMAGE_SIZE_SMALL);
      }
      else {
        this.handleSetState({ imageLoaded: true });
      }
    }
  };

  handleSetState = (newState, callback) => {
    const { _isMounted } = this.state;
    if(_isMounted) {
      this.setState({ ...newState }, callback);
    }
  };
}
export default ImageFrame;
