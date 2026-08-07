"""Add user_id to tables

Revision ID: 2f777246e385
Revises: 1f777246e384
Create Date: 2026-08-07 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '2f777246e385'
down_revision = '1f777246e384'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # documents
    op.add_column('documents', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index(op.f('ix_documents_user_id'), 'documents', ['user_id'], unique=False)
    
    # quizzes
    op.add_column('quizzes', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index(op.f('ix_quizzes_user_id'), 'quizzes', ['user_id'], unique=False)
    
    # flashcards
    op.add_column('flashcards', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index(op.f('ix_flashcards_user_id'), 'flashcards', ['user_id'], unique=False)
    
    # quiz_attempts
    op.add_column('quiz_attempts', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index(op.f('ix_quiz_attempts_user_id'), 'quiz_attempts', ['user_id'], unique=False)
    
    # study_history
    op.add_column('study_history', sa.Column('user_id', sa.String(length=36), nullable=True))
    op.create_index(op.f('ix_study_history_user_id'), 'study_history', ['user_id'], unique=False)

def downgrade() -> None:
    # documents
    op.drop_index(op.f('ix_documents_user_id'), table_name='documents')
    op.drop_column('documents', 'user_id')
    
    # quizzes
    op.drop_index(op.f('ix_quizzes_user_id'), table_name='quizzes')
    op.drop_column('quizzes', 'user_id')
    
    # flashcards
    op.drop_index(op.f('ix_flashcards_user_id'), table_name='flashcards')
    op.drop_column('flashcards', 'user_id')
    
    # quiz_attempts
    op.drop_index(op.f('ix_quiz_attempts_user_id'), table_name='quiz_attempts')
    op.drop_column('quiz_attempts', 'user_id')
    
    # study_history
    op.drop_index(op.f('ix_study_history_user_id'), table_name='study_history')
    op.drop_column('study_history', 'user_id')
