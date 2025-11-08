import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewGame = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState("");
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "http://localhost:5136/api/game/savename";
      const payload: any = { name: gameName };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data === "string"
            ? data
            : data?.message || JSON.stringify(data);
        setError(msg || "Hiba történt a szerver válaszában.");
      } else {
        setSuccess("Sikeres mentés.");
        const newGameId = data.id;
        navigate(`/game/${newGameId}`);
      }
    } catch (ex: any) {
      setError(ex?.message || "Hálózati hiba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Új játék</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1 text-center">
              Játék neve
            </label>
            <input
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
              autoCapitalize="none"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          {success && <div className="text-sm text-green-400">{success}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Feldolgozás..." : "Játék kezdése"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGame;
