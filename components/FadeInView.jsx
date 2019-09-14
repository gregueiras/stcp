import React from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'
import stylePropType from 'react-style-proptype'

export default class FadeInView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
    }
  }

  componentDidMount() {
    const { fadeAnim } = this.state
    const { duration } = this.props
    Animated.sequence([
      Animated.timing(
        // Animate over time
        fadeAnim, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: duration / 4, // Make it take a while
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        // Animate over time
        fadeAnim, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: duration / 2, // Make it take a while
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        // Animate over time
        fadeAnim, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: duration / 4, // Make it take a while
          useNativeDriver: true,
        },
      ),
    ]).start() // Starts the animation
  }

  render() {
    const { fadeAnim } = this.state
    const { style, children } = this.props

    return (
      <Animated.View // Special animatable View
        style={{
          ...style,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
      >
        {children}
      </Animated.View>
    )
  }
}

FadeInView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any, // PropTypes.oneOf([PropTypes.element, PropTypes.arrayOf(PropTypes.node)]) doesn't work :(
  duration: PropTypes.number,
  style: stylePropType.isRequired,
}

FadeInView.defaultProps = {
  children: [],
  duration: 1000,
}
