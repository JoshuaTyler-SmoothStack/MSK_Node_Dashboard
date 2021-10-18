// Libraries
import DraftjsConstants from "../DraftjsConstants.json";

const LinkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        DraftjsConstants.decorators.link.component
    );
  }, callback);
};
export default LinkStrategy;
