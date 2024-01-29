import { actions, osgi } from "openhab"

// const logger = console;

const FORM_URLENCODED = "application/x-www-form-urlencoded"

type JsMap = { [key: string]: string };

// interface TokenRequest {
//   code: string
//   client_id: string
//   grant_type: string
//   client_secret?: string
//   redirect_uri?: string
//   access_type?: string
// }

interface AccessTokenResponse {
  token_type?: string
  scope?: string
  expires_in?: number
  access_token?: string
  refresh_token?: string
  ext_expires_in?: number
  id_token?: string
  valid_until?: Date
  valid_until_s?: string
  valid_until_n?: number
}

const StorageService = osgi.getService("org.openhab.core.storage.StorageService");

/**
 * 
 * @param formData 
 * @returns 
 */
const mapToFormData = (formData: JsMap) => {
  return Object.entries(formData)
    .map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value))
    .join("&");
};

export class GenericOAuth2 {

  /** openHAB HTTP Service */
  private httpService: any;

  /** jsonDB storage */
  protected store: any | undefined;

  /** The token URI of the oauth2 service */
  protected tokenUri: string;

  /** client ID */
  protected clientId: string;

  /** request scops */
  protected scopes: string[] = [];

  /** Code */
  protected code: string = "";

  constructor(clientId: string, tokenUri: string, scopes: string[], storageId: string) {
    this.clientId = clientId;
    this.tokenUri = tokenUri;
    this.scopes = scopes;
    this.httpService = actions.HTTP;
    this.store = StorageService.getStorage(`oauth2js-${storageId}`);
  }

  /**
   * 
   * @param jsonData 
   */
  protected storeData(jsonData: AccessTokenResponse) {
    if (jsonData.expires_in) {
      const validUntil = new Date(new Date().getTime() + jsonData.expires_in * 1000);
      jsonData.valid_until_n = validUntil.getTime();

      Object.keys(jsonData).forEach(key => {
        this.store.put(key, (<any>jsonData)[key]);
      });
    }
  }

  /**
   * Is token data stored
   * @returns 
   */
  protected isTokenDataInStore() {

    const u = this.store.containsKey("access_token") && this.store.containsKey("refresh_token");

    if (!u) {
      return false;
    }

    const storedScope = this.store.get("scope").split(" ").sort().join(" ");
    const definedScope = this.scopes.sort().join(" ")

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
  protected isTokenDataInvalid() {
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
  protected startNewTokenProcess() {
    console.error("OAuth2 - No initial data available, start process ...");
  }

  public getAuthorizationHeaderString() {
    if (this.isTokenDataInStore()) {
      return `${this.store.get("token_type")} ${this.store.get("access_token")}`;
    }
    return "";
  }

  /**
   * 
   * @returns 
   */
  public refreshTokenIfRequired() {

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
  protected requestAccessToken(): void {

    const formData = mapToFormData(this.buildTokenData());
    const jsonData = JSON.parse(this.httpService.sendHttpPostRequest(this.tokenUri, FORM_URLENCODED, formData, 1000)) as AccessTokenResponse | any;

    if (jsonData.error) {
      throw new Error(`OAuthJS Error: ${jsonData.error_description} (${jsonData.error})`);
    }

    this.storeData(jsonData);
  }

  /**
   * 
   * @returns 
   */
  protected buildTokenData(): JsMap {
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
  protected buildRefreshData(): JsMap {
    return {
      client_id: this.clientId,
      refresh_token: this.store.get("refresh_token"),
      grant_type: "refresh_token"
    };
  }

  /**
   * 
   */
  protected refreshRefreshToken(): void {

    // console.log("refreshRefreshToken() ...");

    const formData = mapToFormData(this.buildRefreshData());

    // console.log(`FormData: ${formData}`);

    const jsonData = JSON.parse(this.httpService.sendHttpPostRequest(this.tokenUri, FORM_URLENCODED, formData, 1000));

    if (jsonData.error) {
      throw new Error(`OAuthJS Error: ${jsonData.error_description} (${jsonData.error})`);
    }

    // Object.keys(jsonData).forEach(key => logger.info("key: " + key));

    this.storeData(jsonData);
  };

  public useAuthorizationCode(code: string, forceNewToken: boolean = false) {
    if (!this.isTokenDataInStore() || forceNewToken) {
      this.code = code;
      this.requestAccessToken();
    }
  }
}

export class GoogleOAuth2 extends GenericOAuth2 {

  protected tokenUri: string = "https://oauth2.googleapis.com/token";
  protected authUri: string = "https://accounts.google.com/o/oauth2/auth";
  protected redirectUri: string = "http://localhost";
  protected clientSecret: string;

  constructor(clientId: string, clientSecret: string, scopes: string[], storageId: string, tokenUri: string, authUri: string, redirectUri: string) {
    super(clientId, tokenUri, scopes, storageId);
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUri = authUri;
  }

  protected startNewTokenProcess(): void {
    const se = this.scopes.map(x => encodeURIComponent((x))).join("&");
    console.warn(`Open URL: ${this.authUri}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${se}&response_type=code&include_granted_scopes=true&access_type=offline&state=state_parameter_passthrough_value`)
  }

  protected buildRefreshData(): JsMap {
      return {
        ...super.buildRefreshData(),
        client_secret: this.clientSecret
      }
  }

  protected buildTokenData(): JsMap {
      return {
        ...super.buildTokenData(),
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri
      };
  }
}

/**
 * An OAuth2 HTTP client
 */
export class OAuth2HttpClient {

  private _oauth2: GenericOAuth2;
  private httpService: any;

  constructor(oauth2: GenericOAuth2) {
    this._oauth2 = oauth2;
    this.httpService = actions.HTTP;
  }

  public get oauth2() {
    return this._oauth2;
  }

  public sendHttpGet(url: string, headers: string[] = [], timeout: number = 1000) {

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
