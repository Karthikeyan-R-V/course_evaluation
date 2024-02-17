// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Main from './Main';
import Admin from './Admin';
import Admin1 from './Admin1';
import Admin2 from './Admin2';

const App = () => {
  const [isAuth, setIsAuth] = useState(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuth')) || false;
    return isAuthenticated;
  });
  const [regNo,setRegNo] = useState("");
  const [dob,setDob] = useState("");
  const [stdName, setStdName] = useState("");
  console.log(isAuth);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/main" /> : <Auth regNo={regNo} setRegNo={setRegNo} dob={dob} setDob={setDob} isAuth={isAuth} setIsAuth={setIsAuth} stdName={stdName} setStdName={setStdName} />}
        />
        <Route
          path="/main"
          element={isAuth ? <Main regNo={regNo} setRegNo={setRegNo} dob={dob} setDob={setDob} isAuth={isAuth} setIsAuth={setIsAuth} stdName={stdName} setStdName={setStdName}/> : <Navigate to='/'/>}
        />
        <Route
          path='/admin'
          element={<Admin/>}
        />
        <Route
          path='/admin1'
          element={<Admin2/>}
        />
        <Route
          path='/admin2'
          element={<Admin1/>}
        />
      </Routes>
    </Router>
  );
};

export default App;
