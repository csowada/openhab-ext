export declare const now: () => import("@js-joda/core").ZonedDateTime;
export declare const midnight: () => import("@js-joda/core").ZonedDateTime;
export declare const convertJsDateToLocalDateTime: (s: Date) => import("@js-joda/core").LocalDateTime;
export declare const convertJsDateToZonedDateTime: (s: Date) => import("@js-joda/core").ZonedDateTime;
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
