import { ZonedDateTime } from "@js-joda/core";
import { OAuth2HttpClient } from "./oauth2client";
declare type CalendarList = {
    "kind": "calendar#calendarListEntry";
    "etag": string;
    "id": string;
    "summary": string;
    "description": string;
    "location": string;
    "timeZone": string;
    "summaryOverride": string;
    "colorId": string;
    "backgroundColor": string;
    "foregroundColor": string;
    "hidden": boolean;
    "selected": boolean;
    "accessRole": string;
    "defaultReminders": [
        {
            "method": string;
            "minutes": number;
        }
    ];
    "notificationSettings": {
        "notifications": [
            {
                "type": string;
                "method": string;
            }
        ];
    };
    "primary": boolean;
    "deleted": boolean;
    "conferenceProperties": {
        "allowedConferenceSolutionTypes": [
            string
        ];
    };
};
declare type CalendarListListResponse = {
    kind: "calendar#calendarList";
    etag: string;
    nextPageToken: string;
    nextSyncToken: string;
    items: CalendarList[];
};
export declare type Event = {
    "kind": "calendar#event";
    "etag": string;
    "calenderName": string;
    "id": string;
    "status": string;
    "htmlLink": string;
    "created": string /**datetime*/;
    "updated": string /**datetime*/;
    "summary": string;
    "description": string;
    "location": string;
    "colorId": string;
    "creator": {
        "id": string;
        "email": string;
        "displayName": string;
        "self": boolean;
    };
    "organizer": {
        "id": string;
        "email": string;
        "displayName": string;
        "self": boolean;
    };
    "start": {
        "date": string /**date*/;
        "dateTime": string /**datetime*/;
        "timeZone": string;
        "zonedDateTime": ZonedDateTime;
    };
    "end": {
        "date": string /**date*/;
        "dateTime": string /**datetime*/;
        "timeZone": string;
        "zonedDateTime": ZonedDateTime;
    };
    "endTimeUnspecified": boolean;
    "recurrence": [
        string
    ];
    "recurringEventId": string;
    "originalStartTime": {
        "date": string /**date*/;
        "dateTime": string /**datetime*/;
        "timeZone": string;
        "zonedDateTime": ZonedDateTime;
    };
    "transparency": string;
    "visibility": string;
    "iCalUID": string;
    "sequence": number;
    "attendees": [
        {
            "id": string;
            "email": string;
            "displayName": string;
            "organizer": boolean;
            "self": boolean;
            "resource": boolean;
            "optional": boolean;
            "responseStatus": string;
            "comment": string;
            "additionalGuests": number;
        }
    ];
    "attendeesOmitted": boolean;
    "extendedProperties": {
        "private": {
            [key: string]: string;
        };
        "shared": {
            [key: string]: string;
        };
    };
    "hangoutLink": string;
    "conferenceData": {
        "createRequest": {
            "requestId": string;
            "conferenceSolutionKey": {
                "type": string;
            };
            "status": {
                "statusCode": string;
            };
        };
        "entryPoints": [
            {
                "entryPointType": string;
                "uri": string;
                "label": string;
                "pin": string;
                "accessCode": string;
                "meetingCode": string;
                "passcode": string;
                "password": string;
            }
        ];
        "conferenceSolution": {
            "key": {
                "type": string;
            };
            "name": string;
            "iconUri": string;
        };
        "conferenceId": string;
        "signature": string;
        "notes": string;
    };
    "gadget": {
        "type": string;
        "title": string;
        "link": string;
        "iconLink": string;
        "width": number;
        "height": number;
        "display": string;
        "preferences": {
            [key: string]: string;
        };
    };
    "anyoneCanAddSelf": boolean;
    "guestsCanInviteOthers": boolean;
    "guestsCanModify": boolean;
    "guestsCanSeeOtherGuests": boolean;
    "privateCopy": boolean;
    "locked": boolean;
    "reminders": {
        "useDefault": boolean;
        "overrides": [
            {
                "method": string;
                "minutes": number;
            }
        ];
    };
    "source": {
        "url": string;
        "title": string;
    };
    "workingLocationProperties": {
        "type": string;
        "homeOffice": any;
        "customLocation": {
            "label": string;
        };
        "officeLocation": {
            "buildingId": string;
            "floorId": string;
            "floorSectionId": string;
            "deskId": string;
            "label": string;
        };
    };
    "outOfOfficeProperties": {
        "autoDeclineMode": string;
        "declineMessage": string;
    };
    "focusTimeProperties": {
        "autoDeclineMode": string;
        "declineMessage": string;
        "chatStatus": string;
    };
    "attachments": [
        {
            "fileUrl": string;
            "title": string;
            "mimeType": string;
            "iconLink": string;
            "fileId": string;
        }
    ];
    "eventType": string;
    "timeType": "appointment" | "allday" | "multiday";
};
declare type EventListResponse = {
    "kind": "calendar#events";
    "etag": string;
    "summary": string;
    "description": string;
    "updated": string /**datetime*/;
    "timeZone": string;
    "accessRole": string;
    "defaultReminders": [
        {
            "method": string;
            "minutes": number;
        }
    ];
    "nextPageToken": string;
    "nextSyncToken": string;
    "items": Event[];
};
declare type JsMap = {
    [key: string]: string | number | boolean;
};
export declare type UiCalenderEntry = {
    title: string;
    type: string;
    dateTimeString: string;
    icon: string;
    iconColor: string;
    textColor: string;
};
declare class GoogleCalendarBase {
    protected apiClient: OAuth2HttpClient;
    constructor(apiClient: OAuth2HttpClient);
}
export declare class GoogleCalendarList extends GoogleCalendarBase {
    list(): CalendarListListResponse;
    get(calendarId: string): CalendarList;
}
declare type xy = JsMap & {
    maxResults: number;
};
export declare class GoogleCalendarEvents extends GoogleCalendarBase {
    listMultipleInRange(calendarIds: string[], maxResultsPerCalendar: number, timeMin: ZonedDateTime, maxTime: ZonedDateTime): Event[];
    list(calendarId: string, parameters: xy): EventListResponse;
}
export {};
