"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimerSeconds = exports.createTimerMillis = exports.convertJsDateToZonedDateTime = exports.convertJsDateToLocalDateTime = exports.midnight = exports.now = void 0;
const openhab_1 = require("openhab");
const now = () => {
    return openhab_1.time.ZonedDateTime.now();
};
exports.now = now;
const midnight = () => (0, exports.now)().withHour(0).withMinute(0).withSecond(0);
exports.midnight = midnight;
const convertJsDateToLocalDateTime = (s) => {
    return openhab_1.time.LocalDateTime.of(s.getFullYear(), s.getMonth() + 1, s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds());
};
exports.convertJsDateToLocalDateTime = convertJsDateToLocalDateTime;
const convertJsDateToZonedDateTime = (s) => {
    return openhab_1.time.ZonedDateTime.of(s.getFullYear(), s.getMonth() + 1, s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds(), openhab_1.time.ZoneId.systemDefault());
};
exports.convertJsDateToZonedDateTime = convertJsDateToZonedDateTime;
/**
 * Create a Timer based on millliseconds
 * @param millis
 * @param fn
 * @returns
 */
const createTimerMillis = (millis, fn) => {
    return setTimeout(fn, millis);
};
exports.createTimerMillis = createTimerMillis;
/**
* Create a Timer based on seconds
* @param seconds
* @param fn
* @returns
*/
const createTimerSeconds = (seconds, fn) => {
    return (0, exports.createTimerMillis)(seconds * 1000, fn);
};
exports.createTimerSeconds = createTimerSeconds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQStCO0FBRXhCLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtJQUNyQixPQUFPLGNBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFBO0FBRlksUUFBQSxHQUFHLE9BRWY7QUFFTSxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFBLFdBQUcsR0FBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQS9ELFFBQUEsUUFBUSxZQUF1RDtBQUVyRSxNQUFNLDRCQUE0QixHQUFHLENBQUMsQ0FBTyxFQUFFLEVBQUU7SUFDckQsT0FBTyxjQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7QUFDaEosQ0FBQyxDQUFDO0FBRlcsUUFBQSw0QkFBNEIsZ0NBRXZDO0FBQ0ssTUFBTSw0QkFBNEIsR0FBRyxDQUFDLENBQU8sRUFBRSxFQUFFO0lBQ3JELE9BQU8sY0FBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7QUFDN0ssQ0FBQyxDQUFDO0FBRlcsUUFBQSw0QkFBNEIsZ0NBRXZDO0FBRUY7Ozs7O0dBS0c7QUFDSSxNQUFNLGlCQUFpQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQWMsRUFBVSxFQUFFO0lBQ3pFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUE7QUFGVyxRQUFBLGlCQUFpQixxQkFFNUI7QUFFRDs7Ozs7RUFLRTtBQUNLLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxPQUFlLEVBQUUsRUFBYyxFQUFVLEVBQUU7SUFDNUUsT0FBTyxJQUFBLHlCQUFpQixFQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFBO0FBRlksUUFBQSxrQkFBa0Isc0JBRTlCIn0=