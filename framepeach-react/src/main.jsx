import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import App from './App';
import Template from './pages/Template/Template.jsx';
import AuthPages from './pages/Authententication/Register.jsx';
import Landing from './pages/Landing/Landing.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

//for electron
// import { HashRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
    <Routes>
     <Route path='/app' element={ <ProtectedRoute><App /></ProtectedRoute>}/> 
      <Route path='/template' element={<ProtectedRoute><Template /></ProtectedRoute>}/> 
      <Route path='/register' element={<AuthPages />}/> 
      <Route path='/' element={<Landing />}/> 
    </Routes>

    </BrowserRouter>

  </React.StrictMode>,
)
