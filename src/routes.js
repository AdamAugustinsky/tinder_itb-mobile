import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ProfileConfigs from './pages/ProfileConfigs';

export default createAppContainer(
  createSwitchNavigator({
    Login,
    Cadastro,
    Home,
    Messages,
    Profile,
    ProfileConfigs,
  }),
);
