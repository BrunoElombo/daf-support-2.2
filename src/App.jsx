import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AUTHCONTEXT } from './context/AuthProvider';
// import bgImg from './assets/images/login-bg.jpg';
import './index.css'
import Login from './pages/Login/Login';
import Entity from './pages/Entities/Entity';
import Dashboard from './pages/Dashboard/Dashboard';
import RecettePage from './pages/Recette/RecettePage';
import ExpensePage from './pages/Expense/ExpensePage';
import ReportingPage from './pages/Reporting/ReportingPage';
import SettingsPage from './pages/Settings/SettingsPage';
import Caisse from './pages/Caisse/Caisse';

function App() {

  const { isLoggedIn, setIsLoggedIn } = useContext(AUTHCONTEXT);

  const checkAndHandleToken = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {

      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        console.log(decodedToken);
        const expirationTime = new Date(decodedToken.exp * 1000);
        const isExpired = expirationTime.getTime() - Date.now() < REFRESH_THRESHOLD;

        if (isExpired || !decodedToken) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(true);
    }
  };


  useEffect(()=>{
    const storedToken = localStorage.getItem('token');
    if(storedToken === null){
      setIsLoggedIn(false);
    }
    

  }, []);

  return (
    <Router>
      {
        // true ? 
        isLoggedIn ? 
        (
          <Routes>
            <Route path={'*'} element={<Dashboard />} />
            <Route path={'/dashboard'} element={<Dashboard />} />
            <Route path={'/recette'} element={<RecettePage />} />
            <Route path={'/expense'} element={<ExpensePage />} />
            <Route path={'/caisse'} element={<Caisse />} />
            <Route path={'/reporting'} element={<ReportingPage />} />
            <Route path={'/settings'} element={<SettingsPage />} />
          </Routes>
        )
        :
        (
          <Routes>
            <Route path={'/entities'} element={<Entity />} />
            <Route path={'*'} element={<Login />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/forgot-password'} element={<Login />} />
          </Routes>
        )
      }
      </Router>
  )
}

export default App
