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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL29hdXRoMmNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBdUM7QUFFdkMsMEJBQTBCO0FBRTFCLE1BQU0sZUFBZSxHQUFHLG1DQUFtQyxDQUFBO0FBMEIzRCxNQUFNLGNBQWMsR0FBRyxjQUFJLENBQUMsVUFBVSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFFbEY7Ozs7R0FJRztBQUNILE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBZSxFQUFFLEVBQUU7SUFDeEMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUM1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLE1BQWEsYUFBYTtJQW9CeEIsWUFBWSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsTUFBZ0IsRUFBRSxTQUFpQjtRQU5uRixvQkFBb0I7UUFDVixXQUFNLEdBQWEsRUFBRSxDQUFDO1FBRWhDLFdBQVc7UUFDRCxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBRzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLFlBQVksU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sU0FBUyxD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