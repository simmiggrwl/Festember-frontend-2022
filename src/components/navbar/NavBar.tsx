import React from 'react';
import './NavBar.css';
import FestemberLogo from '../../assets/images/logo.png';

const NavBar = () => {
  const navLinksData = [
    'Events',
    'Sponsors',
    'Hospitality',
    'Blog',
    'Guest Lectures',
    'Proshows',
    'Informals',
    'Workshops'
  ];
  const [isNavOpen, setIsNavOpen] = React.useState<boolean>(false);
  const toggleNavBar = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <div id='nav-bar'>
      <div className='logo-div'>
        {/* eslint-disable-next-line */}
        <img
          src={FestemberLogo}
          alt='logo'
          id='nav-logo'
          onClick={toggleNavBar}
        />
      </div>
      <div className='nav-links'>
        {/* eslint-disable-next-line */}
        {isNavOpen &&
          navLinksData.map((link) => (
            <div className='nav-link-item'>{link}</div>
          ))}
      </div>
      <button className='login-button' type='button'>
        Login
      </button>
    </div>
  );
};
export default NavBar;
