import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';
import Router from './components/Router';
import LoadingModal from './components/shared/LoadingModal';
import './styles/walletSelectModal.css';
import ErrorToast from './components/shared/ErrorToast';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <LoadingModal />
      <ErrorToast />
      <Router />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
