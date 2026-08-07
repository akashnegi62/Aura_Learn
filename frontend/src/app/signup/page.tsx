"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: window.location.origin }
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  return (
    <div className="center-page animate-fade-in" style={{ padding: '40px' }}>
      <Card variant="neutral" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        <h1 className="text-heading-sm mb-20 text-center">Create an account</h1>
        {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <p className="text-body mb-20">Check your email for the confirmation link!</p>
            <Link href="/login">
              <Button variant="filled">Return to login</Button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-silver-gray)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-silver-gray)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <Button variant="filled" type="submit" isLoading={loading}>
                Sign up
              </Button>
            </form>
            
            <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--color-ash-gray)', fontSize: '14px' }}>
              — or —
            </div>
            
            <Button variant="ghost" onClick={handleGoogleSignup} style={{ width: '100%' }}>
              Continue with Google
            </Button>
            
            <p className="text-secondary mt-20 text-center">
              Already have an account? <Link href="/login" className="text-link">Sign in</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
