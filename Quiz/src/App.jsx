import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Game from "./components/Game";
import CookieConsent from "react-cookie-consent";
import Footer from "./components/Footer";

function App() {

 
  return (
    <>
      <div>
        <CookieConsent buttonText="OKEY">Accept cookies</CookieConsent>

        <h1>Quiz</h1>

        <Game />
        <Footer />
      </div>
    </>
  );
}

export default App;
