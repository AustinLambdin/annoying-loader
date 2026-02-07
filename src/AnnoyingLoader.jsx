import { useState, useEffect, useRef, useCallback } from "react";

const CELEBRATIONS = [
  "HECK YEAH! 🔥",
  "LET'S GOOO!",
  "UNSTOPPABLE! 💪",
  "YOU'RE CRACKED!",
  "EZ CLAP! 👏",
  "BUILT DIFFERENT!",
  "SHEEEESH! 🥶",
  "NO WAY! 😱",
  "POGGERS!",
  "BIG W! 🏆",
  "GOATED! 🐐",
  "CERTIFIED GAMER!",
];

const MESSAGES = {
  0: "Click the button to begin loading...",
  10: "This is easy, right?",
  20: "You're doing great! Keep going!",
  30: "Hmm, did the button get smaller?",
  40: "No no, you're imagining things...",
  50: "Halfway there! You got this! ...probably.",
  60: "Okay it's DEFINITELY moving now.",
  65: "Why are you still trying?",
  70: "The button fears you.",
  75: "It's getting personal.",
  80: "Almost there! (that's what they all say)",
  85: "The button has achieved sentience.",
  90: "YOUR DETERMINATION IS... CONCERNING.",
  95: "THE END IS NEAR... OR IS IT?",
  98: "ONE. MORE. CLICK.",
  99: "...",
};

