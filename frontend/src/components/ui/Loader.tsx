import React from 'react';
import './Loader.css';

export default function Loader({ text = 'Generating...' }: { text?: string }) {
  return (
    <div className="loader-container">
      <div className="loader-circle"></div>
      <p className="loader-text text-secondary">{text}</p>
    </div>
  );
}
