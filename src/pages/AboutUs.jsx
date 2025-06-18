import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductDetails.css";

const AboutUs = () => {
  return (
    <div className="product-details">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Inicio</Link> &gt; <span>Nosotros</span>
      </div>

      {/* Título principal */}
      <div className="about-header">
        <h1 className="about-title">Sobre MultiShop</h1>
      </div>

      {/* Introducción */}
      <div className="about-intro">
        <p>
          Somos una plataforma de comercio electrónico diseñada para ayudar a
          emprendedores y pequeños negocios chilenos a digitalizar sus ventas de
          manera simple y efectiva.
        </p>
      </div>

      {/* Sección Misión */}
      <div className="product-main">
        <div className="product-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=center"
            alt="Nuestra Misión"
            className="product-image-main"
          />
        </div>

        <div className="product-info">
          <h2 className="about-section-title">Nuestra Misión</h2>

          <p className="about-text">
            Facilitamos la transformación digital de pequeños comercios y
            emprendedores, ofreciendo una plataforma intuitiva y personalizable
            que les permite crear su tienda online sin necesidad de
            conocimientos técnicos avanzados.
          </p>

          <p className="about-text">
            Creemos que cada negocio, sin importar su tamaño, merece tener una
            presencia digital profesional que le permita competir en el mercado
            actual y llegar a más clientes de manera efectiva.
          </p>
        </div>
      </div>

      {/* Sección Visión */}
      <div className="product-main about-reverse">
        <div className="product-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center"
            alt="Nuestra Visión"
            className="product-image-main"
          />
        </div>

        <div className="product-info">
          <h2 className="about-section-title">Nuestra Visión</h2>

          <p className="about-text">
            Ser la plataforma líder en Chile para la digitalización de pequeños
            negocios, contribuyendo al crecimiento del comercio electrónico
            nacional y al desarrollo económico de emprendedores locales.
          </p>

          <p className="about-text">
            Visualizamos un futuro donde cada emprendedor chileno tenga las
            herramientas necesarias para competir en el mercado digital, sin
            barreras tecnológicas ni económicas que limiten su potencial de
            crecimiento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
