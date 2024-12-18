type JsMap = {
    [key: string]: string;
};
interface AccessTokenResponse {
    token_type?: string;
    scope?: string;
    expires_in?: number;
    access_token?: string;
    refresh_token?: string;
    ext_expires_in?: number;
    id_token?: string;
    valid_until?: Date;
    valid_until_s?: string;
    valid_until_n?: number;
}
export declare class GenericOAuth2 {
    /** openHAB HTTP Service */
    private httpService;
    /** jsonDB storage */
    protected store: any | undefined;
    /** The token URI of the oauth2 service */
    protected tokenUri: string;
    /** client ID */
    protected clientId: string;
    /** request scops */
    protected scopes: string[];
    /** Code */
    protected code: string;
    constructor(clientId: string, tokenUri: string, scopes: string[], storageId: string);
    /**
     *
     * @param jsonData
     */
    protected storeData(jsonData: AccessTokenResponse): void;
    /**
     * Is token data stored
     * @returns
     */
    protected isTokenDataInStore(): boolean;
    /**
     * Is the current token (time) valid
     * @returns
     */
    protected isTokenDataInvalid(): boolean;
    /**
     *
     */
    protected startNewTokenProcess(): void;
    getAuthorizationHeaderString(): string;
    /**
     *
     * @returns
     */
    refreshTokenIfRequired(): boolean;
    /**
     *
     */
    protected requestAccessToken(): void;
    /**
     *
     * @returns
     */
    protected buildTokenData(): JsMap;
    /**
     *
     * @returns
     */
    protected buildRefreshData(): JsMap;
    /**
     *
     */
    protected refreshRefreshToken(): void;
    useAuthorizationCode(code: string, forceNewToken?: boolean): void;
}
export declare class GoogleOAuth2 extends GenericOAuth2 {
    protected tokenUri: string;
    protected authUri: string;
    protected redirectUri: string;
    protected clientSecret: string;
    constructor(clientId: string, clientSecret: string, scopes: string[], storageId: string, tokenUri: string, authUri: string, redirectUri: string);
    protected startNewTokenProcess(): void;
    protected buildRefreshData(): JsMap;
    protected buildTokenData(): JsMap;
}
/**
 * An OAuth2 HTTP client
 */
export declare class OAuth2HttpClient {
    private _oauth2;
    private httpService;
    constructor(oauth2: GenericOAuth2);
    get oauth2(): GenericOAuth2;
    sendHttpGet(url: string, headers?: string[], timeout?: number): any;
}
export {};
