export interface ResourceId {
    name: string;
    type: string | null;
    prefixes: string[];
}
export interface Warning {
    id: ResourceId;
    detail: string;
}
export declare enum ChangeType {
    Create = "create",
    Read = "read",
    Update = "update",
    Destroy = "destroy",
    Recreate = "recreate",
    Unknown = "unknown"
}
export interface Diff {
    property: string;
    old?: string;
    new: string;
    forcesNewResource?: boolean;
}
export interface Action {
    id: ResourceId;
    type: ChangeType;
    changes: Diff[];
}
export interface Plan {
    warnings: Warning[];
    actions: Action[];
}
export declare function parse(terraformPlan: string): Plan;
export declare function parseWarnings(terraformPlan: string): Warning[];
export declare function extractChangeSummary(terraformPlan: string): string;
export declare function extractIndividualChanges(changeSummary: string): string[];
export declare function parseChange(change: string): Action;
export declare function parseId(resourceId: string): ResourceId;
export declare function parseChangeSymbol(changeTypeSymbol: string): ChangeType;
export declare function parseSingleValueDiffs(change: string): Diff[];
export declare function parseNewAndOldValueDiffs(change: string): Diff[];
