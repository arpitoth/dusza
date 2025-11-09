import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Size = "Egyszerű_találkozás" | "Kis_kazamata" | "Nagy_kazamata";

interface Card {
  id: number;
  name: string;
  damage: number;
  hp: number;
  cardType: string;
  isBoss: boolean;
}

const AddDungeon = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingCard, setPendingCard] = useState<Card | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [dcards, setdCards] = useState<Card[]>([]);
  const [dungeonName, setDungeonName] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<Size>("Egyszerű_találkozás");
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

  const maxCardsForSize = (size: Size) => {
    switch (size) {
      case "Egyszerű_találkozás":
        return 1;
      case "Kis_kazamata":
        return 4;
      case "Nagy_kazamata":
        return 6;
    }
  };

  const handleCardClick = (card: Card) => {
    if (
      dcards.length === maxCardsForSize(selectedSize) - 1 &&
      maxCardsForSize(selectedSize) != 1
    ) {
      setPendingCard(card);
      if (pendingCard?.isBoss) {
        addDungeonCard(card);
        return;
      } else {
        setShowDialog(true);
        return;
      }
    }
    if (dcards.length >= maxCardsForSize(selectedSize)) {
      alert("Tele van a kazamata.");
      return;
    }
    addDungeonCard(card);
  };

  const addDungeonCard = (card: Card) => {
    if (dcards.some((c) => c.id === card.id)) return;
    setdCards((prev) => [...prev, card]);
  };

  const handleSave = async (card: any) => {
    try {
      const res = await fetch(
        `http://localhost:5136/api/game/${gameId}/addcard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card),
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Sikertelen mentés:", errorMsg);
        alert("Kártya mentése sikertelen: " + errorMsg);
        return null;
      }

      const savedCard = await res.json();
      setCards((prev) => [...prev, savedCard]);
      return savedCard;
    } catch (err) {
      console.error("Hiba a mentés közben:", err);
      alert("Hiba a kártya mentése közben!");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingCard) return;

    const formData = new FormData(e.target as HTMLFormElement);
    console.log(pendingCard);

    const modifiedCard = {
      Name: formData.get("name")?.toString() || pendingCard.name,
      Damage:
        selectedOption === "Damage"
          ? pendingCard.damage * 2
          : pendingCard.damage,
      HP: pendingCard.hp
        ? Number(pendingCard.hp) * (selectedOption === "HP" ? 2 : 1)
        : pendingCard.hp,
      CardType: pendingCard.cardType,
      IsBoss: true,
      GameId: Number(gameId),
    };

    console.log("Küldött kártya:", modifiedCard);

    const savedCard = await handleSave(modifiedCard);
    if (!savedCard) return;

    setdCards((prev) => [...prev, savedCard]);
    setShowDialog(false);
  };

  const removeDungeonCard = (cardId: number) => {
    setdCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const saveDungeon = async () => {
    if (!dungeonName || dcards.length === 0) {
      alert("Adj nevet és válassz kártyákat!");
      return;
    }

    const payload = {
      name: dungeonName,
      size: selectedSize,
      cardIds: dcards.map((c) => c.id),
      gameId: gameId,
    };

    try {
      const res = await fetch(`http://localhost:5136/api/game/addDungeon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert("Hiba: " + msg);
        return;
      }

      alert("Dungeon sikeresen létrehozva!");
      setDungeonName("");
      setdCards([]);
    } catch (err) {
      console.error("Dungeon mentés hiba:", err);
      alert("Hiba a dungeon mentése közben!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Kazamaták létrehozása
      </h1>
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-full h-auto overflow-x-auto custom-scrollbar">
        <div className="mb-4">
          <input
            placeholder="Dungeon neve"
            value={dungeonName}
            onChange={(e) => setDungeonName(e.target.value)}
            className="border px-2 py-1 ml-2 border px-2 py-1 g-gray-800 border border-gray-700 text-white rounded-lg"
          />
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as Size)}
            className="ml-2 border px-2 py-1 g-gray-800 border border-gray-700 text-white cursor-pointer rounded-lg"
          >
            <option value="Egyszerű_találkozás">
              Egyszerű találkozás (1 kártya)
            </option>
            <option value="Kis_kazamata">Kis kazamata (4 kártya)</option>
            <option value="Nagy_kazamata">Nagy kazamata (6 kártya)</option>
          </select>
        </div>
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
          {dcards.map((c) => (
            <li
              key={c.id}
              onClick={() => removeDungeonCard(c.id)}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-[15.7%] text-center"
            >
              <span className="mb-8 mt-8 text-xl font-bold">Név: {c.name}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Sebzés: {c.damage}</span>
              <br />
              <span className="mb-8 mt-8 text-lg">Életerő: {c.hp}</span> <br />
              <span className="mb-8 mt-8 text-lg">Típus: {c.cardType}</span> <br />
              <span className="mb-8 mt-8 text-lg">Típus: {c.cardType}</span> <br />
              <span className="mb-8 mt-8 text-lg">{c.isBoss? "Vezér" : ""}</span>
              <br />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={saveDungeon}
          className="px-4 py-2 bg-indigo-600 text-white rounded mt-6 cursor-pointer"
        >
          Dungeon mentése
        </button>
        <button
          onClick={() =>{navigate(`/game/${gameId}/addPlayerCards`)}}
          className="px-4 py-2 bg-indigo-600 text-white rounded mt-6 cursor-pointer"
        >
          Tovább
        </button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 text-white border-none">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="mb-4 text-2xl">
                Kártya módosítása
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Név</Label>
                <Input
                  id="name-1"
                  name="name"
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                  autoCapitalize="none"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="dropdown">Opciók</Label>
                <Select
                  value={selectedOption}
                  onValueChange={(value) => setSelectedOption(value)}
                >
                  <SelectTrigger
                    id="dropdown"
                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none cursor-pointer mb-6"
                  >
                    <SelectValue placeholder="Válassz..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                    <SelectItem className="cursor-pointer" value="HP">
                      Életerő duplázása
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Damage">
                      Sebzés duplázása
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="text-white cursor-pointer bg-red-600 hover:bg-red-700">
                  Mégse
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Mentés
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDungeon;
