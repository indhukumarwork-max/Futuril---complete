'use client';

import { forwardRef } from 'react';
import { PointLight } from 'three';

/** Soft white point light for idle glow, animated by parent component */
const KikiGlow = forwardRef<PointLight>((_, ref) => (
  <pointLight
    ref={ref}
    position={[0, 1.5, 0]}
    color="#ffffff"
    intensity={0.7}
    distance={5}
  />
));

export default KikiGlow;
