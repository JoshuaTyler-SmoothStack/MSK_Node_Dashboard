// Libraries
import React, { Component } from "react";

// Components
import LocalToolbar from "./LocalToolbar";
import ImageFrame from "../ImageFrame/ImageFrame";
import LoadingSpinner from "../../components/LoadingSpinner";

class ImageCarousel extends Component {
  constructor(props) {
    super(props);

    // @props: allowOverflow - Boolean
    // @props: contain - Boolean
    // @props: disableFullscreenToggleButton - Boolean
    // @props: images - Object { imageKey: { thumbnail: url, small: url, medium: url, large: url } || url}
    // @props: imageMargin - Number | String
    // @props: imageSelectedOverride - String
    // @props: toolbarClassName - String
    // @props: toolbarStyle - Object{}
    // @props: onFullscreen - Function(Boolean)
    // @props: onSelectingImage - Function(String)

    this.state = {
      fullscreen: false,
      imageSelected: props.imageSelectedOverride || null,
    };
  }

  render() {
    const allowOverflow = this.props.allowOverflow || false;
    const contain = this.props.contain || false;
    const disableFullscreenToggleButton = this.props.disableFullscreenToggleButton || false;
    const imageMargin = this.props.imageMargin || 0;
    const images = this.props.images || {};
    const imageKeys = Object.keys(images);
    const { imageSelected } = this.state;

    if (imageKeys.length && imageSelected) {
      const imageTypeIsSingleUrl = imageSelected.thumbnail ? false : true;

      // Determine structure for ImageUrl(s)
      const imageType = {};
      if (imageTypeIsSingleUrl) imageType.imageUrl = imageSelected;
      else imageType.imageUrls = imageSelected;

      // Calculate pagination for quick buttons
      let indexOfImageSelected = 0;
      for (const keyIndex in imageKeys) {
        if (images[imageKeys[keyIndex]] === imageSelected) {
          indexOfImageSelected = keyIndex;
          break;
        }
      }

      const pagination = {
        next: Number(indexOfImageSelected) < imageKeys.length,
        previous: Number(indexOfImageSelected) > 0,
        selected: Number(indexOfImageSelected),
        pos1: 0,
        pos2: Number(indexOfImageSelected) !== 0 ? Number(indexOfImageSelected) : 1,
        pos3: imageKeys.length - 1,
        isPaginationDisabled: false,
        isPos2Disabled: false,
        isPos3Disabled: false,
      };

      if (imageKeys.length < 2) {
        pagination.isPaginationDisabled = true;
      } else if (imageKeys.length < 3) {
        pagination.isPos2Disabled = true;
      }

      if (Number(indexOfImageSelected) === imageKeys.length - 1) {
        pagination.next = false;
        pagination.pos2 = Number(indexOfImageSelected) - 1;
      }
      const disabledPagination = pagination.isPaginationDisabled;

      return (
        <div
          className={this.props.className || "d-flex align-items-center justify-content-center"}
          style={this.props.style || { position: "relative", overflow: "hidden" }}
        >
          {/* Image Frame */}
          <ImageFrame
            {...imageType}
            contain={contain}
            style={{
              height: "100%",
              margin: imageMargin,
              overflow: allowOverflow
                ? "visible"
                : "hidden",
              width: "100%"
            }}
          />

          {/* Buttons */}
          {!disabledPagination && (
            <LocalToolbar
              disableFullscreenToggleButton={disableFullscreenToggleButton}
              indexOfImageSelected={indexOfImageSelected}
              pagination={pagination}
              paginationClassName={this.props.toolbarClassName}
              style={this.props.toolbarStyle}
              onFullscreen={() => this.handleFullscreenOpen()}
              onSelectImage={(newImageIndex) => this.handleSelectImageByIndex(newImageIndex)}
            />
          )}
        </div>
      );
    }
    else {
      return (
        <div
          className={this.props.className || "d-flex"}
          style={this.props.style}
        >
          <LoadingSpinner/>
        </div>
      );
    }
  }

  componentDidMount() {
    this.handleSelectImageByIndex(0);
  }

  componentDidUpdate() {
    this.handleSelectImageOverride();
  }

  handleFullscreenClose = () => {
    const { onFullscreen } = this.props;
    this.setState({ fullscreen: false });
    if(onFullscreen instanceof Function) {
      onFullscreen(false);
    }
  };

  handleFullscreenOpen = () => {
    const { onFullscreen } = this.props;
    this.setState({ fullscreen: true });
    if(onFullscreen instanceof Function) {
      onFullscreen(true);
    }
  };

  handleSelectImage = (newImageKey) => {
    const { images, onSelectImage } = this.props;
    const { imageSelected } = this.state;

    if (images[newImageKey] !== imageSelected) {
      this.setState({ imageSelected: images[newImageKey] });
      if (onSelectImage instanceof Function) {
        onSelectImage(newImageKey);
      }
    }
  };

  handleSelectImageByIndex = (newImageKeyIndex) => {
    const { images } = this.props;
    if(images) {
      const imageKeys = Object.keys(images);
      const newImageKey = imageKeys[newImageKeyIndex];
      this.handleSelectImage(newImageKey);
    }
  };

  handleSelectImageOverride = () => {
    const { imageSelectedOverride } = this.props;
    const { imageSelected } = this.props;
    if (imageSelectedOverride && imageSelected !== imageSelectedOverride) {
      this.handleSelectImage(imageSelectedOverride);
    }
  };
}
export default ImageCarousel;
