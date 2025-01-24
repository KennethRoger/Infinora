import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="h-auto min-h-[150px] w-full bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">Infinora</h3>
            <p className="text-gray-300 mb-4">
              Where creativity meets opportunity. Join our vibrant community of
              creators and bring extraordinary ideas to life.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">Create With Us</h3>
            <div className="text-gray-300 space-y-2">
              <p>🎨 Join the Creative Revolution</p>
              <p>📞 +918372344284</p>
              <p>✉️ hello@infinora.com</p>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <MdEmail size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            {new Date().getFullYear()} Infinora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
