import { format as dfFormat, formatDistanceToNow as dfFormatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date object or string into a readable format
 * @param {Date|string|number} date
 * @param {string} [formatStr='MMM dd, yyyy']
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(d)) return 'N/A';
    return dfFormat(d, formatStr);
  } catch {
    return 'N/A';
  }
};

/**
 * Format duration in seconds into human-readable string (e.g., '1h 30m', '45s')
 * @param {number} seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return '0s';
  }
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Truncate text to a specified length and append ellipsis
 * @param {string} text
 * @param {number} [length=100]
 * @returns {string} Truncated string
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Get uppercase initials from a name (e.g., "John Doe" -> "JD")
 * @param {string} name
 * @returns {string} User initials
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Calculate percentage with custom rounding
 * @param {number} part
 * @param {number} total
 * @param {number} [decimals=0]
 * @returns {number} Percentage value between 0 and 100
 */
export const calculatePercentage = (part, total, decimals = 0) => {
  if (!total || total <= 0 || !part || part < 0) return 0;
  const val = (part / total) * 100;
  return Number(Math.min(100, Math.max(0, val)).toFixed(decimals));
};

/**
 * Format numbers with comma separators or compact notations
 * @param {number} num
 * @param {boolean} [compact=false]
 * @returns {string} Formatted number
 */
export const formatNumber = (num, compact = false) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Get relative time string (e.g., "5 minutes ago")
 * @param {Date|string|number} date
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(d)) return 'N/A';
    return dfFormatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'N/A';
  }
};

/**
 * Get Tailwind color styling mappings for different status values
 * @param {string} status
 * @returns {{ badge: string, dot: string, text: string, bg: string }}
 */
export const getStatusColor = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'published':
    case 'active':
    case 'completed':
    case 'passed':
    case 'approved':
    case 'submitted':
      return {
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500',
      };
    case 'pending':
    case 'in_progress':
    case 'review':
    case 'under_review':
    case 'timed':
      return {
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500',
      };
    case 'failed':
    case 'rejected':
    case 'inactive':
    case 'dropped':
    case 'deleted':
    case 'abandoned':
      return {
        badge: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
        dot: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-500',
      };
    case 'draft':
    case 'archived':
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        dot: 'bg-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-500',
      };
  }
};

/**
 * Get Tailwind color styling mappings for difficulty levels
 * @param {string} difficulty
 * @returns {{ badge: string, dot: string, text: string }}
 */
export const getDifficultyColor = (difficulty) => {
  const normalized = (difficulty || '').toLowerCase();
  switch (normalized) {
    case 'easy':
    case 'beginner':
      return {
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'medium':
    case 'intermediate':
      return {
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
      };
    case 'hard':
    case 'advanced':
      return {
        badge: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
        dot: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        dot: 'bg-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
      };
  }
};
