import LocalStorage from './LocalStorage';
import api from '../services/api';

export default class ApiController {
  async getJwt() {
    this.jwt = await this.Storage.getJwt();
  }

  constructor() {
    this.Storage = new LocalStorage();
  }

  async getNewMatch() {
    await this.getJwt();
    const response = await api.get('/users', { headers: { Authorization: `Bearer ${this.jwt}` } });
    await this.Storage.setMatch(response.data[0]);
    this.match = await this.Storage.getMatch();
    return this.match;
  }

  async login() {
    this.email = await this.Storage.getEmail();
    this.password = await this.Storage.getPassword();

    if (this.email && this.password) {
      this.loginResponse = await api.post('/sessions', {
        email: this.email,
        password: this.password,
      });
    }

    return this.loginResponse.data;
  }

  async like(matchId) {
    await api.post(`/profile/likes/${matchId}`, {}, { headers: { Authorization: `Bearer ${this.jwt}` } });
  }

  async dislike(matchId) {
    await api.post(`/profile/deslikes/${matchId}`, {}, { headers: { Authorization: `Bearer ${this.jwt}` } });
  }
}
