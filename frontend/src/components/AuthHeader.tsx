import React from "react";

const AuthHeader: React.FC = () => {
  return (
    <div className="absolute top-6 left-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
        <img
          src="/icon.png"
          alt="Memory Gallery Logo"
          className="w-8 h-8 object-contain"
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <span className="hidden text-white font-bold text-lg">MG</span>
      </div>
      <div className="text-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Memory Gallery
        </h1>
        <p className="text-xs text-gray-500 -mt-1">
          Your Photos, Your Memories
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
