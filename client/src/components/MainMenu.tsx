import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser);
  }, []);

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
        await fetch("http://localhost:5136/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refreshToken),
        });
    }

    localStorage.clear();
    navigate("/");
    };

  return (
    <>
    <div className="text-white text-2xl">
      Üdv, {userName}
    </div>
    <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-600 rounded cursor-pointer"
        >
        Kijelentkezés
    </button>
    </>
  );
}

export default MainMenu