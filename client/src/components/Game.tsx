import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nocard, setNocard] = useState(false);
  const [opendialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:5136/api/game/cardslist");
        const data = await res.json();
        setCards(data);
      } catch (err: any) {
        setNocard(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    if (!loading && cards.length === 0) {
      setError("Nincsenek kártyák. Hozz létre néhányat!");
      setNocard(true);
    } else {
      setNocard(false);
      setError("");
    }
  }, [loading, cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const card = {
      Name: formData.get("name"),
      Damage: Number(formData.get("damage")),
      Health: Number(formData.get("health")),
      CardType: selectedOption,
    };

    handleSave(card);
    setOpenDialog(false);
  };

  const handleSave = async (card: any) => {
    const res = await fetch("http://localhost:5136/api/game/addcard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });

    if (!res.ok) {
      console.log("Sikertelen mentés.");
      return;
    }

    console.log("Kártya elmentve.");
  };

  const Reload = () => {
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:5136/api/game/deletecard/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        console.log("Sikertelen törlés.");
        return;
      }

      // Ha sikeres, frissítjük a state-et, hogy eltűnjön a törölt kártya
      setCards(cards.filter((c) => c.id !== id));
    } catch (err) {
      console.log("Hiba a törlés során:", err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 max-w-lg min-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Kártyák</h1>
          <div className="h-50 overflow-y-auto p-4 custom-scrollbar">
            {loading && <p className="text-center">Egy pillanat...</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            <ul className="flex flex-wrap gap-4">
              {error && <p className="text-red-400 text-center mb-6"></p>}

              {cards.map((c) => (
                <li
                  key={c.id}
                  className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer w-[calc(50%-0.5rem)] text-center"
                >
                  <span className="text-lg font-bold">Név: {c.name}</span> <br />
                  Sebzés: {c.damage} <br />
                  Életerő: {c.hp} <br />
                  <span className="mb-4">Típus: {c.cardType}</span> <br />
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded mt-5"
                  >Törlés</button>
                </li>
              ))}
            </ul>
            <Dialog open={opendialog} onOpenChange={setOpenDialog}>
              <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 text-white border-none">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="mb-4 text-2xl">
                      Új kártya
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
                      <Label htmlFor="damage-1">Sebzés</Label>
                      <Input
                        type="number"
                        id="damage-1"
                        name="damage"
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                        autoCapitalize="none"
                        min={2}
                        max={100}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="health-1">Életerő</Label>
                      <Input
                        type="number"
                        id="health-1"
                        name="health"
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                        autoCapitalize="none"
                        min={1}
                        max={100}
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
                          <SelectItem className="cursor-pointer" value="Tűz">
                            Tűz
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="Víz">
                            Víz
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="Levegő">
                            Levegő
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="Föld">
                            Föld
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
                      onClick={Reload}
                    >
                      Mentés
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <button
            disabled={loading}
            onClick={() => {
              setOpenDialog(true);
            }}
            className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 cursor-pointer mb-6"
          >
            {loading ? "Feldolgozás..." : "Új kártya létrehozása"}
          </button>
          <div>
            <button
              disabled={loading || nocard}
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Feldolgozás..." : "Tovább a kiválasztáshoz"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
