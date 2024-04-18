import { isHost, useMultiplayerState } from "playroomkit";
import { createContext, useContext, useEffect, useState } from "react";

const GameStateContext = createContext();

const NEXT_STAGE = {
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = { lobby: -1, countdown: 3, game: 0, winner: 5 };

export const gameStateProvider = ({ children }) => {
  const [stage, setStage] = useMultiplayerState("gameStage", "lobby");
  const [timer, setTimer] = useMultiplayerState("timer", TIMER_STAGE.lobby);
  const [players, setPlayers] = useState([]);
  const [soloGame, setSoloGame] = useState(false);

  const host = isHost();

  return (
    <GameStateContext.Provider value={{}}>{children}</GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("some thing is wrong");
  return context;
};
