// Libraries
import React, { useCallback, useEffect } from "react";

// Components
import ExitButton from "../ExitButton";
import FocusLock from "../../components/FocusLock";

const DEFAULT_ZINDEX = 100;
const ESCAPE_KEY = 27;

const Modal = (props) => {
  // @props: align - String
  // @props: background - String
  // @props: closeButtonIcon - Object { SVG }
  // @props: closeButtonSize - String
  // @props: disableCloseButton - Boolean
  // @props: disableFocusLock - Boolean
  // @props: zIndex - Number

  const {
    children,
    closeButtonIcon,
    onClose,
  } = props;

  const disableCloseButton = props.disableCloseButton || false;
  const disableFocusLock = props.disableFocusLock || false;
  const zIndex = props.zIndex || DEFAULT_ZINDEX;

  const handleClose = useCallback(() => {
    if(onClose) {
      onClose();
    }
  }, [onClose]);

  // Escape Key Listener
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { keyCode } = event;
      if (keyCode === ESCAPE_KEY) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleClose]);

  return (
    <FocusLock
      className={`container-fluid h-100 ${props.background || ""}`}
      isLocked={!disableFocusLock}
      style={props.style || {
        left: 0,
        position: "fixed",
        top: 0,
        zIndex: zIndex || 1,
      }}
    >
      <div className={"bg-light row justify-content-center h-100"}>

        {/* Children */}
        <div className={"col-12 h-100"} style={{ position: "absolute", zIndex }}>
          {children}
        </div>
      </div>

      {/* Close Button */}
      {!disableCloseButton && (
        <ExitButton
          iconOverride={closeButtonIcon}
          size={props.closeButtonSize}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: Number(zIndex) + 1,
          }}
          onClick={() => handleClose()}
        />
      )}
    </FocusLock>
  );
};
export default Modal;
