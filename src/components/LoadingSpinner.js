import React from "react";

const CLASSNAME_DEFAUT = "spinner-border kit-border-shadow";
const MARGIN_DEFAULT = "m-auto";
const TEXT_DEFAULT = "text-light";

const LoadingSpinner = (props) => {
  const propsOverride = { ...props };
  // @props: margin - String
  // @props: text - String

  propsOverride.className = props.className || CLASSNAME_DEFAUT;
  propsOverride.className = `${propsOverride.className} ${props.margin || MARGIN_DEFAULT} ${props.text || TEXT_DEFAULT}`;
  return (<div {...propsOverride}/>);
};
export default LoadingSpinner;
