import { time } from "openhab";

export const now = () => {
   return time.ZonedDateTime.now();
}

export const midnight = () => now().withHour(0).withMinute(0).withSecond(0);

export const convertJsDateToLocalDateTime = (s: Date) => {
   return time.LocalDateTime.of(s.getFullYear(), s.getMonth()+1, s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds())
};
export const convertJsDateToZonedDateTime = (s: Date) => {
   return time.ZonedDateTime.of(s.getFullYear(), s.getMonth()+1, s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds(), time.ZoneId.systemDefault())
};

/**
 * Create a Timer based on millliseconds
 * @param millis 
 * @param fn 
 * @returns 
 */
export const createTimerMillis = (millis: number, fn: () => void): number => {
   return setTimeout(fn, millis);
 }

 /**
 * Create a Timer based on seconds
 * @param seconds 
 * @param fn 
 * @returns 
 */
 export const createTimerSeconds = (seconds: number, fn: () => void): number => {
   return createTimerMillis(seconds * 1000, fn);
 }