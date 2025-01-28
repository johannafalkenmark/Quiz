import { useEffect, useState } from "react";
import Footer from "./Footer";

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

  //State för att spara sammanfattning som ska visas på sista sidan
  const [summaryList, setSummaryList] = useState([]);

  //TIMER
  useEffect(() => {
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

  useEffect(() => {
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
    getQuestions();
    // En tom array innebär att den kör den bara en gång per livscykel:
  }, []);

  const goToNextQuestion = () => {
    setSelectedAnswer("");
    setFeedback("");
    setTimeLeft(timePerQuestion);
    setQuestionIndex(questionIndex + 1);
  };

  //Stämmer av svaret när man valt alternativ:
  const checkAnswer = (selectedOption) => {
    setSummaryList(
      summaryList.concat({
        selectedOption,
        correctAnswer: currentItem.answer,
      })
    );

    //Pausar timern:
    clearTimeout(timeoutId);

    if (selectedOption === currentItem.answer) {
      setScore(score + 1);
      setFeedback("Correct 😀");
    } else if (selectedOption === null) {
      setFeedback("You ran out of time 🐌");
      setSelectedAnswer("No time left");
      setScore(score - 1);
    } else {
      setScore(score - 1);
      setFeedback("Sorry - not the right answer 😓");
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

  //Variabel som innehåller json filens array och viss arrayindex. Så att endast en fråga i taget kan visas:
  const currentItem = quizData[questionIndex];
  //så att den inte körs innan spelet dragit igång:
  if (!currentItem) {
    return null;
  }

  //Stämmer av arrayindex mot längden på arrayen i jsonfilen.
  //När frågorna är slut:
  if (questionIndex >= quizData.length - 1) {
    clearTimeout(timeoutId);
    //visar poängen och spela om knapp när spelet är klart/arrayen gåtts igenom:
    return (
      <div className="final-text">
        Thank you for playing!
        <div className="final-score">
          Your final score is <p className="final-score-number">{score}</p>
        </div>
        <div className="summary-container">
          <ul className="summary-list">
            {summaryList.map((item, index) => (
              <li key={index}>
                <p>Fråga {index + 1}</p>
                <p
                  className={
                    item.selectedOption === item.correctAnswer
                      ? "summary-rightanswer"
                      : "summary-wronganswer"
                  }
                >
                  Du svarade {item.selectedOption}
                </p>
                <p>Rätt svar var {item.correctAnswer}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="play-again-button-div">
          <button
            className="play-again-button"
            //Återställer värden om man vill spela om:
            onClick={() => {
              setTimeLeft(9);
              setQuestionIndex(0);
              setScore(0);
              setFeedback("");
              setSummaryList([]);
            }}
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-lets-play">
        <div className="play-text">Lets play!</div>
      </div>
      <div className="question-container">
        <h2 className="question"> {currentItem.question} </h2>
      </div>

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
      {/* Om tiden är mindre än fyra sätts klassnamnet hurry annars är time fallbackvärdet */}
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

      <Footer />
    </>
  );
};

export default Game;
