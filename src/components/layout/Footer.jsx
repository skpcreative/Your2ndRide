
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Company', links: [{ name: 'About Us', path: '/about' }, { name: 'Contact Us', path: '/contact' }, { name: 'Careers', path: '/careers' }] },
    { title: 'Support', links: [{ name: 'FAQ', path: '/faq' }, { name: 'Help Center', path: '/help' }, { name: 'Terms of Service', path: '/terms' }] },
    { title: 'Connect', links: [{ name: 'Blog', path: '/blog' }, { name: 'Newsletter', path: '/newsletter' }] },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, path: 'https://facebook.com', name: 'Facebook' },
    { icon: <Twitter className="w-6 h-6" />, path: 'https://twitter.com', name: 'Twitter' },
    { icon: <Instagram className="w-6 h-6" />, path: 'https://instagram.com', name: 'Instagram' },
    { icon: <Linkedin className="w-6 h-6" />, path: 'https://linkedin.com', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-900 text-gray-400 py-12 border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mb-4">
              <Car className="w-7 h-7 text-purple-400" />
              <span>Your2ndRide</span>
            </Link>
            <p className="text-sm">Your trusted platform for buying and selling pre-owned vehicles. Drive your dreams with us.</p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-gray-200 mb-4">{section.title}</p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="hover:text-purple-400 transition-colors duration-300 text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; {currentYear} Your2ndRide. All rights reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.path} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="hover:text-purple-400 transition-colors duration-300">
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
