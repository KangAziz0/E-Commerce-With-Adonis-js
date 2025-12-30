// App.tsx atau routes file
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Register from "./pages/Register";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        {/* Tambahkan route lainnya */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
