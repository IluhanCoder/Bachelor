import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';

export default new class ErrorStore {
  errors: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  pushError(error: string) {
    this.errors = [...this.errors, error];
  }

  dropErrors() {
    this.errors = [];
  }
}