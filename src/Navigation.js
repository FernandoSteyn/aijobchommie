import React from 'react';

const Navigation = () => {
  return (
    <nav role="navigation" aria-label="main navigation">
      <ul>
        <li><a href="#" data-testid="nav-dashboard">Dashboard</a></li>
        <li><a href="#" data-testid="logout-button" onClick={() => {}}>Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
