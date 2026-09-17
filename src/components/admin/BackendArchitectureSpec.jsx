import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Cpu, 
  Layers, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal,
  BookOpen
} from 'lucide-react';

export default function BackendArchitectureSpec() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const djangoModelsCode = `# models.py - Django DRF Competitive Exam Architecture
from django.db import models
from django.contrib.auth.models import AbstractUser

class AspirantUser(AbstractUser):
    target_exam_id = models.CharField(max_length=50, default='ssc-cgl')
    target_exam_name = models.CharField(max_length=100, default='SSC CGL 2026')
    streak_days = models.IntegerField(default=14)
    attempted_question_hashes = models.JSONField(default=list, help_text="Anti-repetition hash ledger")

class ExamCategory(models.Model):
    name = models.CharField(max_length=100) # e.g. Staff Selection Commission
    code = models.CharField(max_length=20, unique=True) # ssc, banking, upsc, railways

class Question(models.Model):
    DIFFICULTY_CHOICES = [('Easy', 'Easy'), ('Moderate', 'Moderate'), ('Hard', 'Hard')]
    
    section_id = models.CharField(max_length=50) # quant, reasoning, english, ga
    question_text = models.TextField()
    options = models.JSONField(help_text="Format: [{'id': 'A', 'text': 'Val'}]")
    correct_option_id = models.CharField(max_length=2) # 'A', 'B', 'C', 'D'
    explanation = models.TextField()
    topic_tag = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    question_hash = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TestAttemptSession(models.Model):
    user = models.ForeignKey(AspirantUser, on_delete=models.CASCADE)
    exam_title = models.CharField(max_length=200)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField(default=0.0)
    accuracy_percent = models.FloatField(default=0.0)
    percentile_rank = models.FloatField(default=0.0)
    question_palette_state = models.JSONField(default=dict) # NTA 5-state grid mapping
`;

  const groqGuardrailCode = `# groq_pipeline.py - Groq LLM API Guardrail Engine
import os
import requests
import json
from hashlib import sha256

GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'YOUR_GROQ_API_KEY')

def generate_non_repeating_mock_set(user_id, subject, topic, num_questions=4):
    user = AspirantUser.objects.get(id=user_id)
    attempted_hashes = user.attempted_question_hashes[-50:] # Fetch last 50 attempted hashes

    system_prompt = """
    You are an expert NTA Exam Controller for Indian Govt exams.
    Generate strictly valid JSON array of multiple-choice questions matching TCS-iON scheme.
    Each question MUST contain: questionText, options (A, B, C, D), correctOptionId, explanation.
    """

    user_prompt = f"""
    Subject: {subject}, Topic: {topic}.
    Do NOT generate questions matching any of these existing hashes: {attempted_hashes}.
    Apply temperature variance 0.7 for dynamic non-repeating problem structures.
    """

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "response_format": {"type": "json_object"}
        }
    )
    return response.json()
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Senior Architect Specifications</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit">
            Django DRF & Groq LLM API Contracts
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Complete technical blueprint for backend ORM schema, vector embeddings pipeline, and anti-repetition guardrails.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 p-3 rounded-2xl border border-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-bold">Production Ready Contract</span>
        </div>
      </div>

      {/* Contract 1: Django DRF Models */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">1. Django DRF Relational Schema (`models.py`)</h2>
          </div>
          <button
            onClick={() => copyCode(djangoModelsCode, 'models')}
            className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            {copiedSection === 'models' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'models' ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-900">
          <code>{djangoModelsCode}</code>
        </pre>
      </div>

      {/* Contract 2: Groq API Guardrails */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-outfit">2. Groq LLM API Guardrail Engine (`groq_pipeline.py`)</h2>
          </div>
          <button
            onClick={() => copyCode(groqGuardrailCode, 'groq')}
            className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            {copiedSection === 'groq' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'groq' ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-900">
          <code>{groqGuardrailCode}</code>
        </pre>
      </div>

    </div>
  );
}
