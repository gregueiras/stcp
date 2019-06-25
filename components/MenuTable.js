import React from 'react';
import { Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { PropTypes } from 'prop-types';
import styles from '../constants/Styles';


function MenuTable() {
  return (
    <Grid style={styles.center}>
      <Row>
        <Text>
          AAS
        </Text>
      </Row>
      <Row>
        <Text>
          AAS
        </Text>
      </Row>
      <Row>
        <Text>
          AAS
        </Text>
      </Row>
      <Row>
        <Text>
          AB
        </Text>
      </Row>
    </Grid>
  );
}

export default MenuTable;
