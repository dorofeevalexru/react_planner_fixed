import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-nav">
          <a href="https://guap.ru/n/cosmoinform/compet" className="footer-nav-link">Компетенции</a>
          <a href="https://guap.ru/n/cosmoinform" className="footer-nav-link">О нас</a>
          <a href="login.html" className="footer-nav-link">Войти</a>
        </div>
        <div className="footer-logo">
          <img src="s_guap_w.svg" alt="Логотип ГУАП" width="120" />
          <div className="copyright">© 2025 Все права защищены</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;