const Confetti = ({ count = 30 }) => {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    color: ["#ff006e", "#ffbe0b", "#00f5d4", "#8338ec", "#3a86ff", "#fb5607"][
      Math.floor(Math.random() * 6)
    ],
    rotation: Math.random() * 720 - 360,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

const CelebrationText = ({ text }) => (
  <div
    className="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
    style={{ animation: "celebPop 0.8s ease-out forwards" }}
  >
    <div
      className="text-6xl font-black tracking-tight"
      style={{
        fontFamily: "'Bangers', cursive",
        color: "#ffbe0b",
        textShadow:
          "3px 3px 0 #ff006e, -2px -2px 0 #3a86ff, 0 0 40px rgba(255,190,11,0.5)",
        WebkitTextStroke: "1px rgba(0,0,0,0.3)",
      }}
    >
      {text}
    </div>
  </div>
);

const FakeBSOD = ({ onDismiss }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-8 cursor-pointer"
    style={{ backgroundColor: "#0078d7", animation: "bsodIn 0.15s ease-out" }}
    onClick={onDismiss}
  >
    <div className="max-w-2xl text-white" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="text-8xl mb-8">:(</div>
      <div className="text-2xl mb-4">
        Your PC ran into a problem and needs to restart. We're just collecting some error info, and
        then we'll restart for you.
      </div>
      <div className="text-lg mt-8 opacity-70">0% complete</div>
      <div className="mt-12 text-sm opacity-50">
        <p>Stop code: LOADING_BAR_COMPLETED_SUCCESSFULLY</p>
        <p className="mt-2">If you'd like to know more, search online for: WHY_DID_I_TRUST_THIS_WEBSITE</p>
      </div>
      <div className="mt-8 text-xs opacity-30">(click anywhere to dismiss... or don't. we don't care.)</div>
    </div>
  </div>
);

const getMessage = (progress) => {
  let msg = MESSAGES[0];
  for (const [threshold, text] of Object.entries(MESSAGES)) {
    if (progress >= parseInt(threshold)) msg = text;
  }
  return msg;
};

const getButtonStyle = (progress) => {
  const baseSize = 220;
  const minSize = 28;
  const size = Math.max(minSize, baseSize - progress * 2.2);
  const fontSize = Math.max(10, 18 - progress * 0.12);
  const chaos = Math.min(1, progress / 100);

  return { size, fontSize, chaos };
};

export default function AnnoyingLoader() {
  const [progress, setProgress] = useState(0);
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });
  const [celebration, setCelebration] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [ending, setEnding] = useState(null);
  const [hueRotate, setHueRotate] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef(null);
  const dodgeTimerRef = useRef(null);
  const celebTimerRef = useRef(null);

  const moveButton = useCallback(
    (intensity = 1) => {
      const padding = 15;
      const x = padding + Math.random() * (100 - padding * 2);
      const y = 30 + Math.random() * 50;
      setButtonPos({ x, y });
    },
    []
  );

  const triggerCelebration = useCallback(() => {
    const text = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
    setCelebration(text);
    setShowConfetti(true);
    if (celebTimerRef.current) clearTimeout(celebTimerRef.current);
    celebTimerRef.current = setTimeout(() => {
      setCelebration(null);
      setShowConfetti(false);
    }, 1200);
  }, []);

  const triggerEnding = useCallback(() => {
    const endings = ["bsod", "reset", "rickroll"];
    const chosen = endings[Math.floor(Math.random() * endings.length)];

    if (chosen === "rickroll") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      setTimeout(() => {
        setEnding("rickroll");
      }, 500);
    } else {
      setEnding(chosen);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!started) setStarted(true);
    if (ending) return;

    const increment = Math.max(1, Math.floor(5 - progress * 0.04));
    const newProgress = Math.min(100, progress + increment);

    setProgress(newProgress);
    setClickCount((c) => c + 1);

    if (
      newProgress % 10 === 0 ||
      newProgress === 25 ||
      newProgress === 50 ||
      newProgress === 75 ||
      newProgress === 99 ||
      Math.random() < 0.15
    ) {
      triggerCelebration();
    }

    if (newProgress > 80) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
    }
    if (newProgress > 60) {
      setHueRotate(Math.random() * 30 - 15);
    }

    if (newProgress > 25) {
      moveButton();
    }

    if (newProgress >= 100) {
      setTimeout(() => triggerEnding(), 800);
    }
  }, [progress, started, ending, moveButton, triggerCelebration, triggerEnding]);

  const handleMouseApproach = useCallback(() => {
    if (progress > 55 && Math.random() < Math.min(0.7, (progress - 55) * 0.02)) {
      moveButton();
    }
  }, [progress, moveButton]);

  useEffect(() => {
    if (progress > 85 && started && !ending) {
      dodgeTimerRef.current = setInterval(() => {
        if (Math.random() < 0.3) moveButton();
      }, 1500);
      return () => clearInterval(dodgeTimerRef.current);
    }
  }, [progress, started, ending, moveButton]);

  const dismissEnding = () => {
    setEnding(null);
    setProgress(0);
    setClickCount(0);
    setStarted(false);
    setButtonPos({ x: 50, y: 50 });
    setMissCount(0);
  };

  const { size, fontSize, chaos } = getButtonStyle(progress);

  const bgGradient =
    progress < 50
      ? "from-slate-950 via-gray-900 to-slate-950"
      : progress < 80
      ? "from-slate-950 via-indigo-950 to-slate-950"
      : "from-slate-950 via-red-950 to-slate-950";

  const progressColor =
    progress < 50 ? "#00f5d4" : progress < 80 ? "#ffbe0b" : "#ff006e";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Space+Mono:wght@400;700&family=Outfit:wght@300;500;700;900&display=swap');

        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebPop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes bsodIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,245,212,0.3); }
          50% { box-shadow: 0 0 40px rgba(0,245,212,0.6), 0 0 80px rgba(0,245,212,0.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-8px, 4px); }
          20% { transform: translate(6px, -6px); }
          30% { transform: translate(-4px, 8px); }
          40% { transform: translate(8px, -2px); }
          50% { transform: translate(-6px, -4px); }
          60% { transform: translate(4px, 6px); }
          70% { transform: translate(-8px, -8px); }
          80% { transform: translate(6px, 4px); }
          90% { transform: translate(-2px, -6px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(255,0,110,0.2); }
          50% { border-color: rgba(255,0,110,0.8); }
        }
        .btn-target {
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-target:hover {
          transform: scale(1.05);
        }
        .btn-target:active {
          transform: scale(0.95);
        }
        .progress-track {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>

      {ending === "bsod" && <FakeBSOD onDismiss={dismissEnding} />}
      {showConfetti && <Confetti />}
      {celebration && <CelebrationText text={celebration} />}

      {ending === "reset" && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer"
          onClick={dismissEnding}
        >
          <div
            className="text-5xl font-black mb-6"
            style={{ fontFamily: "'Bangers', cursive", color: "#ff006e" }}
          >
            OOPS!
          </div>
          <div className="text-white text-xl opacity-70 mb-2" style={{ fontFamily: "'Space Mono'" }}>
            Something went wrong. Progress has been reset.
          </div>
          <div className="text-white text-sm opacity-30 mt-8" style={{ fontFamily: "'Space Mono'" }}>
            (click to try again... if you dare)
          </div>
        </div>
      )}

      {ending === "rickroll" && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer"
          onClick={dismissEnding}
        >
          <div
            className="text-5xl font-black mb-6"
            style={{ fontFamily: "'Bangers', cursive", color: "#ffbe0b" }}
          >
            🎵 YOU KNOW THE RULES 🎵
          </div>
          <div className="text-white text-xl opacity-70" style={{ fontFamily: "'Space Mono'" }}>
            ...and so do I.
          </div>
          <div className="text-white text-sm opacity-30 mt-8" style={{ fontFamily: "'Space Mono'" }}>
            (click to try again)
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-between relative overflow-hidden select-none`}
        style={{
          fontFamily: "'Outfit', sans-serif",
          animation: screenShake ? "shake 0.3s ease-in-out" : "none",
          filter: `hue-rotate(${hueRotate}deg)`,
          transition: "filter 0.5s ease",
        }}
        onClick={() => {
          if (started && progress > 30) {
            setMissCount((c) => c + 1);
          }
        }}
      >
        {/* Scanline effect at high progress */}
        {progress > 70 && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
            }}
          >
            <div
              className="absolute w-full h-[30%] left-0"
              style={{
                background:
                  "linear-gradient(transparent, rgba(255,255,255,0.03), transparent)",
                animation: "scanline 3s linear infinite",
              }}
            />
          </div>
        )}

        {/* Decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top section */}
        <div className="w-full max-w-xl mx-auto pt-16 px-6 text-center z-20">
          <h1
            className="text-5xl font-black tracking-tight mb-2"
            style={{
              fontFamily: "'Bangers', cursive",
              color: "#fff",
              letterSpacing: "2px",
              textShadow: `0 0 30px ${progressColor}40`,
            }}
          >
            SUPER LOADER
            <span className="text-xs align-super ml-1 opacity-40" style={{ fontFamily: "'Space Mono'" }}>
              v6.9
            </span>
          </h1>
          <p className="text-white/30 text-xs mb-10" style={{ fontFamily: "'Space Mono'" }}>
            100% Guaranteed Loading Experience™
          </p>

          {/* Progress bar */}
          <div className="progress-track rounded-full h-8 w-full relative overflow-hidden mb-3">
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${progressColor}, ${
                  progress > 80 ? "#ff006e" : progressColor
                })`,
                transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 0 20px ${progressColor}60, inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 16px)",
                  animation: "none",
                }}
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{
                fontFamily: "'Space Mono'",
                color: progress > 45 ? "#000" : "#fff",
                mixBlendMode: progress > 45 ? "normal" : "normal",
                textShadow: progress > 45 ? "none" : `0 0 10px ${progressColor}`,
              }}
            >
              {progress}%
            </div>
          </div>

          {/* Status message */}
          <div
            className="h-8 flex items-center justify-center"
            style={{
              fontFamily: "'Space Mono'",
              fontSize: "13px",
              color: progress > 80 ? "#ff006e" : progress > 50 ? "#ffbe0b" : "#00f5d4",
              opacity: 0.8,
              animation: progress > 90 ? "shake 0.5s ease-in-out infinite" : "none",
            }}
          >
            {getMessage(progress)}
          </div>

          {missCount > 5 && started && (
            <div
              className="text-xs mt-1"
              style={{ fontFamily: "'Space Mono'", color: "#ff006e", opacity: 0.5 }}
            >
              Misses: {missCount} {missCount > 15 ? "💀" : missCount > 10 ? "😬" : ""}
            </div>
          )}
        </div>

        {/* Button area */}
        <div className="flex-1 w-full relative z-20" style={{ minHeight: "300px" }}>
          <button
            className="btn-target absolute rounded-full font-bold text-black border-none cursor-pointer"
            style={{
              left: `${buttonPos.x}%`,
              top: `${buttonPos.y}%`,
              transform: "translate(-50%, -50%)",
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${fontSize}px`,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${progressColor}, ${
                progress > 70 ? "#ff006e" : "#3a86ff"
              })`,
              boxShadow: `0 0 ${20 + progress * 0.3}px ${progressColor}50, 0 4px 15px rgba(0,0,0,0.3)`,
              animation:
                progress > 40 && progress < 100
                  ? `float ${Math.max(0.8, 2 - progress * 0.01)}s ease-in-out infinite`
                  : progress < 5
                  ? "pulse-glow 2s ease-in-out infinite"
                  : "none",
              border: progress > 90 ? "2px solid #ff006e" : "2px solid transparent",
              letterSpacing: size < 60 ? "0" : "1px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            onMouseEnter={handleMouseApproach}
          >
            {progress >= 99
              ? "!"
              : progress >= 90
              ? "⚡"
              : progress >= 70
              ? "CLICK"
              : progress >= 50
              ? "CLICK ME"
              : started
              ? "CLICK ME!"
              : "START"}
          </button>
        </div>

        {/* Bottom stats */}
        <div className="w-full max-w-xl mx-auto pb-8 px-6 z-20">
          <div
            className="flex justify-between items-center text-xs"
            style={{
              fontFamily: "'Space Mono'",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            <span>Clicks: {clickCount}</span>
            <span>
              Difficulty:{" "}
              {progress < 30
                ? "😊 Easy"
                : progress < 50
                ? "😐 Medium"
                : progress < 70
                ? "😤 Hard"
                : progress < 90
                ? "🤬 Brutal"
                : "💀 Impossible"}
            </span>
          </div>
          <div className="text-center mt-4">
            <span
              className="text-xs"
              style={{
                fontFamily: "'Space Mono'",
                color: "rgba(255,255,255,0.08)",
              }}
            >
              We apologize for the inconvenience.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
