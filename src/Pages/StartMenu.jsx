import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getScore, resetScore, setPlaying } from "../redux/gameSlice";
import "../App.css";
import cat1 from "../scene/1.jpg";
import cat2 from "../scene/2.jpg";
import cat3 from "../scene/Chovy.jpg";

const models = [cat1, cat2, cat3];

const StartMenu = () => {
  const navigate = useNavigate();

  const gameState = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const [chosenModel, setChosenModel] = useState(null);
  const [show, setShow] = useState(false);

  console.log(gameState);

  const handleClickStart = () => {
    navigate("/play");
  };
  const handleGetScore = () => {
    dispatch(getScore(10));
  };
  const handlePause = () => {
    dispatch(setPlaying(false));
  };
  const handleReset = () => {
    dispatch(resetScore());
  };
  const handleResume = () => {
    dispatch(setPlaying(true));
  };

  const handleChooseModels = () => {
    setShow((prev) => !prev);
  };

  const handleClickModel = (e) => {
    setChosenModel(e.target.src);
    setShow(false);
  };
  return (
    <div id="Menu">
      {/* <h1>Score: {gameState.score}</h1>
      <h1>IsPlaying: {gameState.isPlaying.toString()}</h1> */}
      {/* <button onClick={handleGetScore}>getScore</button>
      <button onClick={handleReset}>resetScore</button>
      <button onClick={handlePause}>pause</button>
      <button onClick={handleResume}>resume</button> */}
      <div className="controller">
        {chosenModel && <button onClick={handleClickStart}>Start</button>}
        <button onClick={handleChooseModels}>Choose</button>
      </div>
      {show && (
        <div className="models">
          {models.map((cat) => {
            return <img onClick={handleClickModel} src={cat} alt="img" />;
          })}
        </div>
      )}
      {chosenModel && (
        <img className="chosenModel" src={chosenModel} alt="img" />
      )}
    </div>
  );
};

export default StartMenu;
