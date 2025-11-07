import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./components/Authentication"
import MainMenu from "./components/MainMenu"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/main" element={<MainMenu />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
