import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./components/Authentication";
import MainMenu from "./components/MainMenu";
import NewGame from "./components/NewGame";
import LoadGame from "./components/LoadGame";
import Game from "./components/Game";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/main" element={<MainMenu />} />
        <Route path="/newgame" element={<NewGame />} />
        <Route path="/loadgame" element={<LoadGame/>} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
