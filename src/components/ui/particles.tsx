import React, { useEffect, useState, memo, JSX } from "react";

const Particles = () => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generatedParticles = [...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-blue-500 opacity-30 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        }}
      />
    ));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  );
};

export default memo(Particles);
