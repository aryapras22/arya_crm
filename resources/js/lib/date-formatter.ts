import { format } from 'date-fns'


export function formatDateToDMY(date: string) {
  const dateObj = new Date(date);

  const formattedDate = format(dateObj, 'dd-MM-yyyy');
  return formattedDate;
}

export function formateDateDetail(date: string) {
  const dateObj = new Date(date);

  const formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
  return formattedDate;
}