// Libraries
import DraftjsConstants from "../DraftjsConstants.json";

const decorator = DraftjsConstants.decorators.link;
const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData() || "";
  return (
    <a
      href={url}
      className={decorator.class}
      style={decorator.style}
      onClick={() => window.open(url)}
    >
      {props.children}
    </a>
  );
};
export default Link;
