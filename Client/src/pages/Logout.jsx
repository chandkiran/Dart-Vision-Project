import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(true);

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>You are already logged out</p>
      )}
    </div>
  );
};

export default LogoutButton;