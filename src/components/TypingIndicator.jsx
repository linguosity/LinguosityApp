import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "./settings";

export const TypingIndicator = ({ isTyping, content, ...rest }) => {
    const cName = `${prefix}-typing-indicator`;
  
    return (
      <div {...rest} className={classNames(cName, isTyping ? 'loader' : '')}>
        {isTyping && content}
      </div>
    );
};


TypingIndicator.propTypes = {
  /** Indicator content. */
  content: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Typing state */
  isTyping: PropTypes.bool,
};

TypingIndicator.defaultProps = {
  content: "",
  isTyping: false,
};

export default TypingIndicator;
