import React from 'react';
import MenuCard from '../components/MenuCard';
import { TabsContainer, Container } from '../constants/Styles';

export default function HomeScreen() {
  return (
    <Container>
      <TabsContainer>
        <MenuCard text="ola" />
        <MenuCard text="olA" />
        <MenuCard text="adeus" />
      </TabsContainer>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  title: 'Ementa FEUP',
};
