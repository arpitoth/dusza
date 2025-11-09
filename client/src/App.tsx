import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./components/Authentication";
import MainMenu from "./components/MainMenu";
import NewGame from "./components/NewGame";
import LoadGame from "./components/LoadGame";
import AddCard from "./components/AddCard";
import AddDungeon from "./components/AddDungeon";
import AddPlayerCards from "./components/AddPlayerCards";
import GamePlay from "./components/GamePlay";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/main" element={<MainMenu />} />
        <Route path="/newgame" element={<NewGame />} />
        <Route path="/loadgame" element={<LoadGame/>} />
        <Route path="/game/:gameId" element={<AddCard />} />
        <Route path="/game/:gameId/addDungeon" element={<AddDungeon />} />
        <Route path="/game/:gameId/addPlayerCards" element={<AddPlayerCards />} />
        <Route path="/game/:gameId/gamePlay" element={<GamePlay />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
