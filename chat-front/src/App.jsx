import React from 'react';
import { Routes, Route } from 'react-router-dom';

// components
import ProtectedRoute from './components/ProtectedRoute';

// layout components
import Layout from './Layout';
import LeftSideSettings from './layoutComponents/LeftSideSettings';
import LeftSideChats from './layoutComponents/LeftSideChats';
import LeftSideGroup from './layoutComponents/LeftSideGroup';

// pages
import SignUpLoginPage from './pages/SignUpLoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const App = () => {
  // settings dark mode if user hve selected dark mode on computer
  window.matchMedia &&
    window.matchMedia(`(prefers-color-scheme: dark)`).matches &&
    document.documentElement.classList.add('dark');

  return (
    <>
      <Routes>
        <Route path='/' element={<SignUpLoginPage />} />
        <Route path='/signUp' element={<SignUpLoginPage />} />
        <Route path='/forgotPassword' element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/chats' element={<LeftSideChats />} />
            <Route path='/groups' element={<LeftSideGroup />} />
            <Route path='/settings' element={<LeftSideSettings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
