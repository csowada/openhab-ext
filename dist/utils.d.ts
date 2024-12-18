import { ZonedDateTime, LocalDateTime } from "@js-joda/core";
/**
 *
 * @returns { ZonedDateTime } dfd
 */
export declare const now: () => ZonedDateTime;
/**
 *
 * @returns { ZonedDateTime }
 */
export declare const midnight: () => ZonedDateTime;
/**
 *
 * @param {Date} s hello
 * @returns { LocalDateTime }
 */
export declare const convertJsDateToLocalDateTime: (s: Date) => LocalDateTime;
export declare const convertJsDateToZonedDateTime: (s: Date) => ZonedDateTime;
/**
 * Create a Timer based on millliseconds
 * @param millis
 * @param fn
 * @returns
 */
export declare const createTimerMillis: (millis: number, fn: () => void) => number;
/**
* Create a Timer based on seconds
* @param seconds
* @param fn
* @returns
*/
export declare const createTimerSeconds: (seconds: number, fn: () => void) => number;
