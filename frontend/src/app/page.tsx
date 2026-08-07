'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { Lock as LockIcon } from 'lucide-react';
import './Dashboard.css';

export default function Home() {
  const { user } = useUserStore();
  const [stats, setStats] = useState({ total_flashcards: 0, total_quizzes: 0, total_documents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="text-display hero-title">
            Intelligence,<br/>
            <em>distilled.</em>
          </h1>
          <p className="hero-subtitle text-body-lg text-secondary">
            Transform your documents into interactive study materials in seconds. 
            Powered by advanced generative models.
          </p>
          <div className="hero-actions">
            <Link href="/upload" passHref>
              <Button variant="filled">Upload Document</Button>
            </Link>
            <Link href="/flashcards" passHref>
              <Button variant="ghost">Review Decks</Button>
            </Link>
          </div>
        </div>

        {/* Floating Product Artifacts */}
        <div className="hero-artifacts">
          <Card variant="floating" className="artifact-stat top-left">
            <span className="artifact-label">Flashcards Generated</span>
            <div className="artifact-value">
              {loading ? '—' : (!user ? <><LockIcon size={16} className="inline-icon" /> 0</> : stats.total_flashcards)}
            </div>
            <div className="artifact-delta">{!user ? 'Locked for anonymous users' : '↑ 12% vs last week'}</div>
          </Card>
          
          <Card variant="floating" className="artifact-stat bottom-right">
            <span className="artifact-label">Active Quizzes</span>
            <div className="artifact-value">
              {loading ? '—' : (!user ? <><LockIcon size={16} className="inline-icon" /> 0</> : stats.total_quizzes)}
            </div>
            <div className="artifact-delta text-secondary">{!user ? 'Locked for anonymous users' : 'Ready to take'}</div>
          </Card>
        </div>
      </section>

      {/* Feature / Stats Section with Mist Background */}
      <section className="features-section">
        <h2 className="text-heading-lg section-title">Your knowledge base</h2>
        
        <div className="features-grid">
          <Card variant="neutral">
            <span className="tag">Documents</span>
            <h3 className="text-heading-sm">Upload History</h3>
            <p className="text-secondary mt-12">
              You have processed {loading ? '...' : stats.total_documents} documents so far.
            </p>
            <Link href="/upload" className="text-link mt-20">
              Upload another
            </Link>
          </Card>

          <Card variant="accent">
            <h3 className="text-heading-sm mb-12">Editorial Highlight</h3>
            <p className="text-body mt-12 mb-20" style={{lineHeight: 1.5}}>
              &quot;The ability to instantly extract testable material from raw text changes the way we approach learning entirely.&quot;
            </p>
            <span className="text-caption">— The Development Team</span>
          </Card>
        </div>
      </section>

    </div>
  );
}
