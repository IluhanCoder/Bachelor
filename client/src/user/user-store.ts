import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';
import User from './user-types';

export default new class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(newUser: User) {
    this.user = newUser;
  }

  dropUser() {
    this.user = null;
  }
}