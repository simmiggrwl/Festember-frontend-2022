import React from 'react';
import BackgroundAnimation from '../../components/background/BackgroundAnimation';
import NavBar from '../../components/navbar/NavBar';
import './Homepage.css';

const Homepage = () => (
  <>
    <BackgroundAnimation />
    <NavBar />
    <div className="title-box">
      <div className="title-prefix">Nit Trichy&apos;s</div>
      <div className="title">Festember</div>
      <div className="title-suffix">The Sunken Paradise</div>
      <button className="register-button" type="button">Register</button>
    </div>
  </>
);
export default Homepage;
