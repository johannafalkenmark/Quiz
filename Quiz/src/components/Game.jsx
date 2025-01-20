import { useEffect, useState } from "react";
// const [namnPåVariabel, denEndaFunktionSomKanÄndrapåVariabel ] = useState(  initialaVärdetPåVariabeln  )
  // useEffect( funktionSomKörs, listaAttLyssnaEfterSomInnehållerVärdenSomKanÄndras   );


const Game = () => {
  //State för att hämta frågor och svar. Börjar som tom array.
  const [quizData, setQuizData] = useState([]);

  //State för att ta ut frågorna en och en. Börjar på 0.
  const [questionIndex, setQuestionIndex] = useState(0);

  //State för poängställning
  const [score, setScore] = useState(0);

  //State för feedback efter svar på fråga
  const [feedback, setFeedback] = useState("");
  
  //State för timer. Först tidkvar variabel sen metoden som kan ändra den. Börjar på 10(sek).
  const [timeLeft, setTimeLeft] = useState(10);

//feedback effekt:



  //TIMER
//   useEffect(() => {
//     //om timeleft är mindre än 0 kalla på funktionen setquestionindex-med arg frågeindex+1.
//     //sätt sedan tillbaka
//     if (timeLeft === 0) {
//       setQuestionIndex(questionIndex + 1);
//       setTimeLeft(10);
//     }

//     if (timeLeft > 0) {
//       setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//     }
//   }, [timeLeft]);

  

//HÄMTA FRÅGORNA FRÅN FIL VIA FETCH
  const getQuestions = () => {
    fetch("Questions.json")
      .then((response) => {
        console.log("resolved", response);
        return response.json();
      })
      .then((data) => {
        setQuizData(data); // state-variabeln quizData blir data
      })
      .catch((err) => {
        console.log("rejected", err);
      });
  };

  useEffect(() => {
    getQuestions();
    // En tom array betyder kör den bara en gång per livscykel:
  }, []);
 

  //Variabel som innehåller json filens array och viss arrayindex. Så att endast en fråga i taget kan visas.
  const currentItem = quizData[questionIndex];
  //så att den inte körs innan spelet dragit igång:
  if (!currentItem) {
    return null;
  }

  //Stämmer av arrayindex mot längden på arrayen i jsonfilen.
  if (questionIndex >= quizData.length - 1) {
    //visar poängen nä spelet är klart/arrayen gåtts igenom:
    return (
      <div className="final-text">
        Thank you for playing!
        <div className="final-score">
          Your final score is <p className="final-score-number">{score}</p>
        </div>
      </div>
    );
  }

const checkAnswer = (selectedOption) => {
if (selectedOption === currentItem.answer) {
  setScore(score +1);
setFeedback("BRA DET ÄR RÄTT SVAR");
} else {
setScore(score - 1);
setFeedback("DU HADE FEL, Träna lite mer innan du spelar igen");
}
//Skickar vidare till nästa fråga+timer sätts
    setTimeLeft(10);
    setQuestionIndex(questionIndex + 1);
    //gör feedbacken tom till nästa gång:  HUR GÖR JAG ATT DETTA DRÖJER OCH INTE RADERAS DIREKT       
    //setFeedback("");
};

  return (
    <>
      <div className="play-text">Lets play!</div>

      <div className="question">{currentItem.question}</div>

      <ul className="optionslist">
        {currentItem.options.map((option, index) => (
          <li className="option" key={index}>
            <button
              className="option-button"
              onClick={() => {
                //här blir  option selectedoption:
                checkAnswer(option);
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      <div className="feedback">

        {/* //HUR GÖR JAG FEEDBACK EFFEKT BÄTTRE. at tdet påverkar vad som
        skrivs/poppar upp någonstans. */}
        {feedback}
      </div>

      <div
        className={
          score < 0
            ? "score-status-low"
            : score < 2
            ? "score-status"
            : "score-status-high"
        }
      >
        Score: {score}
      </div>
      {/* Om tiden är mindre än fyra sätts klassnamnet hurry annars time */}
      <h3 className={timeLeft < 4 ? "hurry" : "time"}>{timeLeft}</h3>
      <button
        className="next-button"
        onClick={() => {
          setTimeLeft(10);
          setQuestionIndex(questionIndex + 1);
        }}
      >
        Next
      </button>
    </>
  );
};


export default Game;


//rafce är kortkommande
