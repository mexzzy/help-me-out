import React, { useState, useRef } from "react";
import { FiSettings, FiVideo, FiMic } from "react-icons/fi";
import { CiCircleRemove, CiDesktop } from "react-icons/ci";
import { BiCopy } from "react-icons/bi";
import logo from "../assets/images/helpLogo.png";

export default function Extension() {
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  //
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  //
  const mediaRecorderRef = useRef(null);
  const tabRecordingRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);

  // useEffect(() => {
  //   // Listen for messages from the background script
  //   chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //     if (request.action === "startTabRecording") {
  //       chrome.tabCapture.capture({ video: true, audio: true }, function (stream) {
  //         sendResponse({ stream: stream });
  //       });
  //       return true; // Keep the message channel open for sendResponse
  //     }
  //   });
  // }, []);
  const handleCloseTab = () => {
    window.close();
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle the recorded data (e.g., save it to a file or send it to a server)
          // For example, you can create a blob and save it:
          // const blob = new Blob([event.data], { type: "video/webm" });
          // saveBlobToFile(blob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream; // Store the stream in the ref
      const videoElement = document.getElementById("cameraFeed");
      videoElement.srcObject = stream;
      videoElement.play();
      mediaRecorder.start();
      setIsVideoChecked(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsVideoChecked(false);
    }
  };
  const videoHandleToggle = () => {
    if (isVideoChecked) {
      stopVideoRecording();
      console.log("video stop");
    } else {
      startVideoRecording();
      console.log("video start");
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // You can now use the 'stream' for audio recording or other purposes in your application.
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle the recorded data (e.g., save it to a file or send it to a server)
          // For example, you can create a blob and save it:
          // const blob = new Blob([event.data], { type: "video/webm" });
          // saveBlobToFile(blob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      audioStreamRef.current = stream; // Store the stream in the ref
      mediaRecorder.start();
      setIsVideoMuted(false);
      setIsAudioChecked(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudioRecording = () => {
    // Stop audio stream tracks if they exist
    if (audioStreamRef.current) {
      mediaRecorderRef.current.stop();
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      setIsAudioChecked(false);
      setIsVideoMuted(true);
    }
  };

  const audioHandleToggle = () => {
    if (isAudioChecked) {
      stopAudioRecording();
      console.log("audio stop");
    } else {
      startAudioRecording();
      console.log("audio start");
    }
  };

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Request video stream
        audio: isAudioChecked, // Request audio stream if audio is checked
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle the recorded data (e.g., save it to a file or send it to a server)
          // For example, you can create a blob and save it:
          // const blob = new Blob([event.data], { type: "video/webm" });
          // saveBlobToFile(blob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream; // Store the stream in the ref
      mediaRecorder.start();
      setIsScreenRecording(true);
    } catch (error) {
      console.error("Error accessing screen recording:", error);
      setIsScreenRecording(false); // Set this to false if there was an error
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsScreenRecording(false);
    }
  };

  const screenHandleToggle = () => {
    if (isScreenRecording) {
      stopScreenRecording();
      console.log("screen recording stop");
    } else {
      startScreenRecording();
      console.log("screen recording start");
    }
  };

  const startTabRecording = () => {
    // Send a message to the background script to start tab recording
    // chrome.runtime.sendMessage(
    //   { action: "startTabRecording" },
    //   function (response) {
    //     if (chrome.runtime.lastError) {
    //       console.error(chrome.runtime.lastError);
    //     } else {
    //       // Handle the response stream here
    //       const stream = response.stream;
    //       // You can now use this stream for recording
    //       console.log("Tab recording started", stream);
    //       tabRecordingRef.current = stream; // Store the tab recording stream
    //     }
    //   }
    // );
  };

  const stopTabRecording = () => {
    // Close the tab recording stream if it's active
    if (tabRecordingRef.current) {
      tabRecordingRef.current.getTracks().forEach((track) => track.stop());
      console.log("Tab recording stopped");
      tabRecordingRef.current = null;
    }
  };

  const tabRecordingHandleToggle = () => {
    if (tabRecordingRef.current) {
      stopTabRecording();
      console.log("tab recording stop");
    } else {
      startTabRecording();
      console.log("tab recording start");
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
          <div className="screens" onClick={screenHandleToggle}>
            <CiDesktop size={45} color="#0F172A" />
            <span>Full screen</span>
          </div>
          <div className="screens" onClick={tabRecordingHandleToggle}>
            <BiCopy size={45} color="#0F172A" />
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
        <button>Start Recording</button>
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
      </div>
    </>
  );
}
