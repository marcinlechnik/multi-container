import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { OtherPage } from "./OtherPage";
import { MainPage } from "./MainPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/other-page" element={<OtherPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
