import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextInput, View, Modal, Text, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function MyModal({ toggleModal, onSubmit, modalShowing, getOldFavName }) {
  const [modalStop, setModalStop] = useState('')
  const placeholder = getOldFavName() ? getOldFavName() : 'Favorite Name'

  return (
    <Modal animationType="slide" transparent visible={modalShowing}>
      <View
        style={{
          backgroundColor: 'rgba(20,20,20,0.9)',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          paddingTop: Dimensions.get('window').height / 4,
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'auto',
            backgroundColor: '#fff',
            height: '20%',
            borderRadius: 4,
          }}
        >
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: '#000',
                borderBottomWidth: 2,
                paddingRight: 5,
                paddingLeft: 5,
                paddingTop: 0,
                marginTop: 0,
                backgroundColor: '#ddd',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <Text style={{ paddingTop: 13, fontWeight: 'bold' }}>Insert Favorite Name</Text>
              <TouchableOpacity
                onPress={() => {
                  toggleModal()
                  setModalStop('')
                }}
              >
                <Ionicons name="ios-remove-circle-outline" size={40} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 5,
                paddingLeft: 5,
                marginBottom: -5,
                paddingTop: 5,
              }}
            >
              <TextInput
                style={{ width: '65%', fontSize: 20 }}
                editable
                maxLength={20}
                onChangeText={text => setModalStop(text)}
                onSubmitEditing={() => {
                  toggleModal()
                  setModalStop('')
                  onSubmit(modalStop)
                }}
                value={modalStop}
                placeholder={placeholder}
                autoFocus
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                onPress={() => {
                  toggleModal()
                  setModalStop('')
                  onSubmit(modalStop)
                }}
              >
                <Ionicons name="ios-add" size={40} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

MyModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  getOldFavName: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modalShowing: PropTypes.bool.isRequired,
}
