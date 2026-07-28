import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Products from './components/entity/product/Products';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminProducts from './components/admin/AdminProducts';
import { useTheme } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import CartPage from './components/cart/CartPage';
import { CookieConsentProvider } from './context/CookieConsentContext';
import CookieBanner from './components/CookieBanner';

// Wrapper component to apply theme classes
function ThemedApp() {
  const { darkMode } = useTheme();

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}
      >
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CookieConsentProvider>
      <CartProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </CartProvider>
      </CookieConsentProvider>
    </AuthProvider>
  );
}

export default App;
