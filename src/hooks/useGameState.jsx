import {
  Joystick,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const GameStateContext = createContext();

const NEXT_STAGE = {
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = { lobby: -1, countdown: 3, game: 0, winner: 5 };

export const GameStateProvider = ({ children }) => {
  const [stage, setStage] = useMultiplayerState("gameStage", "lobby");
  const [timer, setTimer] = useMultiplayerState("timer", TIMER_STAGE.lobby);
  const [players, setPlayers] = useState([]);
  const [soloGame, setSoloGame] = useState(false);

  const host = isHost();

  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current) {
      return;
    }
    isInit.current = true;
    onPlayerJoin((state) => {
      const controls = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "jump", label: "jump" }],
      });
      const newPlayer = { state, controls };

      setPlayers((players) => [...players, newPlayer]);

      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== stage.id));
      });
    });
  }, []);

  useEffect(() => {
    if (!host) return;
    if (stage === "lobby") return;
    const timeout = setTimeout(() => {
      let newTime = stage === "game" ? timer + 1 : timer - 1;
      if (newTime === 0) {
        const nextStage = NEXT_STAGE[stage];
        setStage(nextStage, true);
        newTime = TIMER_STAGE[nextStage];
      }
      setTimer(newTime, true);
      return () => clearTimeout(timeout);
    }, 1000);
  }, [host, timer, stage, soloGame]);

  const startGame = () => {
    setStage("countdown");
    setTimer(TIMER_STAGE.countdown);
    if (players.length === 1) {
      setSoloGame(true);
    }
  };

  return (
    <GameStateContext.Provider
      value={{
        stage,
        timer,
        players,
        host,
        startGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error("some thing is wrong");
  return context;
};
