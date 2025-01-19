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
  useEffect(() => {
    //om timeleft är mindre än 0 kalla på funktionen setquestionindex-med arg frågeindex+1.
    //sätt sedan tillbaka
    if (timeLeft === 0) {
      setQuestionIndex(questionIndex + 1);
      setTimeLeft(10);
    }

    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);

  

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

  return (
    <>
      <div className="play-text">Lets play!</div>

      <h2>Questions</h2>
      <div className="question">{currentItem.question}</div>

      <ul className="optionslist">
        {currentItem.options.map((option, index) => (
          <li className="option" key={index}>
            {option}
          </li>
        ))}
      </ul>

      {/* Om tiden är mindre än fyra sätts klassnamnet hurry annars time */}
      <h3 className={timeLeft < 4 ? "hurry" : "time"}>{timeLeft}</h3>

      <button
        onClick={() => {
          setTimeLeft(10);
          setQuestionIndex(questionIndex + 1);
        }}
      >
        NEXT
      </button>
    </>
  );
};

//Testat börja sätta upp från lektion
const ShowQuestion = () => {
  return <></>;
};

export default Game;

//index & key då jag ej har id på frågorna. använd map för att mappa ut dem. och ev filter.
//exempel på lektion skriva ut array en och en
// function ShowList(props) {
//     const listItems = props.myArray.map((text) => {
//         return <ul> {text}</ul>
//     })
// }

//rafce är kortkommande
