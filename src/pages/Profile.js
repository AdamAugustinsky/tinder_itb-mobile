/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Header from '../components/MainHeader';
import MatchImage from '../components/MatchImage';
import Button from '../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    alignItems: 'center',
  },
});

const Profile = ({ navigation }) => {
  const { navigate } = navigation;
  const jwt = navigation.getParam('jwt');
  const myId = navigation.getParam('myId');

  return (
    <>
      <Header navigate={navigate} profile jwt={jwt} myId={myId} />
      <View style={styles.container}>
        <MatchImage match={{}} />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => navigate('ProfileConfigs')}>
          <Button text="Meu Perfil" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('Login')}>
          <Button text="Sair" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Profile;
