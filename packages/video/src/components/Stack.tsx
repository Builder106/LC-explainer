import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export const Stack: React.FC<{ items: number[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 20 }}>
        {items.map((item, index) => {
            // Stagger animations by index
            const delay = index * 15;
            
            const progress = spring({
                frame: frame - delay,
                fps,
                config: {
                    damping: 200,
                },
            });

            const translateY = interpolate(progress, [0, 1], [100, 0]);
            const opacity = interpolate(progress, [0, 1], [0, 1]);

            return (
                <div
                    key={index}
                    style={{
                        width: 200,
                        height: 60,
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                        opacity,
                        transform: `translateY(${translateY}px)`,
                    }}
                >
                    {item}
                </div>
            );
        })}
      </div>
    </AbsoluteFill>
  );
};

