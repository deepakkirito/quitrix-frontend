import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Nav from "./components/nav";
import Plot from "./components/plot";
import Video from "./components/video";

import './App.css';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path='/' element={<Navigate to='/plot' />}></Route>
          <Route path='/plot' element={<Plot />}></Route>
          <Route path='/video' element={<Video />}></Route>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
