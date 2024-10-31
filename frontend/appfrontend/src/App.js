import './App.css';
import Home from './Components/Home';
import About from './Components/About';
import Navbar from './Components/Navbar';
import Pages from './Components/Pages';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
function App() {
  return (
    
    <div className="App">
      <Router>
      <Navbar/>
      <Pages/>
      
      </Router>
    </div>
  );
}

export default App;
