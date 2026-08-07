'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { api, apiFormData } from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import { ArrowUp } from 'lucide-react';
import './Upload.css';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating'>('idle');
  const [generateMode, setGenerateMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setAnonymousQuiz, setAnonymousFlashcards } = useUserStore();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit. Please choose a smaller file.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
      const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
        alert("Invalid file type. Please upload a PDF, DOCX, or TXT file.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    // Check anonymous limit
    if (!user) {
      const uploadCount = parseInt(localStorage.getItem('anonymousUploadCount') || '0', 10);
      if (uploadCount >= 1) {
        alert("You have reached your limit of 1 free upload. Please log in to process more documents.");
        router.push('/login');
        return;
      }
    }

    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await apiFormData.post('/upload', formData);
      setDocumentId(res.data.id);
      
      if (!user) {
        const uploadCount = parseInt(localStorage.getItem('anonymousUploadCount') || '0', 10);
        localStorage.setItem('anonymousUploadCount', (uploadCount + 1).toString());
      }
      
      setStatus('idle');
    } catch (err) {
      console.error("Upload failed", err);
      setStatus('idle');
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Upload failed. Please try again.';
      alert(errorMessage);
    }
  };



  const handleGenerate = async () => {
    if (!documentId) return;
    setStatus('generating');
    
    try {
      if (generateMode === 'flashcards') {
        const res = await api.post('/generate/flashcards', { document_id: documentId, num_cards: 10 });
        if (!user) setAnonymousFlashcards(res.data.flashcards);
        router.push('/flashcards');
      } else {
        const res = await api.post('/generate/quiz', { document_id: documentId, difficulty, num_questions: 10 });
        if (!user) setAnonymousQuiz(res.data);
        router.push('/quizzes');
      }
    } catch (err) {
      console.error("Generation failed", err);
      setStatus('idle');
      alert('AI Generation failed. Please try again.');
    }
  };

  if (status === 'generating') {
    return (
      <div className="upload-page center-all">
        <Loader text="Composing your study material..." />
      </div>
    );
  }

  return (
    <div className="upload-page animate-fade-in">
      <header className="page-header">
        <h1 className="text-heading-lg">Extract Knowledge</h1>
        <p className="text-body-lg text-secondary mt-12">
          Provide any PDF or DOCX file, and we will distill it into interactive material.
        </p>
      </header>

      <div className="upload-container">
        {!documentId ? (
          <div className="ai-composer">
            <div className="composer-input-area" onClick={() => fileInputRef.current?.click()}>
              <span className="composer-placeholder">
                {file ? file.name : "Select a document to process..."}
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.docx,.doc,.txt"
                hidden
              />
            </div>
            <div className="composer-actions">
              <Button 
                variant="filled"
                disabled={!file || status === 'uploading'}
                isLoading={status === 'uploading'}
                onClick={handleUpload}
                style={{ height: '40px', borderRadius: '50%', padding: '0', width: '40px', minWidth: '40px' }}
                aria-label="Upload Document"
              >
                {status === 'uploading' ? <ArrowUp size={20} /> : <ArrowUp size={20} />}
              </Button>
            </div>
          </div>
        ) : (
          <Card variant="neutral" className="generate-card animate-fade-in">
            <span className="tag">Document Ready</span>
            <h3 className="text-heading-sm mt-12">Choose your output format</h3>
            
            <div className="mode-selector">
              <button 
                className={`mode-btn ${generateMode === 'flashcards' ? 'active' : ''}`}
                onClick={() => setGenerateMode('flashcards')}
              >
                Flashcards
              </button>
              <button 
                className={`mode-btn ${generateMode === 'quiz' ? 'active' : ''}`}
                onClick={() => setGenerateMode('quiz')}
              >
                Multiple Choice
              </button>
            </div>
            
            {generateMode === 'quiz' && (
              <div className="difficulty-selector" style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: `1px solid ${difficulty === level ? 'var(--color-ink-black)' : 'var(--color-silver-gray)'}`,
                      backgroundColor: difficulty === level ? 'var(--color-ink-black)' : 'transparent',
                      color: difficulty === level ? 'var(--color-paper-white)' : 'var(--color-ash-gray)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
            
            <Button 
              variant="filled" 
              onClick={handleGenerate}
            >
              Generate
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
