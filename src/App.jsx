import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Lobby from "./components/Lobby.jsx";
import Game from "./components/Game.jsx";
import Results from "./components/Results.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    {/* Público */}
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protegidas */}
                    <Route
                        path="/lobby"
                        element={
                            <ProtectedRoute>
                                <Lobby />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/game"
                        element={
                            <ProtectedRoute>
                                <Game />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/results"
                        element={
                            <ProtectedRoute>
                                <Results />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;