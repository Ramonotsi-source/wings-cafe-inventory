import React from 'react';
import './Sidebar.css';

export default function Sidebar({ setView }) {
  return (
    <nav className="sidebar">
      <h2>Wings Café</h2>
      <ul>
        <li onClick={() => setView('about')}>About Us</li>
        <li onClick={() => setView('contact')}>Contact Us</li>
      </ul>
    </nav>
);
}