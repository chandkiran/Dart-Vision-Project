import React, { useState, useEffect, useRef } from "react";

const LiveStreamPage = () => {
  const streamUrl = "http://d547-103-156-26-208.ngrok-free.app"; // Replace with your stream URL
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      console.log("HERE");
      videoRef.current.src = streamUrl;
      console.log(streamUrl);
    }
  }, [streamUrl]);

  const handleError = (error) => {
    console.log(error);
    setError(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>ESP32-CAM Live Stream</h1>
      {error && (
        <p style={{ color: "red" }}>
          Error loading stream. Please check the stream URL.
        </p>
      )}
      {/* <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        controls
        style={{ border: "2px solid #000" }}
        onError={handleError}
      >
        Your browser does not support the video tag.
      </video> */}

      <iframe
        src="http://d547-103-156-26-208.ngrok-free.app"
        frameborder="0"
        width={500}
        height={500}
        style={{ border: "2px solid #000" }}
      ></iframe>

      <iframe
        src="https://569a-103-156-26-208.ngrok-free.app/"
        frameborder="0"
        width={500}
        height={500}
        style={{ border: "2px solid #000" }}
      ></iframe>
    </div>
  );
};

export default LiveStreamPage;
