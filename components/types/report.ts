export interface Report {
    reportId: string;
    clientName: string;
    inspectionDate: Date;
    dueDate: Date;
    expedited: boolean;
    tags: string[];
    notes: string;
    status: string;
}