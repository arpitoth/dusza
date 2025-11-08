import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadGame = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("http://localhost:5136/api/game/gameslist");
        const data = await res.json();
        setGames(data);
      } catch (err: any) {
        setError("Nem tudtam lekérni a játékokat, főnök.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center">Mentett játékok</h1>

        {loading && <p className="text-center">Egy pillanat...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}

        <ul className="space-y-2">
          {games.length === 0 && !loading && (
            <p className="text-center opacity-70">
              Semmi sincs elmentve, főnök.
            </p>
          )}
          {games.map((g) => (
            <li
              key={g.id}
              onClick={() => navigate(`/game/${g.id}`)}
              className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer"
            >
              {g.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoadGame;
