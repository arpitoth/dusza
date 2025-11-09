import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Size = "Egyszerű_találkozás" | "Kis_kazamata" | "Nagy_kazamata";

interface Card {
  id: number;
  name: string;
  damage: number;
  hp: number;
  cardType: string;
  isBoss: boolean;
}

const AddPlayerCards = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [pcards, setdCards] = useState<Card[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          `http://localhost:5136/api/game/${gameId}/cards`
        );
        if (!res.ok) throw new Error("Nem sikerült a kártyák lekérése");
        const data = await res.json();
        setCards(data);
      } catch (err) {
        setError("Nincsenek még kártyák elmentve. Hozz létre újat!");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [gameId]);

  const handleCardClick = (card: Card) => {
    addPlayerCard(card);
  };

  const addPlayerCard = (card: Card) => {
    if (pcards.some((c) => c.id === card.id) || card.isBoss) return;
    setdCards((prev) => [...prev, card]);
  };

  const removePlayerCard = (cardId: number) => {
    setdCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const saveDeck = async () => {
    if (pcards.length === 0) {
      alert("Válassz kártyákat!");
      return;
    }

    const payload = {
      cardIds: pcards.map((c) => c.id),
      gameId: Number(gameId),
    };

    const res = await fetch(`http://localhost:5136/api/game/addPlayerDeck`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Hiba: " + msg);
      return;
    }

    alert("Játékospakli sikeresen létrehozva!");
    setdCards([]);
    navigate(`/game/${gameId}/gamePlay`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Játékospakli létrehozása
      </h1>
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-full h-auto overflow-x-auto custom-scrollbar">
        <ul className="flex gap-4 min-w-max">
          {cards.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                handleCardClick(c);
              }}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-55 text-center"
            >
              <span className="mb-8 mt-8 text-xl font-bold">Név: {c.name}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Sebzés: {c.damage}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Életerő: {c.hp}</span> <br />
              <span className="mb-8 mt-8 text-lg">Típus: {c.cardType}</span> <br />
              <span className="mb-8 mt-8 text-lg">{c.isBoss? "Vezér" : ""}</span>
              <br />
            </li>
          ))}
        </ul>
      </div>
      <p className="m-[2%]"></p>
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-full min-h-50">
        <ul className="flex flex-wrap gap-4">
          {pcards.map((c) => (
            <li
              key={c.id}
              onClick={() => removePlayerCard(c.id)}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-[15.7%] text-center"
            >
              <span className="mb-8 mt-8 text-xl font-bold">Név: {c.name}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Sebzés: {c.damage}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Életerő: {c.hp}</span> <br />
              <span className="mb-8 mt-8 text-lg">Típus: {c.cardType}</span> <br />
              <br />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={saveDeck}
          className="px-4 py-2 bg-indigo-600 text-white rounded mt-6 cursor-pointer"
        >
          Pakli mentése
        </button>
      </div>
    </div>
  );
};

export default AddPlayerCards;
