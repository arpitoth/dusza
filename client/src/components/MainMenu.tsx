import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
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

  const newGame = () => {
    navigate("/newgame")
  };

  const loadGame = () => {
    navigate("/loadgame")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Menü</h1>

        <p className="mb-4 text-lg text-center">
          Üdv, <span className="font-semibold">{userName}!</span>
        </p>

        <button
          onClick={newGame}
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 transition px-4 py-3 rounded mb-4 cursor-pointer"
        >
          Új játék
        </button>

        <button
          onClick={loadGame}
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 transition px-4 py-3 rounded mb-4 cursor-pointer"
        >
          Játék betöltése
        </button>

        <button
          onClick={logout}
          className="w-full rounded-lg bg-red-600 hover:bg-red-700 transition px-4 py-3 rounded cursor-pointer"
        >
          Kijelentkezés
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
