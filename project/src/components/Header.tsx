import React, { useState, useEffect, act } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, BookOpen, LogOut, Shield, NotebookTabs, Ship, HeartHandshake,DollarSign ,HandCoins } from 'lucide-react';
import { Plane, Building2, Home, Palmtree, Train, Bus, Car, CreditCard, MapPin , } from 'lucide-react';
import { useAuth } from '../firebase/authcontext.tsx';
import AuthModal from '../firebase/AuthModal.tsx';
import { signOut } from '../firebase/firebaseservices.ts';


interface HeaderProps {
  activeTab: string | null;
 setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
 const { currentUser, userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { name: 'Flights', icon: Plane },
    { name: 'Hotels', icon: Building2 },
    // { name: 'Homestays', icon: Home },
    { name: 'Packages', icon: Palmtree },
      {name: 'Cruise', icon: Ship},
    { name: 'Trains', icon: Train },
    { name: 'Buses', icon: Bus },
    { name: 'Cabs', icon: Car },
    { name: 'Visa', icon: CreditCard },
    { name: 'ForexCard', icon: HandCoins},
    { name: 'Insurance', icon: Shield },
    { name: 'Help', icon: HeartHandshake },
   
  ];
 const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
useEffect(() => {
      const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white shadow-lg' : 'bg-white shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full left-5 right-5">
          <Link to="/" className="flex items-center space-x-3">
            <img src="src/make a move final logo M.png" alt="Logo" className="h-10 w-15 object-contain"  />
            {/* <img src="src/make a move final LOGO.png" alt="Logo" className="h-10 w-15 object-contain"  /> */}
            {/* <img src="src/make_a_move_final_logo_text[1].png" alt="Logo Text" className="h-10 w-10 object-contain" /> */}
          </Link>

          <nav className="hidden md:flex items-center space-x-6" >
            <div className="flex flex-1 justify-between items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
              
                return (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.name === "Help") {
                          navigate("/contact");
                        }else if(item.name==="Packages"){
                          navigate("/packages");
                        }
                        else {
                          setActiveTab(item.name);
                        }
                      }}
                      className={`flex flex-col items-center px-2 py-1 rounded-lg transition ${
                        activeTab === item.name ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <Icon size={18} />
                      <span className="text-xs truncate">{item.name}</span>
                    </button>
                );
              })}
               {currentUser ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <span>{userProfile?.name?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{userProfile?.name || currentUser.email?.split('@')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link to="/ProfilePage" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <User size={16} /> <span className="ml-2">Profile</span>
                    </Link>
                    <Link to="/Dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <BookOpen size={16} /> <span className="ml-2">My Bookings</span>
                    </Link>
                    {userProfile?.userType === 'sales' && (
                      <Link to="/sales" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50">
                        <Shield size={16} /> <span className="ml-2">Sales Dashboard</span>
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleSignOut} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full">
                      <LogOut size={16} /> <span className="ml-2">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex items-center space-x-2 ${isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'}`}>
                {/* <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="font-bold hover:text-red-600">Login</button> */}
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="bg-red-600 text-white px-2 py-2 rounded-lg font-bold hover:bg-red-700 text-s"
                >
                  Login / Sign Up
                </button></div>
            )}
            </div>

            {/* <Link
              to="/contact"
              className={`font-bold transition hover:text-red-600 ${isScrolled || !isHomePage ? 'text-gray-700' : 'text-white'} ${location.pathname === '/contact' ? 'text-red-600' : ''}`}
            >
              Contact
            </Link> */}

           
          </nav>
         
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 w-full space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => { if (item.name === "Help") {
                          navigate("/contact");
                        }else if(item.name==="Packages"){
                          navigate("/packages");
                        } setActiveTab(item.name); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center p-2 rounded-lg ${
                      activeTab === item.name ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs">{item.name}</span>
                  </button>
                );
              })}
            </div>
            <hr />
            {currentUser ? (
              <div className="space-y-2">
                <Link to="/ProfilePage" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600">Profile</Link>
                <Link to="/Dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600">My Bookings</Link>
                {userProfile?.userType === 'sales' && (
                  <Link to="/sales" onClick={() => setIsMenuOpen(false)} className="block py-2 text-purple-600 hover:text-purple-800">Sales Dashboard</Link>
                )}
                <button onClick={handleSignOut} className="block w-full text-left py-2 text-red-600 hover:text-red-800">Sign Out</button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); setIsMenuOpen(false); }} className="text-gray-700 hover:text-red-600">Login</button>
                <button onClick={() => { setAuthMode('signup'); setShowAuthModal(true); setIsMenuOpen(false); }} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} />
    </header>
  );
  // Ensure activeTab is set to a default value if not defined
};

export default Header;
