import React from 'react';
import { Composition } from 'remotion';
import { Stack } from './components/Stack';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StackAnimation"
        component={Stack}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          items: [1, 2, 3, 4, 5],
        }}
      />
    </>
  );
};

