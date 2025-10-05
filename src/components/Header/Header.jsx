import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <header>
      <div className="guap_logo">
        <img src="/guap-sign-2.svg" alt="SUAI LOGO" height="40" />
        <h3 className="logo">"КосмоИнформ-Центр"</h3>
        <button className="burger-btn" onClick={toggleNav} aria-label="Меню">
          <span className="burger-line top"></span>
          <span className="burger-line middle"></span>
          <span className="burger-line bottom"></span>
        </button>
      </div>
      <nav className={`nav_panel ${isNavActive ? 'active' : ''}`}>
        <a href="https://guap.ru/n/cosmoinform/compet" className="nav_link">Компетенции</a>
        <a href="https://guap.ru/n/cosmoinform" className="nav_link">О нас</a>
        <a href="login.html" className="nav_link">Войти</a>
      </nav>
    </header>
  );
};

export default Header;