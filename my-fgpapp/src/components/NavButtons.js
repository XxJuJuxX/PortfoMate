import React from 'react';
import '../css/NavButtons.css';
import ConnectToMetaMask from './ConnectToMetaMask';
import { NavLink } from 'react-router-dom';



function NavButtons() {

  return (
    <nav>
      <ul>
        <li><NavLink exact to= "/">Home</NavLink></li>
        <li><ConnectToMetaMask /></li>
        <li><NavLink to="/news" activeClassName="active">News</NavLink></li>
      </ul>
    </nav>
  );
}

export default NavButtons;
