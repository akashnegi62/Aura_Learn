"use client";

import React from 'react';
import Link from 'next/link';
import Button from './Button';
import { useUserStore } from '@/store/useUserStore';
import './Navigation.css';

export default function Navigation() {
  const { user, isLoading, signOut } = useUserStore();

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
        {isLoading ? null : user ? (
          <div className="user-avatar-container">
            <div className="user-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-email">{user.email}</div>
              <button className="dropdown-item" onClick={() => signOut()}>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="text-link" style={{ padding: '0 20px' }}>
              Sign in
            </Link>
            <Link href="/signup">
              <Button variant="filled">Get started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
