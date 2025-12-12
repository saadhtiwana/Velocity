import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1 - Platform */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link to="/cars" className="text-sm text-gray-600 hover:text-gray-900">Browse Cars</Link></li>
              <li><Link to="/bookings" className="text-sm text-gray-600 hover:text-gray-900">My Bookings</Link></li>
            </ul>
          </div>

          {/* Column 2 - Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Safety</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Insurance</Link></li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Press</Link></li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Cookies</Link></li>
            </ul>
          </div>

          {/* Column 5 - Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600">Islamabad, Pakistan</li>
              <li><a href="mailto:support@velocity.com" className="text-sm text-gray-600 hover:text-gray-900">support@velocity.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="velocity-logo text-lg">VELOCITY</span>
          </div>
          <p className="text-xs text-gray-500">© {currentYear} Velocity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
