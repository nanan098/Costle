import React from "react";
import { Header } from "./components/Header";
import { Game } from "./components/Game";
import { Analytics } from "@vercel/analytics/next";

const App: React.FC = () => {
  return (
    <>
      <Analytics />
      <Header />
      <Game />
    </>
  );
};

export default App;
