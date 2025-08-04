import React from 'react';
import { Facebook, Instagram, Youtube, Mail, MapPin, X as XIcon } from 'lucide-react';
import { usePackages } from '../context/PackageContext';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  var { packages } = usePackages();
   const navigate = useNavigate();

  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="src/make a move final logo M.png"
                alt="Logo Icon"
                className="h-10 w-10 object-contain"
              />
              <img
                src="src/make_a_move_final_logo_text[1].png"
                alt="Logo Text"
                className="h-8 object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your gateway to unforgettable journeys. We craft personalized travel experiences for every type of explorer, from tranquil getaways to adrenaline filled adventures.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-red-600 hover:bg-red-700 p-2 rounded-full">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full">
                <XIcon className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/makeamove59/?igsh=dWtpMXhzZXNmc3d0#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com/@makeamove-w1d1i?si=FD5kZjQs1QERAwBv" className="bg-red-600 hover:bg-red-700 p-2 rounded-full">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              {['About', 'Packages', 'Travel Blog', 'Customer Reviews', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2 text-gray-300">
              {['Maldives', 'Japan', 'Kenya', 'Iceland'].map((destination) => (
                <li
  key={destination}
  className="cursor-pointer hover:text-white transition-colors"
  onClick={() => {
     
    navigate(`/package/${destination.toLowerCase()}`);
    console.log(`/package/${destination.toLowerCase()}`)
  
  }}
>
  {destination}
</li>

              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-10 w-10 text-red-500 mt-1" />
                <span>
                  #8-2-626/2, Block-B, 3rd floor, BRK Building Banjara Hills, Hyderabad, Telangana, India, 500034
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <img src="src/whitetele.png" alt="Phone" className="h-5 w-5" />
                <span>040 – 31780099</span>
              </div>
              <div className="flex items-center space-x-3">
                <img src="src/whatsappwhiteicon.png" alt="WhatsApp" className="h-5 w-5" />
                <span>+91 9542226777</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-500" />
                <span>info@makeamove.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none"
                />
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-md">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2024 Make A Move. All rights reserved.</p>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
