import React, { useMemo } from 'react';

interface MalaTrackerProps {
  progress: number; // 0 to 108
}

export const MalaTracker: React.FC<MalaTrackerProps> = ({ progress }) => {
  const beads = useMemo(() => {
    const items = [];
    const totalBeads = 108;
    const radius = 140;
    const center = 160;
    
    for (let i = 0; i < totalBeads; i++) {
      const angle = (i / totalBeads) * 2 * Math.PI - Math.PI / 2; // Start from top
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      const isCompleted = i < progress;
      const isMilestone = [7, 21, 40, 60, 90, 108].includes(i + 1);
      
      items.push({
        id: i + 1,
        cx: x,
        cy: y,
        r: isMilestone ? 6 : 3,
        fill: isCompleted 
          ? (isMilestone ? '#92400E' : '#B45309') // Dark Amber/Brown for completed
          : '#D6CEB9', // Light Beige/Grey for remaining
        stroke: isCompleted ? '#FCD34D' : '#A8A29E',
        glow: isCompleted && i === progress - 1
      });
    }
    return items;
  }, [progress]);

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-square flex items-center justify-center my-6">
      <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-xl">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* String */}
        <circle cx="160" cy="160" r="140" fill="none" stroke="#78350F" strokeWidth="1" className="opacity-30" />
        
        {/* Beads */}
        {beads.map((bead) => (
          <circle
            key={bead.id}
            cx={bead.cx}
            cy={bead.cy}
            r={bead.r}
            fill={bead.fill}
            stroke={bead.stroke}
            strokeWidth={0.5}
            filter={bead.glow ? 'url(#glow)' : undefined}
            className="transition-all duration-1000 ease-out"
          />
        ))}

        {/* Center Om */}
        <foreignObject x="110" y="110" width="100" height="100">
          <div className="flex items-center justify-center h-full w-full text-brahma-dark">
            <span className="text-6xl font-hindi drop-shadow-md">ॐ</span>
          </div>
        </foreignObject>
      </svg>
      
      <div className="absolute -bottom-2 left-0 right-0 text-center flex justify-center gap-6 text-xs text-stone-500">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-amber-700"></div>
           <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-[#D6CEB9]"></div>
           <span>Remaining</span>
        </div>
      </div>
    </div>
  );
};