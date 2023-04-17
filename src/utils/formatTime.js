import axios from 'axios';
import { format, getTime, formatDistanceToNow } from 'date-fns';
import c from '../config';
// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}
export function cacheGet(key) {
  const val = localStorage.getItem(key);
  if(!val) return null
  return val;
}
export function cachePut(key, value) {

  const val = localStorage.setItem(key, value);
  if(!val) return null
  return val;
}
export function request(config){
  return axios.request({
    ...config,
    url: c.BASE_URL+config.path,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.voter ? c.getVoterToken() : c.getToken()}`
    },
  })
}
export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
