import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Card {
  id: number;
  name: string;
  damage: number;
  hp: number;
  cardType: string;
  isBoss: boolean;
}

interface Dungeon {
  id: number;
  name: string;
  size: string;
  gameId: number;
  cardCount: number;
}

const GamePlay = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [selectedDungeonId, setSelectedDungeonId] = useState<number | null>(
    null
  );
  const [error, setError] = useState("");

  const sizeLabels: { [key: string]: string } = {
    Egyszerű_találkozás: "Egyszerű találkozás (1 kártya)",
    Kis_kazamata: "Kis kazamata (4 kártya)",
    Nagy_kazamata: "Nagy kazamata (6 kártya)",
  };

  useEffect(() => {
    if (!gameId) return;

    const fetchPlayerCards = async () => {
      try {
        const res = await fetch(
          `http://localhost:5136/api/game/${gameId}/getPlayerCards`
        );
        if (!res.ok) throw new Error("Nem sikerült a játékos kártyák lekérése");
        const data = await res.json();
        setPlayerCards(data);
      } catch (err) {
        console.error(err);
        setError("Hiba a játékos kártyák lekérésekor");
      }
    };

    const fetchDungeons = async () => {
      try {
        const res = await fetch(
          `http://localhost:5136/api/game/${gameId}/dungeons`
        );
        if (!res.ok) throw new Error("Hiba a dungeonok lekérésekor");
        const data = await res.json();
        setDungeons(data);
      } catch (err) {
        console.error(err);
        setError("Hiba a dungeonok lekérésekor");
      }
    };

    fetchPlayerCards();
    fetchDungeons();
  }, [gameId]);

  const handleCardClick = (card: Card) => {
    if (selectedCards.some((c) => c.id === card.id) || card.isBoss) return;
    setSelectedCards((prev) => [...prev, card]);
  };

  const removeCard = (cardId: number) => {
    setSelectedCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleDungeonClick = (dungeonId: number) => {
    setSelectedDungeonId(dungeonId);
    localStorage.setItem("selectedDungeonId", dungeonId.toString());
  };

  const handleFight = () => {
    if (selectedCards.length === 0) {
      alert("Válassz kártyákat a harchoz!");
      return;
    }
    if (!selectedDungeonId) {
      alert("Válassz kazamatát a harchoz!");
      return;
    }

    localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
    navigate(`/game/${gameId}/battle`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Játékospakli létrehozása
      </h1>

      <div className="flex w-full gap-4"> 
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-4 overflow-x-auto">
            <h2 className="text-xl font-bold mb-2">Összes kártya</h2>
            <ul className="flex gap-4 min-w-max flex-wrap">
              {playerCards.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleCardClick(c)}
                  className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-40 text-center"
                >
                  <span className="font-bold">{c.name}</span>
                  <br />
                  Sebzés: {c.damage} <br />
                  Életerő: {c.hp} <br />
                  Típus: {c.cardType}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-4 min-h-[150px]">
            <h2 className="text-xl font-bold mb-2">Kiválasztott kártyák</h2>
            <ul className="flex gap-4 flex-wrap">
              {selectedCards.map((c) => (
                <li
                  key={c.id}
                  onClick={() => removeCard(c.id)}
                  className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-40 text-center"
                >
                  <span className="font-bold">{c.name}</span>
                  <br />
                  Sebzés: {c.damage} <br />
                  Életerő: {c.hp} <br />
                  Típus: {c.cardType}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-4">
          <h2 className="text-xl font-bold mb-2">Kazamaták</h2>
          <ul className="space-y-2 overflow-y-auto">
            {dungeons.map((d) => (
              <li
                key={d.id}
                onClick={() => handleDungeonClick(d.id)}
                className={`p-4 border-none rounded-xl cursor-pointer ${
                  selectedDungeonId === d.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                <p>
                  <strong>Név:</strong> {d.name}
                </p>
                <p>
                  <strong>Méret:</strong> {sizeLabels[d.size] || d.size}
                </p>
                <p>
                  <strong>Kártyák száma:</strong> {d.cardCount}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={handleFight}
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Harc ⚔️
      </button>
    </div>
  );
};

export default GamePlay;
