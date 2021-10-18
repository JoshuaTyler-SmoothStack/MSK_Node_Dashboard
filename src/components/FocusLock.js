// Libraries
import React, { useEffect, useRef } from "react";

const TAB_KEY = 9;

const FocusLock = (props) => {
  const isLocked = props.isLocked || true;
  const rootNode = useRef(null);
  const focusableItems = useRef([]);

  useEffect(() => {
    const updateFocusableItems = () => {
      focusableItems.current = rootNode.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
      );
    };

    const observer = new MutationObserver(() => updateFocusableItems());
    updateFocusableItems();
    observer.observe(rootNode.current, { childList: true });
    return () => observer.disconnect();
  }, [rootNode]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (focusableItems.current) {
        const { keyCode, shiftKey } = event;
        const {
          length,
          0: firstItem,
          [length - 1]: lastItem,
        } = focusableItems.current;

        if (isLocked && keyCode === TAB_KEY) {
          // If focused on last item, focus first item
          if (!shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
          }

          // If focused on first item, focus last item with shift + tab
          else if (shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isLocked, focusableItems]);

  return (
    <div className={props.className || ""} style={props.style} ref={rootNode}>
      {props.children}
    </div>
  );
};
export default FocusLock;
