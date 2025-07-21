
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'sidebar'; // New variant prop
  useGradient?: boolean; // Kept for potential future use, though image doesn't use gradient
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'default', useGradient }) => {
  let sizeClasses = "h-10 w-auto"; // Default size

  if (variant === 'sidebar') {
    sizeClasses = "h-8 w-auto"; // Smaller size for sidebar
  }

  return (
    <img
      src="/image/hegiralogo.png"
      alt="Hegira Logo"
      className={`${sizeClasses} ${className || ''}`.trim()}
    />
  );
};

export default Logo;
