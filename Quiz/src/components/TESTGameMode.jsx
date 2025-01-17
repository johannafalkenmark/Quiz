import React, { useState, useEffect } from "react";

//TEST variant:
function GameMode() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    fetch("/Questions.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("I did not manage to collect a question from file");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <p>Hmmm weird this went wrong {error}</p>;
  }

  return (
    <div>
      
      {questions.map((question, index) => (
        <div key={index}>
          <div className="question">{question.question}</div>
          <ul>
            {question.options.map((option, i) => (
              <li className="optionslist" key={i}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

 
}

export default GameMode;