import { useEffect, useState } from "react";

// const [namnPåVariabel, denEndaFunktionSomKanÄndrapåVariabel ] = useState(  initialaVärdetPåVariabeln  )

// useEffect( funktionSomKörs, listaAttLyssnaEfterSomInnehållerVärdenSomKanÄndras   );


const timePerQuestion = 10;

const Game = () => {
  //State för att hämta frågor och svar. Börjar som tom array.
  const [quizData, setQuizData] = useState([]);

  //State för att ta ut frågorna en och en. Börjar på 0.
  const [questionIndex, setQuestionIndex] = useState(0);

  //State för poängställning
  const [score, setScore] = useState(0);

  //State för feedback efter svar på fråga
  const [feedback, setFeedback] = useState("");

  //State för timer. Börjar på 10(sek).
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

  //State för att visa när en fråga är/inte är besvarad.
  const [selectedAnswer, setSelectedAnswer] = useState("");

  //State för att sätta id på timeout(för att kunna pausa den)
  const [timeoutId, setTimeoutId] = useState(0);

  //TIMER
  useEffect(() => {
    //om timeleft är mindre än 0 kalla på funktionen setquestionindex-med arg frågeindex+1:
    if (timeLeft === 0) {
      clearTimeout(timeoutId);
      checkAnswer(null);
    }

    if (timeLeft > 0) {
      const myTimeoutId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      setTimeoutId(myTimeoutId);
    }
  }, [timeLeft]);


  //HÄMTA FRÅGORNA FRÅN FIL VIA FETCH:
  const getQuestions = () => {
    fetch("Questions.json")
      .then((response) => {
        console.log("resolved", response);
        return response.json();
      })
      .then((data) => {
        setQuizData(data); // Quizdata blir data här
      })
      .catch((err) => {
        console.log("rejected", err);
      });
  };

  useEffect(() => {
    getQuestions();
    // En tom array betyder kör den bara en gång per livscykel:
  }, []);

  //Variabel som innehåller json filens array och viss arrayindex. Så att endast en fråga i taget kan visas:
  const currentItem = quizData[questionIndex];
  //så att den inte körs innan spelet dragit igång:
  if (!currentItem) {
    return null;
  }

  //Stämmer av arrayindex mot längden på arrayen i jsonfilen.
  if (questionIndex >= quizData.length - 1) {
    //visar poängen när spelet är klart/arrayen gåtts igenom:
    return (
      <div className="final-text">
        Thank you for playing!
        <div className="final-score">
          Your final score is <p className="final-score-number">{score}</p>
        </div>
        <div className="cake-div">
          <svg
            className="cake-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
          >
            <path d="M160-80q-17 0-28.5-11.5T120-120v-200q0-33 23.5-56.5T200-400v-160q0-33 23.5-56.5T280-640h160v-58q-18-12-29-29t-11-41q0-15 6-29.5t18-26.5l56-56 56 56q12 12 18 26.5t6 29.5q0 24-11 41t-29 29v58h160q33 0 56.5 23.5T760-560v160q33 0 56.5 23.5T840-320v200q0 17-11.5 28.5T800-80H160Zm120-320h400v-160H280v160Zm-80 240h560v-160H200v160Zm80-240h400-400Zm-80 240h560-560Zm560-240H200h560Z" />
          </svg>
        </div>
        <div className="play-again-button-div">
          <button
            className="play-again-button"
            //Återställer värden om man vill spela om:
            onClick={() => {
              setTimeLeft(timePerQuestion);
              setQuestionIndex(0);
              setScore(0);
              setFeedback("");
            }}
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  const goToNextQuestion = () => {
    setSelectedAnswer("");
    setFeedback("");
    setTimeLeft(timePerQuestion);
    setQuestionIndex(questionIndex + 1);
  };

  //Stämmer av svaret:
  const checkAnswer = (selectedOption) => {
    clearTimeout(timeoutId);

    if (selectedOption === currentItem.answer) {
      setScore(score + 1);
      setFeedback("Correct 😀");
      //EV TA BORT DENNA setTimeLeftNextQuestion(4);
    } else if (selectedOption === null) {
      setFeedback("Time is up");
      setSelectedAnswer("WRONG ANSWER");
    } else {
      setScore(score - 1);
      setFeedback("Sorry - not the right answer. 😓");
    }
  };

  //Beroende på om val är gjort får button olika klassnamn(för att kunna göra effekter röd/grön m.m.)
  const getButtonClassName = (option) => {
    if (selectedAnswer === "") {
      return "option-button";
    }

    if (feedback !== "") {
      if (option === currentItem.answer) {
        return "option-button correct-answer";
      }
      return "option-button wrong-answer";
    }

    return "option-button";
  };

  return (
    <>
      <div className="play-text">Lets play!</div>

      <div className="question">{currentItem.question}</div>

      <ul className="optionslist">
        {currentItem.options.map((option, index) => (
          <li className="option" key={index}>
            <button
              //Går ej att trycka igen när man gjort ett val:
              disabled={selectedAnswer !== ""}
              className={getButtonClassName(option)}
              onClick={() => {
                //här blir option selectedanswer
                setSelectedAnswer(option);
                //här blir  option selectedoption:
                checkAnswer(option);
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      <div className="feedback">{feedback}</div>

      <div
        className={
          score < 0
            ? "score-status-low"
            : score < 2
            ? "score-status"
            : "score-status-high"
        }
      >
        {score} p
      </div>
      {/* Om tiden är mindre än fyra sätts klassnamnet hurry annars time-fallbackvärde */}
      <h3 className={timeLeft < 4 ? "hurry" : "time"}>{timeLeft}</h3>
      <button //Kan ej gå vidare utan angett svar. Eget klassnamn om val ej är gjort för effekt på knappen.
        className={`next-button ${
          selectedAnswer === "" ? "next-button-hidden" : ""
        } `}
        disabled={selectedAnswer === ""}
        onClick={() => {
          goToNextQuestion();
        }}
      >
        Next
      </button>
    </>
  );
};

export default Game;
