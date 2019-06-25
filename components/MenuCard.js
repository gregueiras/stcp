import React, { Component } from 'react';
import { Text } from 'react-native';
import { TabItem, LineInfo, TabHeader, Line, Destination, Time } from '../constants/Styles';
import { ScrollView } from 'react-native-gesture-handler';

export default class MenuCard extends Component {

  state = {
    title: 'FEUP',
    list: undefined,
  }
  
  async loadMenu() {
    try {
      
      const searchUrl = 'http://www.move-me.mobi/NextArrivals/GetScheds?providerName=STCP&stopCode=STCP_FEUP2';
      const response = await global.fetch(searchUrl); // fetch page
      const text = await response.text(); // get response text    
      const json = JSON.parse(text); // get response text    
      
      const info = json.map(({ Value }) => Value);
    
      this.setState({ list: info});
    } catch (error) {
      console.log("ERRO");
      console.log(error);
      this.setState({ list: 'error'});
    }
  }

  componentDidMount() {
    this.loadMenu();
  } 

  render() {
    return (
      <TabItem>
        <TabHeader>
          {this.state.title}
        </TabHeader>
        <ScrollView>          
          {this.state.list !== undefined && this.state.list.map(([ line, destination, time ]) =>
            (
              <LineInfo key={line + time}>
                <Line>
                  {line}
                </Line>
                <Destination>
                  {destination}
                </Destination>
                <Time>
                  {time}
                </Time>
              </LineInfo>
            )
          )
          }
        
        </ScrollView>
      </TabItem>
    );
  }

}