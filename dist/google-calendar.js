"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarEvents = exports.GoogleCalendarList = void 0;
const core_1 = require("@js-joda/core");
class GoogleCalendarBase {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
}
class GoogleCalendarList extends GoogleCalendarBase {
    list() {
        return this.apiClient.sendHttpGet("https://www.googleapis.com/calendar/v3/users/me/calendarList");
    }
    get(calendarId) {
        return this.apiClient.sendHttpGet(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`);
    }
}
exports.GoogleCalendarList = GoogleCalendarList;
const toZdt = (date, dateTime) => {
    const zdt = date ?
        core_1.LocalDate.parse(date).atStartOfDay().atZone(core_1.ZoneId.SYSTEM) :
        core_1.ZonedDateTime.parse(dateTime);
    return zdt;
};
class GoogleCalendarEvents extends GoogleCalendarBase {
    listMultipleInRange(calendarIds, maxResultsPerCalendar, timeMin, maxTime) {
        const CALENDAR_PARAMS = {
            maxResults: maxResultsPerCalendar,
            timeMin: timeMin.format(core_1.DateTimeFormatter.ISO_INSTANT),
            timeMax: maxTime.format(core_1.DateTimeFormatter.ISO_INSTANT),
            singleEvents: true,
            orderBy: "startTime"
        };
        // console.log(JSON.stringify(CALENDAR_PARAMS, null, 2));
        const allEvents = [];
        calendarIds.forEach(calendarId => {
            const e = this.list(calendarId, CALENDAR_PARAMS).items;
            // map calendar names to events
            e.forEach(event => {
                event.calenderName = calendarId;
                // event.calenderName = calendarListMapping.get(calendarId);
            });
            // append all events
            allEvents.push(...e);
        });
        // sort all events by start date time
        allEvents.sort((a, b) => a.start.zonedDateTime.compareTo(b.start.zonedDateTime));
        return allEvents;
    }
    list(calendarId, parameters) {
        let p = Object.keys(parameters).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])).join("&");
        if (p.length > 0) {
            p = "?" + p;
        }
        const json = this.apiClient.sendHttpGet(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events${p}`);
        if (json.error) {
            throw new Error(`GCalErr: ${json.error.message}`);
        }
        // add zone date times to event
        json.items.forEach(event => {
            event.start.zonedDateTime = toZdt(event.start.date, event.start.dateTime);
            event.end.zonedDateTime = toZdt(event.end.date, event.end.dateTime);
        });
        return json;
    }
}
exports.GoogleCalendarEvents = GoogleCalendarEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dvb2dsZS1jYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBb0Y7QUFxUXBGLE1BQU0sa0JBQWtCO0lBR3RCLFlBQVksU0FBMkI7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBRUQsTUFBYSxrQkFBbUIsU0FBUSxrQkFBa0I7SUFFakQsSUFBSTtRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsOERBQThELENBQTZCLENBQUE7SUFDL0gsQ0FBQztJQUVNLEdBQUcsQ0FBQyxVQUFrQjtRQUMzQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGdFQUFnRSxVQUFVLEVBQUUsQ0FBaUIsQ0FBQTtJQUNqSSxDQUFDO0NBQ0Y7QUFURCxnREFTQztBQU1ELE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUMvQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNoQixnQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUQsb0JBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFaEMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUE7QUFFRCxNQUFhLG9CQUFxQixTQUFRLGtCQUFrQjtJQUVuRCxtQkFBbUIsQ0FBQyxXQUFxQixFQUFFLHFCQUE2QixFQUFFLE9BQXNCLEVBQUUsT0FBc0I7UUFFN0gsTUFBTSxlQUFlLEdBQUc7WUFDdEIsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyx3QkFBaUIsQ0FBQyxXQUFXLENBQUM7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