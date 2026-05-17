import React from "react";
import { Header } from "./components/Header";
import { Game } from "./components/Game";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Game />
    </>
  );
};

export default App;
