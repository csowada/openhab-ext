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
        console.log(JSON.stringify(CALENDAR_PARAMS, null, 2));
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