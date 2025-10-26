import React, { useState, useEffect } from "react";

export default function VideoRecordingNotice({ 
  position = "top-right", 
  autoHide = true, 
  variant = "standard",
  isReturningPlayer = false 
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 8000); // Auto-minimize after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4", 
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  };

  // Different messages based on variant and player type
  const getContent = () => {
    if (variant === "login" && !isReturningPlayer) {
      return {
        title: "AI Shot Verification Active",
        description: "All shots recorded & verified by AI for prizes and keepsakes. Your privacy is protected."
      };
    } else if (variant === "login" && isReturningPlayer) {
      return {
        title: "Shot Recording & AI Verification",
        description: "Continuing AI-powered shot analysis for your session."
      };
    } else if (variant === "powerful") {
      return {
        title: "AI-Powered Shot Analysis",
        description: "Advanced AI technology records and verifies every shot for accuracy and prizes."
      };
    } else {
      return {
        title: "Shot Recording Active",
        description: "All shots are recorded for verification and as keepsakes. Your privacy is protected."
      };
    }
  };

  const content = getContent();

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ease-in-out`}>
      <div className={`bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg text-white text-xs
                      ${isMinimized ? 'p-2 max-w-[100px]' : 'p-3 max-w-[280px]'}
                      shadow-lg shadow-red-500/20`}>
        
        {/* Minimized state - just icon */}
        {isMinimized ? (
          <div 
            onClick={() => setIsMinimized(false)}
            className="flex items-center justify-center cursor-pointer hover:opacity-80"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        ) : (
          /* Full state */
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-[10px]">{content.title}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white/60 hover:text-white text-xs leading-none"
                  aria-label="Minimize"
                >
                  −
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white/60 hover:text-white text-xs leading-none ml-1"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-[10px] text-white/80 leading-tight">
              {content.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
