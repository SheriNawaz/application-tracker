import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Tracker from './components/Tracker';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>    
        <Route path="/register" element={<SignUp />}/>    
        <Route path="/login" element={<SignIn />}/>    
        <Route path="/tracker" element={<Tracker />}/>    
      </Routes>
    </BrowserRouter>
  )
}

export default App
