import React from 'react';
import { Plane, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, X,XIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
              src="src/make a move final logo M.png"
              alt="Make A Move Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
              />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 'bold' }}>
              <img
                src="src/make_a_move_final_logo_text[1].png"
                alt="Make A Move Logo"
                className="h-6 w-auto sm:h-8 md:h-10 object-contain"
              />
              </span>
            </div>
 <div className="w-full px-4 sm:px-6 lg:px-8" style={{ marginLeft: '-25px' }}>
  <p className="text-gray-300 text-sm sm:text-base md:text-lg xl:text-2xl leading-relaxed max-w-3xl">
      Your gateway to unforgettable journeys. We craft personalized travel experiences for every type of explorer, from tranquil getaways to adrenaline filled adventures.
</p>
</div>


            <div className="flex space-x-4">
              <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors">
                <XIcon className="h-5 w-5" />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Packages', 'Travel Blog', 'Customer Reviews', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
     
          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
                {['Maldives', 'Swiss Alps', 'Japan', 'Kenya Safari', 'Greek Islands', 'Iceland'].map((destination) => (
                <li key={destination}>
                  <a href={`/package/${destination}`} className="text-gray-300 hover:text-white transition-colors">
                    {destination}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-10 w-10 text-red-600" />
                <span className="text-gray-300">#8-2-626/2, Block-B, 3rd floor,BRK Building Banjara Hills,Hyderabad,telangana,india, 500034</span>
              </div>
              <div className="flex items-center space-x-3">
                {/* WhatsApp Icon (using lucide-react's 'Plane' as placeholder, replace with actual WhatsApp icon if available) */}
                <img src="src/whitetele.png" alt="WhatsApp" className="h-5 w-5 text-green-600" />
                <span className="text-gray-300">040 – 31780099</span>
                </div>
                <div className="flex items-center space-x-3">
                <img src="src/whatsappwhiteicon.png" alt="WhatsApp" className="h-5 w-5 text-green-600" />
                <span className="text-gray-300">+91 9542226777</span>
                </div>
                
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <span className="text-gray-300">info@makeamove.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-red-600"
                />
                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-lg transition-colors"
                  aria-label="Subscribe to newsletter"
                  title="Subscribe to newsletter"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Make A Move. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;