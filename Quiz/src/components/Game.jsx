import { useEffect, useState } from "react";

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const getQuestions = () => {
    fetch("Questions.json")
      .then((response) => {
        console.log("resolved", response);
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        console.log("rejected", err);
      });
  };
  useEffect(() => {
    getQuestions();
  }, []);
  return (
    <>
      <div className="play-text">Lets play!</div>
      {JSON.stringify(questions)}
      

    </>
  );
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
