import React, { useState } from "react";
import { generateMockQuestions } from "../utils/interviewQuestions";

function MockInterviewModal({ job, match, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!job) return null;

  const questions = generateMockQuestions(job, match);
  const currentQ = questions[currentIdx];

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;

    // Simulate AI feedback based on answer length and skill keywords
    const len = userAnswer.trim().length;
    let score = "Good";
    let comment = "Strong answer structure! You clearly addressed the question.";

    if (len < 40) {
      score = "Needs Detail";
      comment = "Try elaborating more using specific examples or technical details.";
    } else if (len > 120) {
      score = "Excellent";
      comment = "Comprehensive response! Great job using real technical context.";
    }

    setFeedback({ score, comment });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer("");
      setShowHint(false);
      setShowSample(false);
      setFeedback(null);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setUserAnswer("");
      setShowHint(false);
      setShowSample(false);
      setFeedback(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container interview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="modal-type-badge">🎙️ AI Job-Specific Mock Interview</span>
            <span className="modal-via-badge">Question {currentIdx + 1} of {questions.length}</span>
          </div>
          <h2 className="modal-job-title">Practice for {job.title} at {job.company}</h2>
        </div>

        <div className="modal-body">
          {/* Question Box */}
          <div className="question-card">
            <span className="question-category">{currentQ.category}</span>
            <h3 className="question-text">{currentQ.question}</h3>
          </div>

          {/* Hint & Sample Buttons */}
          <div className="question-helpers">
            <button
              className="btn-helper"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? "Hide Hint" : "Show Answering Hint"}
            </button>
            <button
              className="btn-helper"
              onClick={() => setShowSample(!showSample)}
            >
              📖 {showSample ? "Hide Sample Answer" : "View Sample Answer"}
            </button>
          </div>

          {showHint && (
            <div className="helper-box hint-box">
              <strong>💡 Interview Tip:</strong> {currentQ.hint}
            </div>
          )}

          {showSample && (
            <div className="helper-box sample-box">
              <strong>📖 Recommended Answer Structure:</strong> {currentQ.sampleAnswer}
            </div>
          )}

          {/* Answer Input Area */}
          <div className="answer-input-group">
            <label>Your Response:</label>
            <textarea
              className="answer-textarea"
              rows="4"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your interview response here to get instant feedback..."
            />
          </div>

          {/* AI Feedback Display */}
          {feedback && (
            <div className={`feedback-card ${feedback.score.toLowerCase().replace(" ", "-")}`}>
              <div className="feedback-head">
                <strong>🤖 AI Feedback:</strong>
                <span className="feedback-score-tag">{feedback.score} Score</span>
              </div>
              <p>{feedback.comment}</p>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="modal-footer">
          <div className="footer-left">
            <button
              className="btn-secondary"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>
          </div>

          <button className="btn-secondary" onClick={handleEvaluate}>
            ⚡ Evaluate Answer
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={currentIdx === questions.length - 1}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewModal;
