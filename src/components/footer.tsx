"use client";
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="font-bold bg-blue-500 fixed bottom-0 w-full h-[100px]">
      <div className="flex justify-between text-[20px] items-center max-w-[1200px] h-[75px] mx-auto transition-all duration-300 px-4">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-100">Open Data</p>
          <p className="text-xs text-white font-normal">
            © {currentYear} Open Data Platform. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-800 transition-colors duration-200"
            aria-label="GitHub"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-800 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-800 transition-colors duration-200"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>
        </div>

        <div className="text-right">
          <p className="text-sm text-white font-normal">
            Made with ❤️ for Open Data
          </p>
        </div>
      </div>
    </div>
  );
};
