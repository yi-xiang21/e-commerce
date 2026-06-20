import dayjs from 'dayjs';

export const parseToDayjs = (value: any): dayjs.Dayjs | null => {
  if (!value) return null;
  
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};


export const formatToBE = (value: any, type: 'date' | 'time' | 'datetime' = 'datetime'): string | null => {
  if (!value || !dayjs.isDayjs(value)) return value || null;

  switch (type) {
    case 'date':
      return value.format('YYYY-MM-DD'); 
    case 'time':
      return value.format('HH:mm:ss');    
    case 'datetime':
    default:
      return value.toISOString();    
  }
};