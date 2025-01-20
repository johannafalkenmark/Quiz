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

  //State för timer. Först tidkvar variabel sen metoden som kan ändra den. Börjar på 10(sek).
  const [timeLeft, setTimeLeft] = useState(10);

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
  }, []);
  // En tom array betyder kör den bara en gång per livscykel


  //Variabel som innehåller json filens array och viss arrayindex. Så att endast en fråga i taget kan visas.
  const currentItem = quizData[questionIndex];

  //så att den inte körs innan spelet dragit igång:
  if (!currentItem) {
    return null;
  }

  //Stämmer av arrayindex mot längden på arrayen i jsonfilen.
  if (questionIndex >= quizData.length - 1) {
    //visar poängen:
    return <div>Your score is {score}</div>;
  }

const checkAnswer = () => {
if (currentItem.options === currentItem.answer) {
  setScore(+1);
  return <div>Rätt svar du får +1 poäng {score} </div>;
}
if (currentItem.options !== currentItem.answer) {
   
      setQuestionIndex(questionIndex + 1);
      setScore(-5);
       return <div>Fel svar! {score -1}</div>;
}
}

  return (
    <>
      <div className="play-text">Lets play!</div>

      
      <div className="question">{currentItem.question}</div>

      <ul className="optionslist">
        {currentItem.options.map((option, index) => (
          <li className="option" key={index}>
            <button className="option-button"
            onClick={() => {
        checkAnswer();

            }}> {option} </button>
          </li>
        ))}
      </ul>

      {/* Om tiden är mindre än fyra sätts klassnamnet hurry annars time */}
      <h3 className={timeLeft < 4 ? "hurry" : "time"}>{timeLeft}</h3>
      <div className="score-status">SCORE: {score}</div>

      <button className="next-button"
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
