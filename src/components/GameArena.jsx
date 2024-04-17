import Hexagon from "./Hexagon";

export const HEX_X_SPACING = 2.25;
export const HEX_Z_SPACING = 1.95;
export const NB_ROWS = 7;
export const NB_COLUMNS = 7;
export const FLOOR_HEIGHT = 10;
export const FLOORS = [
  { color: "red" },
  { color: "blue" },
  { color: "green" },
  { color: "yellow" },
  { color: "purple" },
];

const GameArena = () => {
  return (
    <group
      position-x={-((NB_COLUMNS - 1) / 2) * HEX_X_SPACING}
      position-z={-((NB_COLUMNS - 1) / 2) * HEX_Z_SPACING}
    >
      {FLOORS.map((floor, i) => (
        <group key={i} position-y={i * -FLOOR_HEIGHT}>
          {[...Array(NB_ROWS)].map((_, i) => (
            <group
              key={i}
              position-x={i % 2 ? HEX_X_SPACING / 2 : 0}
              position-z={i * HEX_Z_SPACING}
            >
              {[...Array(NB_ROWS)].map((_, i) => (
                <Hexagon
                  key={i}
                  position-x={i * HEX_X_SPACING}
                  color={floor.color}
                />
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};
export default GameArena;
