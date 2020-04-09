export interface Release {
    version: string;
    notes: string[];
}
export declare function getCurrentVersion(): string;
export declare function getLastUsedVersion(): string;
export declare function updateLastUsedVersion(): void;
export declare function getReleases(): Release[];
