import React from 'react';
import './NavBar.css';
import FestemberLogo from '../../assets/images/logo.png';
import ChevronRight from '../../assets/images/chevron-right.png';
import CloseIcon from '../../assets/images/close.png';
import MobileMenuIcon from '../../assets/images/menu.png';

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
  const isMobileDevice = window.matchMedia('(max-width: 640px)').matches;

  const toggleNavBar = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeOverlay = () => {
    setIsNavOpen(false);
  };

  return (
    <div id='nav-bar'>
      {isNavOpen && <div id='menu-overlay' role='presentation' onClick={closeOverlay} />}
      <div className='logo-div'>
        {isMobileDevice && (
          <img
            src={MobileMenuIcon}
            alt='menu'
            id='mobile-menu-logo'
            onClick={toggleNavBar}
          />
        )}
        <img src={FestemberLogo} alt='logo' id='nav-logo' />
        {!isNavOpen && !isMobileDevice && (
          <img
            src={ChevronRight}
            alt='chev-right'
            id='chevron-right'
            onClick={toggleNavBar}
          />
        )}
      </div>
      <div className='nav-links'>
        {/* eslint-disable-next-line */}
        {isNavOpen &&
          navLinksData.map((link) => (
            <div className='nav-link-item'>{link}</div>
          ))}
        {isNavOpen && (
          <img
            src={CloseIcon}
            alt='close'
            id='close-nav'
            onClick={toggleNavBar}
          />
        )}
      </div>
      <button className='login-button' type='button'>
        Login
      </button>
    </div>
  );
};
export default NavBar;
