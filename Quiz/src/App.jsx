import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Game from "./components/Game";
import CookieConsent from "react-cookie-consent";


function App() {
  return (
    <div>
      <CookieConsent buttonText="OKEY">Accept cookies</CookieConsent>
      <div className="game-box">
        <h1>Quiz</h1>
        <Game />

      </div>
    </div>
  );
}

export default App;
