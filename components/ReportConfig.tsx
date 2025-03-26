import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ReportConfigModal } from './ReportConfigModal';
import { Report } from './types/report';

interface ReportConfigProps {
    report: Report;
    isDemo: boolean;
    onClick?: () => void;
    inspectionDateMap: Map<string, Report[]>;
    setInspectionDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
    dueDateMap: Map<string, Report[]>;
    setDueDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
}

export function ReportConfig({ report, isDemo, onClick, inspectionDateMap, setInspectionDateMap, dueDateMap, setDueDateMap }: ReportConfigProps) {
    return (
        <Button
            className='w-full'
            size="compact-xs"
            variant={report.status === "completed" ? "filled" : "light"}
            color={report.status === "completed" ? "green" : "black"}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
                modals.open({
                    title: 'Report Details',
                    children: (
                        <ReportConfigModal
                            report={report}
                            isDemo={isDemo}
                            inspectionDateMap={inspectionDateMap}
                            setInspectionDateMap={setInspectionDateMap}
                            dueDateMap={dueDateMap}
                            setDueDateMap={setDueDateMap}
                        />
                    ),
                });
            }}
        >
            <p className='truncate w-full'>{report.clientName}</p>
        </Button>
    );
}