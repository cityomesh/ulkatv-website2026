import React from 'react';
import {
  FaCcPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Payment Icons */}
          <div>
            <h3 className="text-lg font-bold mb-4">We Accept</h3>
            <ul className="flex space-x-4 text-3xl">
              <li><FaCcPaypal className="hover:text-gray-400" /></li>
              <li><FaCcVisa className="hover:text-gray-400" /></li>
              <li><FaCcMastercard className="hover:text-gray-400" /></li>
              <li><FaCcAmex className="hover:text-gray-400" /></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:Surekha@ulka.tv" className="hover:text-gray-400 underline">
                mailsupport@ulka.tv
              </a>
            </p>
            <p className="mb-2">
              Ucast Media Pvt Ltd<br />
              709, 7th Floor, Aditya Trade Center,<br />
              Ameerpet, Hyderabad, Telangana 500038
            </p>
          </div>

          {/* Social Media Icons */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a
                href="https://www.facebook.com/ulka.tv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook className="hover:text-gray-400" />
              </a>
              <a
                href="https://www.instagram.com/ulka.tv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-gray-400" />
              </a>
              <a
                href="https://twitter.com/ulka_tv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter className="hover:text-gray-400" />
              </a>
              <a
                href="https://www.linkedin.com/company/ulka-tv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="hover:text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
