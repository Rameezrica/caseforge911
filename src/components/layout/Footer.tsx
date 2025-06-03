import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Briefcase className="h-8 w-8 mr-2 text-yellow-400" />
              <span className="text-xl font-bold text-white">CaseForge</span>
            </div>
            <p className="text-sm mb-4">
              The platform where business students practice real-world cases, sharpen strategic thinking, and build problem-solving skills.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/problems?category=Strategy" className="hover:text-white transition-colors duration-200">Strategy & Consulting</Link></li>
              <li><Link to="/problems?category=Finance" className="hover:text-white transition-colors duration-200">Finance & Investment</Link></li>
              <li><Link to="/problems?category=Operations" className="hover:text-white transition-colors duration-200">Operations & Supply Chain</Link></li>
              <li><Link to="/problems?category=Marketing" className="hover:text-white transition-colors duration-200">Marketing & Growth</Link></li>
              <li><Link to="/problems?category=Entrepreneurship" className="hover:text-white transition-colors duration-200">Entrepreneurship</Link></li>
              <li><Link to="/problems?category=DataAnalysis" className="hover:text-white transition-colors duration-200">Data Analysis</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/resources" className="hover:text-white transition-colors duration-200">Frameworks Library</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors duration-200">Case Interview Blog</Link></li>
              <li><Link to="/tutorials" className="hover:text-white transition-colors duration-200">Tutorials</Link></li>
              <li><Link to="/webinars" className="hover:text-white transition-colors duration-200">Webinars</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} CaseForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;