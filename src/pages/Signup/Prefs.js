import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, Text, StyleSheet, BackHandler, AsyncStorage, Alert,
} from 'react-native';
import Logo from '../../assets/logo.svg';
import globalStyles from '../../styles/entryStyle';
import Select from '../../components/Select';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import api from '../../services/api';

const Prefs = ({ navigation }) => {
  const { navigate } = navigation;

  const user = navigation.getParam('user');

  const [school, setSchool] = useState(user.prefs.school);
  const [schools, setSchools] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const [course, setCourse] = useState(user.prefs.course);
  const [courses, setCourses] = useState([]);
  const [enabled, setEnabled] = useState(!!user.prefs.course);

  const [grade, setGrade] = useState(user.prefs.grade);
  const grades = [
    { label: '1º Ano', value: '1' },
    { label: '2º Ano', value: '2' },
    { label: '3º Ano', value: '3' },
  ];

  const [gender, setGender] = useState(user.prefs.gender);
  const genders = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
  ];

  const styles = StyleSheet.create({
    text: {
      color: '#a0a0a0',
      fontSize: 12,
      marginTop: 12,
      paddingHorizontal: 32,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    async function getSchools() {
      const res = await api.get('/schools');

      setSchools(res.data.map((item) => ({
        label: item.local.toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
        // eslint-disable-next-line no-underscore-dangle
        value: item._id,
        courses: item.cursos,
      })));

      setIsReady(true);

      if (course) {
        const newSchool = school;
        setSchool('');
        setSchool(newSchool);
      }
    }

    getSchools();
  }, []);

  useEffect(() => {
    function getCourses() {
      if (!school) return setEnabled(false);

      schools.forEach((value) => {
        if (value.value === school) {
          setCourses(value.courses.map((item) => ({
            label: item.toLowerCase()
              .split(' ')
              .map((word) => {
                if (word.length <= 4) return word;
                return word.charAt(0).toUpperCase() + word.substring(1);
              })
              .join(' '),
            value: item,
          })));
        }
      });

      return setEnabled(true);
    }

    getCourses();
  }, [school]);

  const handleBackNavigation = () => navigate('Contacts', { user });

  BackHandler.addEventListener('hardwareBackPress', () => {
    handleBackNavigation();
    return true;
  });

  const handleNavigation = async () => {
    let response;

    if (school) {
      user.prefs.school = school;
    } else user.prefs.school = undefined;
    if (gender) {
      user.prefs.gender = gender;
    } else user.prefs.gender = undefined;
    if (course) {
      user.prefs.course = course;
    } else user.prefs.course = undefined;
    if (grade) {
      user.prefs.grade = grade;
    } else user.prefs.grade = undefined;

    try {
      response = await api.post('/profile', user.getUser());
    } catch (error) {
      return Alert.alert('Erro!', `Status: ${error.response.status}\n\n${error.response.data.error}`);
    }

    try {
      response = await api.post('/sessions', {
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      return Alert.alert('Erro!', `Status: ${error.response.status}\n\n
      ${error.response.data.error}`);
    }

    try {
      await AsyncStorage.setItem('email', user.email);
      await AsyncStorage.setItem('password', user.password);
      await AsyncStorage.setItem('jwt', response.data.jwt);
      await AsyncStorage.setItem('userId', response.data.user.id);
    } catch (error) {
      return Alert.alert('Falha', 'Erro ao salvar dados no dispositivo');
    }


    return navigate('Home');
  };

  return isReady ? (
    <KeyboardAvoidingView
      behavior="padding"
      style={globalStyles.container}
    >
      <Logo style={globalStyles.logo} />

      <Text style={[globalStyles.title, { marginBottom: 0 }]}>Preferências</Text>

      <BackButton onPressed={handleBackNavigation} />

      <Text style={styles.text}>Todos os valores são opcionais</Text>

      <Select
        items={genders}
        placeHolder="Escolha o gênero"
        setState={setGender}
        state={gender}
      />

      <Select
        items={schools}
        placeHolder="Escolha a escola"
        setState={setSchool}
        state={school}
      />

      <Select
        items={courses}
        placeHolder="Escolha o curso"
        setState={setCourse}
        state={course}
        enabled={enabled}
      />
      <Select
        items={grades}
        placeHolder="Escolha o ano"
        setState={setGrade}
        state={grade}
      />

      <Button text="Cadastrar!" onPressed={handleNavigation} />

    </KeyboardAvoidingView>
  ) : null;
};

export default Prefs;
