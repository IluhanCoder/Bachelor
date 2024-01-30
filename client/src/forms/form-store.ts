import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';

export default new class FormStore {
  form: null | ReactNode = null;

  constructor() {
    makeAutoObservable(this);
  }

  setForm(newForm: ReactNode) {
    this.form = newForm;
  }

  dropForm() {
    this.form = null;
  }
}