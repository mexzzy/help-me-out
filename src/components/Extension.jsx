import React, { useState, useRef } from "react";
import { FiSettings, FiVideo, FiMic } from "react-icons/fi";
import { CiCircleRemove, CiDesktop } from "react-icons/ci";
import { BiCopy } from "react-icons/bi";
import logo from "../assets/images/helpLogo.png";

export default function Extension() {
  // State for various recording options
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // State for controlling recording status
  const [isRecording, setIsRecording] = useState(false);
  const [recordedContentURL, setRecordedContentURL] = useState(null);

  // Refs for media recording and tab recording
  const mediaRecorderRef = useRef(null);
  const tabRecordingRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);



  const handleCloseTab = () => {
    window.close();
  };

  // Function to start video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      // Handle recorded data as needed

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      const videoElement = document.getElementById("cameraFeed");
      videoElement.srcObject = stream;
      videoElement.play();
      mediaRecorder.start();
      setIsVideoChecked(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to stop video recording
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsVideoChecked(false);
    }
  };

  // Toggle video recording
  const videoHandleToggle = () => {
    if (isVideoChecked) {
      stopVideoRecording();
      console.log("video stop");
    } else {
      startVideoRecording();
      console.log("video start");
    }
  };

  // Function to start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      // Handle recorded data as needed

      mediaRecorderRef.current = mediaRecorder;
      audioStreamRef.current = stream;
      mediaRecorder.start();
      setIsVideoMuted(false);
      setIsAudioChecked(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Function to stop audio recording
  const stopAudioRecording = () => {
    if (audioStreamRef.current) {
      mediaRecorderRef.current.stop();
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      setIsAudioChecked(false);
      setIsVideoMuted(true);
    }
  };

  // Toggle audio recording
  const audioHandleToggle = () => {
    if (isAudioChecked) {
      stopAudioRecording();
      console.log("audio stop");
    } else {
      startAudioRecording();
      console.log("audio start");
    }
  };

  const chrome = window.chrome || {};
  // Function to start screen recording
  const startScreenRecording = async () => {
    try {
      // Get the currently active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];

          // Send a message to the content script of the active tab
          chrome.tabs.sendMessage(activeTab.id, {
            action: "startScreenRecording",
            audio: isAudioChecked,
          });
        } else {
          console.error("No active tabs found.");
          setIsScreenRecording(false);
        }
      });
    } catch (error) {
      console.error("Error requesting screen recording:", error);
      setIsScreenRecording(false);
    }
  };

  // Function to stop screen recording
  const stopScreenRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsScreenRecording(false);
    }
  };

  // Toggle screen recording
  const screenHandleToggle = () => {
    if (isScreenRecording) {
      stopScreenRecording();
      console.log("screen recording stop");
    } else {
      startScreenRecording();
      console.log("screen recording start");
    }
    setIsVideoMuted(!isVideoMuted);
  };

  // Function to start tab recording
  const startTabRecording = () => {
    const chrome = window.chrome || {};
    chrome.runtime.sendMessage(
      { action: "startTabRecording" },
      function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          const stream = response.stream;
          console.log("Tab recording started", stream);
          tabRecordingRef.current = stream;
        }
      }
    );
  };

  // Function to stop tab recording
  const stopTabRecording = () => {
    if (tabRecordingRef.current) {
      tabRecordingRef.current.getTracks().forEach((track) => track.stop());
      tabRecordingRef.current = null;
      console.log("Tab recording stopped");
    }
  };

  // Toggle tab recording
  const tabRecordingHandleToggle = () => {
    if (tabRecordingRef.current) {
      stopTabRecording();
      console.log("tab recording stop");
    } else {
      startTabRecording();
      console.log("tab recording start");
    }
    setIsRecording(!isRecording);
  };

  // Function to start recording (audio and video)
  const startRecording = async () => {
    try {
      if (isVideoChecked || isAudioChecked) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoChecked,
          audio: isAudioChecked,
        });

        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setRecordedContentURL(url);
          setIsRecording(false);
        };

        mediaRecorderRef.current = mediaRecorder;
        streamRef.current = stream;
        mediaRecorder.start();
        setIsRecording(true);
      } else {
        alert("Please select at least one recording option (video or audio).");
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    stopAudioRecording();
    stopScreenRecording();
    stopVideoRecording();
    const videoElement = document.getElementById("cameraFeed");
    if (videoElement) {
      videoElement.srcObject = null;
    }
  };

  // Toggle recording (audio and video)
  const recordingHandleToggle = () => {
    if (isRecording) {
      stopRecording();
      console.log("Recording stopped");
    } else {
      startRecording();
      console.log("Recording started");
    }
  };

  return (
    <>
      <div className="main">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="right">
            <FiSettings
              size={20}
              color="#120B48"
              style={{ cursor: "pointer" }}
            />
            <CiCircleRemove
              onClick={handleCloseTab}
              size={25}
              color="#B6B3C6"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <p className="paragraph">
          This extension helps you record and share help videos with ease.
        </p>
        <div className="screenOptions">
          <div
            className={`screens ${isScreenRecording && "active"}`}
            onClick={screenHandleToggle}
          >
            <CiDesktop
              size={45}
              className={`desktop-icon  ${isScreenRecording && "activeIcon"}`}
            />
            <span>Full screen</span>
          </div>
          <div
            className={`screens ${isRecording && "active"}`}
            onClick={tabRecordingHandleToggle}
          >
            <BiCopy
              size={45}
              className={`desktop-icon  ${isRecording && "activeIcon"}`}
            />
            <span>Current Tab</span>
          </div>
        </div>
        <div className="switchContainer">
          <div className="right">
            <FiVideo color="#0F172A" size={30} />
            <span>camera</span>
          </div>
          <div
            className={`toggle-switch ${isVideoChecked && "checked"}`}
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
            className={`toggle-switch ${isAudioChecked && "checked"}`}
            onClick={audioHandleToggle}
          >
            <div className="slider"></div>
          </div>
        </div>
        <button onClick={recordingHandleToggle}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        {recordedContentURL && (
          <div>
            <a
              href={recordedContentURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Recorded Content
            </a>
          </div>
        )}
        <video
          id="cameraFeed"
          autoPlay
          muted={isVideoMuted}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
      <button onClick={requestCameraAccess}>Request Camera Access</button>
      <button onClick={requestAudioAccess}>Request Audio Access</button>
    </div>
      </div>
    </>
  );
}
