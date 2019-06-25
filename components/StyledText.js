import React from 'react';
import {
  Text,
} from 'react-native';


function StyledText({ style, ...props }) {
  return (
    <Text {...props} style={[{ ...style, fontFamily: 'space-mono' }]} />
  );
}

StyledText.propTypes = {
  style: Text.propTypes.style,
};

StyledText.defaultProps = {
  style: {},
};

export default StyledText;
