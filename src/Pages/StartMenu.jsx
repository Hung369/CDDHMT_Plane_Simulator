import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getScore, resetScore, setPlaying } from "../redux/gameSlice";
import "../App.css";
import airPlane1 from "/scene/F16.jpg";
import airPlane2 from "/scene/B52.jpg";
import airPlane3 from "/scene/halifax.jpg";
import {
  boeing_translation,
  jet_translation,
  prop_translation,
} from "../Showroom";
import menuaudio from "../Audio/MenuMusic.mp4";

const models = [
  {
    url: airPlane1,
    model: "F16",
    trans: jet_translation,
  },
  {
    url: airPlane2,
    model: "Boeing",
    trans: boeing_translation,
  },
  {
    url: airPlane3,
    model: "Propel",
    trans: prop_translation,
  },
];

const StartMenu = () => {
  const navigate = useNavigate();

  const gameState = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const [chosenModel, setChosenModel] = useState(null);
  const [show, setShow] = useState(false);

  const [audio] = useState(new Audio(menuaudio));
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const playAudio = () => {
    audio
      .play()
      .then(() => {
        setIsAudioPlaying(true); // Update state khi audio bắt đầu phát
      })
      .catch((error) => console.log("Error with playing audio:", error));
  };

  const handleClickStart = () => {
    if (chosenModel) {
      navigate("/play", {
        state: chosenModel,
      });
    }
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
    if (!isAudioPlaying) {
      playAudio(); // Phát audio khi người dùng click "Choose"
    }
  };

  const handleClickModel = (model) => {
    setChosenModel(model);
    setShow(false);
  };
  useEffect(() => {
    return () => {
      audio.pause(); // Dừng phát audio khi component unmount
    };
  }, [audio]);

  return (
    <div id="Menu">
      <div className="controller">
        {chosenModel && <button onClick={handleClickStart}>Start</button>}
        <button onClick={handleChooseModels}>Choose</button>
      </div>
      {show && (
        <div className="models">
          {models.map((model) => {
            return (
              <img
                onClick={() => handleClickModel(model)}
                src={model.url}
                key={model.url}
                alt="img"
              />
            );
          })}
        </div>
      )}
      {chosenModel && (
        <img className="chosenModel" src={chosenModel.url} alt="img" />
      )}
    </div>
  );
};

export default StartMenu;
