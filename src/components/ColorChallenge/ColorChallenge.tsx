"use client";
import * as React from "react";
import styled, { css } from "styled-components";

const ColorComparator = styled.div<{ together: boolean }>`
  display: flex;
  justify-content: center;
  gap: ${({ together }) => (together ? "0" : "20px")};
  transition: gap 0.5s;
  margin-bottom: 20px;
`;

const ColorBlock = styled.div<{
  color: number;
  together: boolean;
  gameState: string;
}>`
  width: 100px;
  height: 100px;
  background-color: ${({ color }) => `#${color.toString(16)}`};
  border-radius: 4px;
  box-shadow: 0 0 1px 2px black, 0 0 1px 4px white;
  ${({ together }) =>
    together &&
    css`
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }

      box-shadow: none;
    `}

  ${({ gameState }) =>
    gameState === "lost" &&
    css`
      filter: grayscale(100%);
    `}
`;

const GuessButton = styled.button`
  font-size: 2em;
  padding: 0.5em 1em;
  border: 1px solid black;
  border-radius: 5px;
`;

function ColorChallenge() {
  const [color, setColor] = React.useState(0);
  const [guess, setGuess] = React.useState(0);
  const [gameState, setGameState] = React.useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [together, setTogether] = React.useState(false);

  React.useEffect(() => {
    setColor(Math.floor(Math.random() * 16777215));
    setGuess(Math.floor(Math.random() * 16777215));
  }, []);

  const handleDifferent = () => {
    if (color === guess) {
      setGameState("lost");
    } else {
      setGuess(approachToColor(color, guess));
    }
  };

  const handleSame = () => {
    setGameState(color === guess ? "won" : "lost");
  };

  const isPlaying = gameState === "playing";
  return (
    <div>
      {!isPlaying && (
        <h2>{gameState === "won" ? "You win!" : "You lost..."}</h2>
      )}
      <ColorComparator together={together}>
        <ColorBlock color={color} together={together} gameState={gameState} />
        <ColorBlock color={guess} together={together} gameState={gameState} />
      </ColorComparator>
      <GuessButton disabled={!isPlaying} onClick={handleDifferent}>
        ≠
      </GuessButton>
      <GuessButton disabled={!isPlaying} onClick={handleSame}>
        =
      </GuessButton>
      <GuessButton disabled={!isPlaying} onClick={() => setTogether(!together)}>
        {together ? "separate" : "join"}
      </GuessButton>
      {gameState === "lost" && color !== guess && (
        <div>Difference: {getColorDistance(color, guess)}</div>
      )}
    </div>
  );
}

export default ColorChallenge;

function getColorDistance(color1: number, color2: number) {
  const r1 = (color1 & 0xff0000) >> 16;
  const g1 = (color1 & 0x00ff00) >> 8;
  const b1 = color1 & 0x0000ff;
  const r2 = (color2 & 0xff0000) >> 16;
  const g2 = (color2 & 0x00ff00) >> 8;
  const b2 = color2 & 0x0000ff;
  const result = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
  return Math.round(result * 100) / 100;
}

const getRGB = (color: number) => {
  const r = (color & 0xff0000) >> 16;
  const g = (color & 0x00ff00) >> 8;
  const b = color & 0x0000ff;
  return { r, g, b };
};

function approachToColor(target: number, current: number) {
  const { r: r1, g: g1, b: b1 } = getRGB(target);
  const { r: r2, g: g2, b: b2 } = getRGB(current);
  const newR = r2 + getCloserToZeroByRandom(r1 - r2);
  const newG = g2 + getCloserToZeroByRandom(g1 - g2);
  const newB = b2 + getCloserToZeroByRandom(b1 - b2);
  return (newR << 16) + (newG << 8) + newB;
}

function getRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCloserToZeroByRandom(num: number) {
  if (num === 0) return 0;
  if (num < 0) return getRandomNumberInRange(num, -1);
  return getRandomNumberInRange(1, num);
}
