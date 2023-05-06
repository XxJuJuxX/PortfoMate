
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AppTitle from './components/AppTitle';
import NavButtons from './components/NavButtons';
import Home from './Pages/HomePage';
import NewsPage from './Pages/NewsPage';
import Footer from './components/Footer';

function App() {
  return (
    <React.Fragment>
      <AppTitle />
      <NavButtons />
      <Router>
         <Routes>
          <Route path ="/" element={<Home />} />
          <Route path ="/news" element={<NewsPage />}/>
         </Routes>
      </Router>
      <Footer />
    </React.Fragment>
  );
}

export default App;
