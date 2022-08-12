export declare const SENTRY_NAME = "Lord Brocktree";
export declare const BADGER_API_ROLE_ID = "804758043727233044";
export declare const VAULT_MANAGER_ROLE_ID = "1003408385170997299";
export declare function sendErrorToDiscord(e: Error, errorMsg: string, errorType: string): void;
export declare function sendMessageToDiscord(title: string, description: string, fields: {
    name: string;
    value: string;
    inline: boolean;
}[], username: string, url?: string): Promise<void>;
export declare function sendPlainTextToDiscord(message: string, username?: string, url?: string): Promise<void>;
export declare function sendCodeBlockToDiscord(message: string, username?: string, url?: string): Promise<void>;
