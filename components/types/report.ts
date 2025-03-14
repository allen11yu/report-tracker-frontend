export interface Report {
    reportId: string;
    clientName: string;
    inspectionDate: Date | null;
    dueDate: Date | null;
    expedited: boolean;
    tags: string[];
    notes: string;
    status: string;
}