import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Home() {
  const navigate = useNavigate();
  const [cookies] = useCookies();

  useEffect(() => {
    if (cookies.id) {
      navigate("/live");
    } else {
      navigate("/login");
    }
  }, [cookies, navigate]);

  return (
    <>
      <h1>Authenticating</h1>
    </>
  );
}

export default Home;
