"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2HttpClient = exports.GoogleOAuth2 = exports.GenericOAuth2 = void 0;
const openhab_1 = require("openhab");
// const logger = console;
const FORM_URLENCODED = "application/x-www-form-urlencoded";
const StorageService = openhab_1.osgi.getService("org.openhab.core.storage.StorageService");
/**
 *
 * @param formData
 * @returns
 */
const mapToFormData = (formData) => {
    return Object.entries(formData)
        .map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
        .join("&");
};
class GenericOAuth2 {
    constructor(clientId, tokenUri, scopes, storageId) {
        /** request scops */
        this.scopes = [];
        /** Code */
        this.code = "";
        this.clientId = clientId;
        this.tokenUri = tokenUri;
        this.scopes = scopes;
        this.httpService = openhab_1.actions.HTTP;
        this.store = StorageService.getStorage(`oauth2js-${storageId}`);
    }
    /**
     *
     * @param jsonData
     */
    storeData(jsonData) {
        if (jsonData.expires_in) {
            const validUntil = new Date(new Date().getTime() + jsonData.expires_in * 1000);
            jsonData.valid_until_n = validUntil.getTime();
            Object.keys(jsonData).forEach(key => {
                this.store.put(key, jsonData[key]);
            });
        }
    }
    /**
     * Is token data stored
     * @returns
     */
    isTokenDataInStore() {
        const u = this.store.containsKey("access_token") && this.store.containsKey("refresh_token");
        if (!u) {
            return false;
        }
        const storedScope = this.store.get("scope").split(" ").sort().join(" ");
        const definedScope = this.scopes.sort().join(" ");
        if (definedScope != storedScope) {
            console.warn(`Scopes different! Should: ${definedScope}, IS: ${storedScope}`);
            return false;
        }
        return true;
    }
    /**
     * Is the current token (time) valid
     * @returns
     */
    isTokenDataInvalid() {
        const vus = this.store.get("valid_until_n");
        if (!vus) {
            return true;
        }
        if (new Date().getTime() > vus) {
            return true;
        }
        return false;
    }
    /**
     *
     */
    startNewTokenProcess() {
        console.error("OAuth2 - No initial data available, start process ...");
    }
    getAuthorizationHeaderString() {
        if (this.isTokenDataInStore()) {
            return `${this.store.get("token_type")} ${this.store.get("access_token")}`;
        }
        return "";
    }
    /**
     *
     * @returns
     */
    refreshTokenIfRequired() {
        if (!this.isTokenDataInStore()) {
            console.warn("OAuth2 - No initial data available, start process ...");
            this.startNewTokenProcess();
            return false;
        }
        if (this.isTokenDataInvalid()) {
            console.warn("Outdated!");
            this.refreshRefreshToken();
        }
        return true;
    }
    /**
     *
     */
    requestAccessToken() {
        const formData = mapToFormData(this.buildTokenData());
        const jsonData = JSON.parse(this.httpService.sendHttpPostRequest(this.tokenUri, FORM_URLENCODED, formData, 1000));
        if (jsonData.error) {
            throw new Error(`OAuthJS Error: ${jsonData.error_description} (${jsonData.error})`);
        }
        this.storeData(jsonData);
    }
    /**
     *
     * @returns
     */
    buildTokenData() {
        return {
            client_id: this.clientId,
            code: this.code,
            access_type: "offline",
            grant_type: "authorization_code",
        };
    }
    /**
     *
     * @returns
     */
    buildRefreshData() {
        return {
            client_id: this.clientId,
            refresh_token: this.store.get("refresh_token"),
            grant_type: "refresh_token"
        };
    }
    /**
     *
     */
    refreshRefreshToken() {
        // console.log("refreshRefreshToken() ...");
        const formData = mapToFormData(this.buildRefreshData());
        // console.log(`FormData: ${formData}`);
        const jsonData = JSON.parse(this.httpService.sendHttpPostRequest(this.tokenUri, FORM_URLENCODED, formData, 1000));
        if (jsonData.error) {
            throw new Error(`OAuthJS Error: ${jsonData.error_description} (${jsonData.error})`);
        }
        // Object.keys(jsonData).forEach(key => logger.info("key: " + key));
        this.storeData(jsonData);
    }
    ;
    useAuthorizationCode(code, forceNewToken = false) {
        if (!this.isTokenDataInStore() || forceNewToken) {
            this.code = code;
            this.requestAccessToken();
        }
    }
}
exports.GenericOAuth2 = GenericOAuth2;
class GoogleOAuth2 extends GenericOAuth2 {
    constructor(clientId, clientSecret, scopes, storageId, tokenUri, authUri, redirectUri) {
        super(clientId, tokenUri, scopes, storageId);
        this.tokenUri = "https://oauth2.googleapis.com/token";
        this.authUri = "https://accounts.google.com/o/oauth2/auth";
        this.redirectUri = "http://localhost";
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.authUri = authUri;
    }
    startNewTokenProcess() {
        const se = this.scopes.map(x => encodeURIComponent((x))).join("&");
        console.warn(`Open URL: ${this.authUri}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${se}&response_type=code&include_granted_scopes=true&access_type=offline&state=state_parameter_passthrough_value`);
    }
    buildRefreshData() {
        return {
            ...super.buildRefreshData(),
            client_secret: this.clientSecret
        };
    }
    buildTokenData() {
        return {
            ...super.buildTokenData(),
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri
        };
    }
}
exports.GoogleOAuth2 = GoogleOAuth2;
/**
 * An OAuth2 HTTP client
 */
