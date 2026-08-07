'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/store/useUserStore';
import './Flashcards.css';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  topic?: string;
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { user, anonymousFlashcards } = useUserStore();

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        setCards((anonymousFlashcards as unknown as Flashcard[]) || []);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/flashcards');
        setCards(res.data.flashcards || []);
      } catch (err) {
        console.error("Failed to fetch flashcards", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [user, anonymousFlashcards]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  if (loading) return <div className="center-page"><Loader text="Loading your deck..." /></div>;

  if (cards.length === 0) {
    return (
      <div className="center-page text-center animate-fade-in">
        <h2 className="text-heading-lg">Empty Deck</h2>
        <p className="text-body-lg text-secondary mt-12 mb-20">Upload a document to generate your first deck.</p>
        <Button onClick={() => window.location.href = '/upload'}>Start Composing</Button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flashcards-page animate-fade-in">
      <header className="page-header text-center">
        <h1 className="text-heading-lg">Flashcards</h1>
        <p className="text-secondary mt-12">{cards.length} cards remaining</p>
      </header>

      <div className="deck-container">
        
        <div 
          className={`flashcard-3d-wrapper ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-inner">
            {/* Front of Card */}
            <div className="flashcard-face flashcard-front">
              <span className="tag">{currentCard.topic || 'General'}</span>
              <div className="card-content">
                <h2 className="text-heading-sm">{currentCard.question}</h2>
              </div>
              <p className="hint-text text-secondary">Click to flip</p>
            </div>

            {/* Back of Card */}
            <div className="flashcard-face flashcard-back">
              <div className="card-content">
                <h2 className="text-heading-sm">{currentCard.answer}</h2>
                {currentCard.explanation && (
                  <p className="explanation text-body">{currentCard.explanation}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="deck-controls">
          <Button variant="ghost" onClick={handlePrev}>Previous</Button>
          <div className="progress-text">{currentIndex + 1} of {cards.length}</div>
          <Button variant="filled" onClick={handleNext}>Next Card</Button>
        </div>
      </div>
    </div>
  );
}
