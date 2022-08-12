export interface CurveAPIResponse {
    apy: {
        day: Record<string, number>;
        week: Record<string, number>;
        month: Record<string, number>;
    };
}
