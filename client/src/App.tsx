import React, { useEffect } from 'react';
import Header from './header';
import { BrowserRouter, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import router from './router';
import CustomRoutes from './router';
import FormComponent from './forms/form-component';
import { useState } from 'react';
import formStore from './forms/form-store';
import { observer } from 'mobx-react';

function App() {
  const {form} = formStore;

  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>
          {CustomRoutes.map(route => route)}
        </Routes>
        {form && <div>{form}</div>}
      </BrowserRouter>
    </div>
  );
}

export default observer(App);
