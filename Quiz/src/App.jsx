import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import GameMode from "./components/TESTGameMode";
import Game from "./components/Game";
import CookieConsent from "react-cookie-consent";

function App() {

 
  return (
    <>
      <div>
        <CookieConsent buttonText="OKEY">Accept cookies</CookieConsent>

        <h1>Quiz</h1>
       
        <Game />
    
      </div>
    </>
  );
}

export default App;
