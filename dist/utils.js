"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimerSeconds = exports.createTimerMillis = exports.convertJsDateToZonedDateTime = exports.convertJsDateToLocalDateTime = exports.midnight = exports.now = void 0;
const openhab_1 = require("openhab");
/**
 *
 * @returns { ZonedDateTime } dfd
 */
const now = () => {
    return openhab_1.time.ZonedDateTime.now();
};
exports.now = now;
/**
 *
 * @returns { ZonedDateTime }
 */
const midnight = () => (0, exports.now)().withHour(0).withMinute(0).withSecond(0);
exports.midnight = midnight;
/**
 *
 * @param {Date} s hello
 * @returns { LocalDateTime }
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQStCO0FBRy9COzs7R0FHRztBQUNJLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtJQUNyQixPQUFPLGNBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFBO0FBRlksUUFBQSxHQUFHLE9BRWY7QUFFRDs7O0dBR0c7QUFDSSxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFBLFdBQUcsR0FBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQS9ELFFBQUEsUUFBUSxZQUF1RDtBQUU1RTs7OztHQUlHO0FBQ0ksTUFBTSw0QkFBNEIsR0FBRyxDQUFDLENBQU8sRUFBRSxFQUFFO0lBQ3JELE9BQU8sY0FBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBO0FBQ2hKLENBQUMsQ0FBQztBQUZXLFFBQUEsNEJBQTRCLGdDQUV2QztBQUNLLE1BQU0sNEJBQTRCLEdBQUcsQ0FBQyxDQUFPLEVBQUUsRUFBRTtJQUNyRCxPQUFPLGNBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO0FBQzdLLENBQUMsQ0FBQztBQUZXLFFBQUEsNEJBQTRCLGdDQUV2QztBQUVGOzs7OztHQUtHO0FBQ0ksTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFjLEVBQVUsRUFBRTtJQUN6RSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFBO0FBRlcsUUFBQSxpQkFBaUIscUJBRTVCO0FBRUQ7Ozs7O0VBS0U7QUFDSyxNQUFNLGtCQUFrQixHQUFHLENBQUMsT0FBZSxFQUFFLEVBQWMsRUFBVSxFQUFFO0lBQzVFLE9BQU8sSUFBQSx5QkFBaUIsRUFBQyxPQUFPLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQTtBQUZZLFFBQUEsa0JBQWtCLHNCQUU5QiJ9