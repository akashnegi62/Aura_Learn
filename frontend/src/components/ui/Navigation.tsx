import React from 'react';
import Link from 'next/link';
import Button from './Button';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <Link href="/" className="brand-link">
          AuraLearn
        </Link>
      </div>
      
      <div className="nav-links">
        <Link href="/upload" className="nav-link">Upload</Link>
        <Link href="/flashcards" className="nav-link">Decks</Link>
        <Link href="/quizzes" className="nav-link">Quizzes</Link>
      </div>
      
      <div className="nav-actions">
        <Link href="/login" className="text-link" style={{ padding: '0 20px' }}>
          Sign in
        </Link>
        <Link href="/upload">
          <Button variant="filled">Get started</Button>
        </Link>
      </div>
    </nav>
  );
}
