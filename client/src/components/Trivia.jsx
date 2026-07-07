import { useMemo, useState } from 'react';
import { generateTrivia } from '../utils/trivia';

export default function Trivia({ movie }) {
  const questions = useMemo(() => generateTrivia(movie), [movie]);
  const [answers, setAnswers] = useState({});

  if (questions.length === 0) {
    return null;
  }

  function selectAnswer(qIndex, option) {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  }

  const correctCount = Object.entries(answers).filter(
    ([qIndex, answer]) => answer === questions[qIndex].correctAnswer
  ).length;

  return (
    <section className="trivia">
      <h2>Test your knowledge</h2>
      <p className="trivia__score">
        {Object.keys(answers).length} / {questions.length} answered
        {Object.keys(answers).length > 0 && ` · ${correctCount} correct`}
      </p>
      {questions.map((q, qIndex) => {
        const selected = answers[qIndex];
        return (
          <div className="trivia__question" key={qIndex}>
            <p>{q.question}</p>
            <div className="trivia__options">
              {q.options.map((option) => {
                let className = 'trivia__option';
                if (selected !== undefined) {
                  if (option === q.correctAnswer) className += ' trivia__option--correct';
                  else if (option === selected) className += ' trivia__option--incorrect';
                }
                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    disabled={selected !== undefined}
                    onClick={() => selectAnswer(qIndex, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
