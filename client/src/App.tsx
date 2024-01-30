import React, { useEffect } from 'react';
import Header from './header';
import { BrowserRouter, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import router from './router';
import CustomRoutes from './router';
import FormComponent from './forms/form-component';
import { useState } from 'react';
import formStore from './forms/form-store';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import FormCloserProvider from './forms/form-closer-provider';

function App() {
  const {form} = formStore;

  return (
    <div>
      <BrowserRouter>
        <FormCloserProvider>
          <Header/>
          <Routes>
            {CustomRoutes.map(route => route)}
          </Routes>
          {form && <div>{form}</div>}
        </FormCloserProvider>
      </BrowserRouter>
    </div>
  );
}

export default observer(App);
