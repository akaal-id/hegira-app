/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface RadialProgressProps {
  percentage: number;
  size?: number; // Diameter of the circle
  strokeWidth?: number;
  baseColor?: string; // Tailwind class for the background circle
  progressColor?: string; // Tailwind class for the progress arc
  textColor?: string; // Tailwind class for the text
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  percentage,
  size = 50,
  strokeWidth = 5,
  baseColor = 'stroke-gray-200',
  progressColor = 'stroke-hegra-yellow',
  textColor = 'text-hegra-deep-navy',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className={baseColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.35s ease-out' }}
        />
      </svg>
      <span className={`absolute text-xs font-semibold ${textColor}`} style={{ fontSize: Math.max(8, size / 4.5) }}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default RadialProgress;