import React from 'react';
import '../styles/footer.scss';

const Footer = () => {
  return (
    <footer id="footer" className="bg-dark text-light">
      <div className="footer-top " >
        <div className="container">
          <div className="row">

            <div className="col-lg-7 col-md-6 footer-contact">
              <h3>VR CELL</h3>
              <p>
                Avenida De La Cañada 19, 28823 Coslada, Madrid, Spain<br /><br />
                <strong>Teléfono:</strong> +34 601 35 22 16<br />
                <strong>Correo:</strong> 18vrcell@gmail.com<br />
              </p>
            </div>

            <div className="col-lg-4 col-md-6 footer-newsletter">
              <h4>Suscríbase a nuestro boletín</h4>
              <form action="" method="post">
                <input type="email" name="email" placeholder="Ingrese su correo" /><input type="submit" value="Suscribirse" />
              </form>
            </div>

          </div>
        </div>
      </div>

      <div className="container d-md-flex py-4">
        <div className="me-md-auto text-center text-md-start">
          <div className="copyright">
            &copy; Derechos de autor <strong><span>VR CELL</span></strong>. Todos los derechos reservados
          </div>
        </div>
        <div className="social-links text-center text-md-right pt-3 pt-md-0">
          <a href="/" className="facebook"><i className="bx bxl-facebook"></i></a>
          <a href="/" className="instagram"><i className="bx bxl-instagram"></i></a>
          <a href="https://wa.me/+34601352216" className="whatsapp" target="_blank" rel="noreferrer">
            <i className="bx bxl-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

