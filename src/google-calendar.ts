import { ZonedDateTime, ZoneId, LocalDate, DateTimeFormatter } from "@js-joda/core";
import { OAuth2HttpClient } from "./oauth2client"

type CalendarList = {
  "kind": "calendar#calendarListEntry",
  "etag": string,
  "id": string,
  "summary": string,
  "description": string,
  "location": string,
  "timeZone": string,
  "summaryOverride": string,
  "colorId": string,
  "backgroundColor": string,
  "foregroundColor": string,
  "hidden": boolean,
  "selected": boolean,
  "accessRole": string,
  "defaultReminders": [
    {
      "method": string,
      "minutes": number
    }
  ],
  "notificationSettings": {
    "notifications": [
      {
        "type": string,
        "method": string
      }
    ]
  },
  "primary": boolean,
  "deleted": boolean,
  "conferenceProperties": {
    "allowedConferenceSolutionTypes": [
      string
    ]
  }
}

type CalendarListListResponse = {
  kind: "calendar#calendarList"
  etag: string
  nextPageToken: string
  nextSyncToken: string
  items: CalendarList[]
}

export type Event = {
  "kind": "calendar#event",
  "etag": string,
  "calenderName": string
  "id": string,
  "status": string,
  "htmlLink": string,
  "created": string /**datetime*/,
  "updated": string /**datetime*/,
  "summary": string,
  "description": string,
  "location": string,
  "colorId": string,
  "creator": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "organizer": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "start": {
    "date": string /**date*/,
    "dateTime": string /**datetime*/,
    "timeZone": string,
    "zonedDateTime": ZonedDateTime
  },
  "end": {
    "date": string /**date*/,
    "dateTime": string /**datetime*/,
    "timeZone": string,
    "zonedDateTime": ZonedDateTime
  },
  "endTimeUnspecified": boolean,
  "recurrence": [
    string
  ],
  "recurringEventId": string,
  "originalStartTime": {
    "date": string /**date*/,
    "dateTime": string /**datetime*/,
    "timeZone": string,
    "zonedDateTime": ZonedDateTime
  },
  "transparency": string,
  "visibility": string,
  "iCalUID": string,
  "sequence": number,
  "attendees": [
    {
      "id": string,
      "email": string,
      "displayName": string,
      "organizer": boolean,
      "self": boolean,
      "resource": boolean,
      "optional": boolean,
      "responseStatus": string,
      "comment": string,
      "additionalGuests": number
    }
  ],
  "attendeesOmitted": boolean,
  "extendedProperties": {
    "private": { [key: string]: string },
    "shared": { [key: string]: string }
  },
  "hangoutLink": string,
  "conferenceData": {
    "createRequest": {
      "requestId": string,
      "conferenceSolutionKey": {
        "type": string
      },
      "status": {
        "statusCode": string
      }
    },
    "entryPoints": [
      {
        "entryPointType": string,
        "uri": string,
        "label": string,
        "pin": string,
        "accessCode": string,
        "meetingCode": string,
        "passcode": string,
        "password": string
      }
    ],
    "conferenceSolution": {
      "key": {
        "type": string
      },
      "name": string,
      "iconUri": string
    },
    "conferenceId": string,
    "signature": string,
    "notes": string,
  },
  "gadget": {
    "type": string,
    "title": string,
    "link": string,
    "iconLink": string,
    "width": number,
    "height": number,
    "display": string,
    "preferences": { [key: string]: string }
  },
  "anyoneCanAddSelf": boolean,
  "guestsCanInviteOthers": boolean,
  "guestsCanModify": boolean,
  "guestsCanSeeOtherGuests": boolean,
  "privateCopy": boolean,
  "locked": boolean,
  "reminders": {
    "useDefault": boolean,
    "overrides": [
      {
        "method": string,
        "minutes": number
      }
    ]
  },
  "source": {
    "url": string,
    "title": string
  },
  "workingLocationProperties": {
    "type": string,
    "homeOffice": any,
    "customLocation": {
      "label": string
    },
    "officeLocation": {
      "buildingId": string,
      "floorId": string,
      "floorSectionId": string,
      "deskId": string,
      "label": string
    }
  },
  "outOfOfficeProperties": {
    "autoDeclineMode": string,
    "declineMessage": string
  },
  "focusTimeProperties": {
    "autoDeclineMode": string,
    "declineMessage": string,
    "chatStatus": string
  },
  "attachments": [
    {
      "fileUrl": string,
      "title": string,
      "mimeType": string,
      "iconLink": string,
      "fileId": string
    }
  ],
  "eventType": string
  "timeType": "appointment" | "allday" | "multiday"
}

type EventListResponse = {
  "kind": "calendar#events",
  "etag": string,
  "summary": string,
  "description": string,
  "updated": string /**datetime*/,
  "timeZone": string,
  "accessRole": string,
  "defaultReminders": [
    {
      "method": string,
      "minutes": number
    }
  ],
  "nextPageToken": string,
  "nextSyncToken": string,
  "items": Event[]
}

type JsMap = { [key: string]: string | number | boolean }

type ErrorResponse = {
  error: {
    errors: [{
      domain: string,
      reason: string,
      message: string
    }]
    code: number
    message: string
  }
}

export type UiCalenderEntry = {
  title: string,
  type: string,
  dateTimeString: string,
  icon: string
  iconColor: string
  textColor: string
}

class GoogleCalendarBase {
  protected apiClient: OAuth2HttpClient;

  constructor(apiClient: OAuth2HttpClient) {
    this.apiClient = apiClient;
  }
}

export class GoogleCalendarList extends GoogleCalendarBase {

  public list() {
    return this.apiClient.sendHttpGet("https://www.googleapis.com/calendar/v3/users/me/calendarList") as CalendarListListResponse
  }

  public get(calendarId: string) {
    return this.apiClient.sendHttpGet(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`) as CalendarList
  }
}

type xy = JsMap & {
  maxResults: number
}

const toZdt = (date: string, dateTime: string) => {
  const zdt = date ?
    LocalDate.parse(date).atStartOfDay().atZone(ZoneId.SYSTEM) :
    ZonedDateTime.parse(dateTime);

  return zdt;
}

export class GoogleCalendarEvents extends GoogleCalendarBase {

  public listMultipleInRange(calendarIds: string[], maxResultsPerCalendar: number, timeMin: ZonedDateTime, maxTime: ZonedDateTime) {

    const CALENDAR_PARAMS = {
      maxResults: maxResultsPerCalendar,
      timeMin: timeMin.format(DateTimeFormatter.ISO_INSTANT),
      timeMax: maxTime.format(DateTimeFormatter.ISO_INSTANT),
      singleEvents: true,
      orderBy: "startTime"
    };

    // console.log(JSON.stringify(CALENDAR_PARAMS, null, 2));

    const allEvents: Event[] = [];

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

  public list(calendarId: string, parameters: xy): EventListResponse {

    let p = Object.keys(parameters).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])).join("&");
    if (p.length > 0) {
      p = "?" + p;
    }
    const json = this.apiClient.sendHttpGet(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events${p}`) as ErrorResponse & EventListResponse

    if (json.error) {
      throw new Error(`GCalErr: ${json.error.message}`)
    }

    // add zone date times to event
    json.items.forEach(event => {
      event.start.zonedDateTime = toZdt(event.start.date, event.start.dateTime);
      event.end.zonedDateTime = toZdt(event.end.date, event.end.dateTime);
    });

    return json;
  }
}