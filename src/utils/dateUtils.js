import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDateTime = (dateString, formatStr = 'MMM d, yyyy HH:mm') => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Invalid date';
  }
};

export const getHourLabel = (dateString) => formatDateTime(dateString, 'ha');
export const formatShortDate = (dateString) => formatDateTime(dateString, 'MMM d');
export const formatFullDate = (dateString) => formatDateTime(dateString, 'MMMM d, yyyy');
export const formatTime = (dateString) => formatDateTime(dateString, 'HH:mm');
export const formatDateOnly = (dateString) => formatDateTime(dateString, 'yyyy-MM-dd');
