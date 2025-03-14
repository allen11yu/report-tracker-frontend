import { Report } from './types/report';

export const REPORT_NORMAL_DAYS_DUE = 6;
export const REPORT_EXP_DAYS_DUE = 2;
export const REPORT_NEW: Report = {
    rid: "",
    clientName: "",
    inspectionDate: new Date(),
    dueDate: null,
    isExpedited: false,
    tags: [],
    notes: "",
    status: "waiting",
};

export const REPORT_TEST: Report = {
    rid: "123",
    clientName: "Johnson, Joe",
    inspectionDate: new Date(),
    dueDate: new Date(2025, 2, 14), // 0-index
    isExpedited: false,
    tags: ["mold", "TT"],
    notes: "do this \ndo that",
    status: "inprogress",
};