class OAuth2HttpClient {
    constructor(oauth2) {
        this._oauth2 = oauth2;
        this.httpService = openhab_1.actions.HTTP;
    }
    get oauth2() {
        return this._oauth2;
    }
    sendHttpGet(url, headers = [], timeout = 1000) {
        if (!this.oauth2.refreshTokenIfRequired()) {
            // return;
        }
        const allHeaders = {
            ...headers,
            "Accept": "application/json",
            "Authorization": this.oauth2.getAuthorizationHeaderString()
        };
        return JSON.parse(this.httpService.sendHttpGetRequest(url, allHeaders, timeout));
    }
}
exports.OAuth2HttpClient = OAuth2HttpClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL29hdXRoMmNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBdUM7QUFFdkMsMEJBQTBCO0FBRTFCLE1BQU0sZUFBZSxHQUFHLG1DQUFtQyxDQUFBO0FBMEIzRCxNQUFNLGNBQWMsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFFbEY7Ozs7R0FJRztBQUNILE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBZSxFQUFFLEVBQUU7SUFDeEMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUM1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLE1BQWEsYUFBYTtJQW9CeEIsWUFBWSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsTUFBZ0IsRUFBRSxTQUFpQjtRQU5uRixvQkFBb0I7UUFDVixXQUFNLEdBQWEsRUFBRSxDQUFDO1FBRWhDLFdBQVc7UUFDRCxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBRzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLFlBQVksU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sU0FBUyxDQUFDLFFBQTZCO1FBQy9DLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvRSxRQUFRLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUU5QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFRLFFBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDTyxrQkFBa0I7UUFFMUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1AsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4RSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVqRCxJQUFJLFlBQVksSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNoQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixZQUFZLFNBQVMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM5RSxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDTyxrQkFBa0I7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ08sb0JBQW9CO1FBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU0sNEJBQTRCO1FBQ2pDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQztZQUM5QixPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUM3RSxDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0JBQXNCO1FBRTNCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDTyxrQkFBa0I7UUFFMUIsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQThCLENBQUM7UUFFL0ksSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsUUFBUSxDQUFDLGlCQUFpQixLQUFLLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxjQUFjO1FBQ3RCLE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsV0FBVyxFQUFFLFNBQVM7WUFDdEIsVUFBVSxFQUFFLG9CQUFvQjtTQUNqQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNPLGdCQUFnQjtRQUN4QixPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDOUMsVUFBVSxFQUFFLGVBQWU7U0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNPLG1CQUFtQjtRQUUzQiw0Q0FBNEM7UUFFNUMsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFFeEQsd0NBQXdDO1FBRXhDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVsSCxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixRQUFRLENBQUMsaUJBQWlCLEtBQUssUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELG9FQUFvRTtRQUVwRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFBQSxDQUFDO0lBRUssb0JBQW9CLENBQUMsSUFBWSxFQUFFLGdCQUF5QixLQUFLO1FBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBMUxELHNDQTBMQztBQUVELE1BQWEsWUFBYSxTQUFRLGFBQWE7SUFPN0MsWUFBWSxRQUFnQixFQUFFLFlBQW9CLEVBQUUsTUFBZ0IsRUFBRSxTQUFpQixFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFdBQW1CO1FBQzdJLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQU5yQyxhQUFRLEdBQVcscUNBQXFDLENBQUM7UUFDekQsWUFBTyxHQUFXLDJDQUEyQyxDQUFDO1FBQzlELGdCQUFXLEdBQVcsa0JBQWtCLENBQUM7UUFLakQsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVTLG9CQUFvQjtRQUM1QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sY0FBYyxJQUFJLENBQUMsUUFBUSxpQkFBaUIsSUFBSSxDQUFDLFdBQVcsVUFBVSxFQUFFLDZHQUE2RyxDQUFDLENBQUE7SUFDOU4sQ0FBQztJQUVTLGdCQUFnQjtRQUN0QixPQUFPO1lBQ0wsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDM0IsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2pDLENBQUE7SUFDTCxDQUFDO0lBRVMsY0FBYztRQUNwQixPQUFPO1lBQ0wsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUNoQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDL0IsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQWpDRCxvQ0FpQ0M7QUFFRDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBSzNCLFlBQVksTUFBcUI7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFTSxXQUFXLENBQUMsR0FBVyxFQUFFLFVBQW9CLEVBQUUsRUFBRSxVQUFrQixJQUFJO1FBRTVFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztZQUMxQyxVQUFVO1FBQ1osQ0FBQztRQUVELE1BQU0sVUFBVSxHQUFHO1lBQ2pCLEdBQUcsT0FBTztZQUNWLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLEVBQUU7U0FDNUQsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0NBQ0Y7QUE1QkQsNENBNEJDIn0=