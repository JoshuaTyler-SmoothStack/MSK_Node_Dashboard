// Libraries
import React, { Component } from "react";
import {
  CompositeDecorator,
  ContentState,
  convertFromRaw,
  Editor,
  EditorState,
} from "draft-js";

// Decorators
import LinkDecorator from "./decorators/Link";
import LinkStrategy from "./decorators/LinkStrategy";

const ERROR_INVALID_CONTENT = String("[Error]: Unable to set content. Please refresh or try again later.");
const DEFAULT_DECORATORS = new CompositeDecorator([
  // Link Decorator
  {
    component: LinkDecorator,
    strategy: LinkStrategy,
  },
]);

class DraftJsReader extends Component {
  constructor(props) {
    super(props);
    // @props: className - String
    // @props: decorators - ObjectArray[{ component, strategy }]
    // @props: draftJsContent - String
    // @props: innerClassName - String
    // @props: innerStyle - Object {}
    // @props: placeholder - String

    this.editorRef = React.createRef();
    let editorState = EditorState.createWithContent(
      ContentState.createFromText(""),
      props.decorators || DEFAULT_DECORATORS,
    );

    if(props.draftJsContent) {

      // Formatted DraftJs Content
      if(props.draftJsContent.content) {
        editorState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.draftJsContent.content)),
          props.decorators || DEFAULT_DECORATORS,
        );
      }

      // PlainText in Object Content
      else if (props.draftJsContent.plainText) {
        editorState = EditorState.createWithContent(
          ContentState.createFromText(props.draftJsContent.plainText),
          props.decorators || DEFAULT_DECORATORS,
        );
      }

      // PlainText not in Object Content
      else if(typeof(props.draftJsContent) === "string" && props.draftJsContent.trim() !== "") {
        editorState = EditorState.createWithContent(
          ContentState.createFromText(props.draftJsContent),
          props.decorators || DEFAULT_DECORATORS,
        );
      }

      // Error Reading Content
      else {
        editorState = EditorState.createWithContent(
          ContentState.createFromText(ERROR_INVALID_CONTENT),
          props.decorators || DEFAULT_DECORATORS,
        );
      }
    }

    this.state = { editorState };
  }

  render() {
    const {
      className,
      innerClassName,
      innerStyle,
      placeholder,
      style,
    } = this.props;
    const { editorState } = this.state;
    return(
      <div
        className={className}
        style={style || { overflowY: "auto" }}
      >
        {/* Editor */}
        <div
          className={innerClassName || "bg-white h-100 p-1 rounded kit-border-shadow-sm"}
          style={{ ...innerStyle, overflowY: "auto" }}
          onClick={() => this.editorRef.current && this.editorRef.current.focus()}
        >
          <Editor
            editorState={editorState}
            placeholder={placeholder || ""}
            readOnly={true}
            ref={this.editorRef}
            onChange={() => {/* Do Nothing */}}
          />
        </div>
      </div>
    );
  }
}
export default DraftJsReader;
