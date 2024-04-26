export interface AlarmFilter {
    lecture: string[];
    type: string[];
    startDate: number;
    endDate: number;
}
export const defaultFilter: AlarmFilter = {
    lecture: [],
    type: ["Announcement Available"],
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).getTime(),
    endDate: new Date().getTime(), // 30 days
};