import React, { useEffect, useRef } from "react";

const LiveStreamPage = () => {
  // Replace with the actual ESP32 stream URL
  const streamUrl = "http://<ESP32_IP_ADDRESS>:81/stream";
  const videoRef = useRef(null);

  useEffect(() => {
    // Set the video source to the stream URL
    if (videoRef.current) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>ESP32 Stereo Vision Live Stream</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        controls
        style={{ border: "2px solid #000" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default LiveStreamPage;
