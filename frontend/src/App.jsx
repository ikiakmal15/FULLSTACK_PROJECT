import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function App(){
    return (
        <Router>
            <Routes>
                {/* Rute Polosan Autentikasi dikoding oleh MUA */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rute Beranda Utama Terbungkus Layouting Navbar & Footer */}
                <Route path="/" element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                } />
            </Routes>
        </Router>
    );
}

export default App;