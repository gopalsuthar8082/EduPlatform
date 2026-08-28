import React, { useState } from 'react';

/**
 * Avatar Component
 * Displays user profile image or initials with color-coded avatar background and status indicators
 */
const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate 1-2 initials from name
  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate deterministic color from name string
  const getAvatarColor = (str) => {
    const colors = [
      'bg-indigo-500 text-white',
      'bg-emerald-500 text-white',
      'bg-blue-500 text-white',
      'bg-amber-500 text-white',
      'bg-purple-500 text-white',
      'bg-rose-500 text-white',
      'bg-cyan-500 text-white',
      'bg-violet-500 text-white',
      'bg-teal-500 text-white'
    ];

    if (!str) return colors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold'
  };

  const statusSizes = {
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2'
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500'
  };

  const showImage = src && !imageError;
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`
            ${sizes[size] || sizes.md}
            rounded-full object-cover shadow-xs ring-1 ring-gray-200
          `}
        />
      ) : (
        <div
          className={`
            ${sizes[size] || sizes.md}
            ${colorClass}
            rounded-full flex items-center justify-center shadow-xs select-none
          `}
        >
          <span>{initials}</span>
        </div>
      )}

      {/* Online/Offline Status indicator */}
      {status && statusColors[status] && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full ring-white
            ${statusSizes[size] || statusSizes.md}
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
