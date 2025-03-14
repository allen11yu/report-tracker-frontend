import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ReportConfigModal } from './ReportConfigModal';
import { Report } from './types/report';

interface ReportConfigProps {
    report: Report;
    isDemo: boolean;
}

export function ReportConfig({ report, isDemo }: ReportConfigProps) {
    return (
        <Button
            size="compact-xs"
            variant={report.status === "completed" ? "filled" : "light"}
            color={report.status === "completed" ? "green" : "black"}
            onClick={(e) => {
                e.stopPropagation();
                modals.open({
                    title: 'Report Details',
                    children: (
                        <ReportConfigModal report={report} isDemo={isDemo} />
                    ),
                });
            }}
        >
            <p className='truncate w-32'>{report.clientName}</p>
        </Button>
    );
}