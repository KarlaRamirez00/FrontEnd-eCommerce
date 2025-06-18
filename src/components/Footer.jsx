import React from "react";
import "../styles/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Contacto */}
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} /> 800 0707 0065
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faWhatsapp} /> +56 9 9999 9999
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} /> info@multishop.cl
            </div>
          </div>

          {/* Enlaces */}
          <div className="footer-links">
            <a href="/about" className="footer-link">
              Sobre Nosotros
            </a>
            <a href="/faq" className="footer-link">
              Preguntas Frecuentes
            </a>
            <a href="/faq" className="footer-link">
              Términos y Condiciones
            </a>
          </div>

          {/* Redes Sociales */}
          <div className="social-icons d-flex">
            <a href="https://facebook.com" className="footer-icon-link mx-2">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" className="footer-icon-link mx-2">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" className="footer-icon-link mx-2">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
