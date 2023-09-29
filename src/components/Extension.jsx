import logo from "../assets/images/helpLogo.png";
import React, { useState } from "react";
import { FiSettings, FiVideo, FiMic, FiCopy } from "react-icons/fi";
import { CiCircleRemove, CiDesktop } from "react-icons/ci";

export default function Extension() {
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);

  const videoHandleToggle = () => {
    setIsVideoChecked(!isVideoChecked);
  };
  const audioHandleToggle = () => {
    setIsAudioChecked(!isAudioChecked);
  };
  return (
    <>
      <div className="main">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="right">
            <FiSettings size={20} color="#120B48" />
            <CiCircleRemove size={25} color="#B6B3C6" />
          </div>
        </div>
        <p className="paragraph">
          This extension helps you record and share help videos with ease.
        </p>
        <div className="screenOptions">
          <div className="screens">
            <CiDesktop size={45} color="#0F172A" />
            <span>Full screen</span>
          </div>
          <div className="screens">
            <FiCopy size={45} color="#0F172A" />
            <span>Current Tab</span>
          </div>
        </div>
        <div className="switchContainer">
          <div className="right">
            <FiVideo color="#0F172A" size={30} />
            <span>camera</span>
          </div>
          <div
            className={`toggle-switch ${isVideoChecked ? "checked" : ""}`}
            onClick={videoHandleToggle}
          >
            <div className="slider"></div>
          </div>
        </div>
        <div className="switchContainer">
          <div className="right">
            <FiMic color="#0F172A" size={30} />
            <span>audio</span>
          </div>
          <div
            className={`toggle-switch ${isAudioChecked ? "checked" : ""}`}
            onClick={audioHandleToggle}
          >
            <div className="slider"></div>
          </div>
        </div>
        <button>Start Recording</button>
      </div>
    </>
  );
}
