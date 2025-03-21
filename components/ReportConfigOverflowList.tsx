"use client";
import { ReportConfig } from "./ReportConfig";
import { Report } from "./types/report";
import { Popover, Text, Button, Menu } from '@mantine/core';
import { useState } from "react";

interface ReportConfigOverflowListProps {
    reports: Report[];
    numPerList: number;
    isDemo: boolean;
    inspectionDateMap: Map<string, Report[]>;
    setInspectionDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
    dueDateMap: Map<string, Report[]>;
    setDueDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
}

export function ReportConfigOverflowList({ reports, numPerList, isDemo, inspectionDateMap, setInspectionDateMap, dueDateMap, setDueDateMap }: ReportConfigOverflowListProps) {
    const [opened, setOpened] = useState(false);

    let content = null;
    if (reports.length <= numPerList) {
        content = (
            <>
                {
                    reports.map((report: Report) => (
                        <ReportConfig key={report.reportId}
                            report={report}
                            isDemo={isDemo}
                            inspectionDateMap={inspectionDateMap}
                            setInspectionDateMap={setInspectionDateMap}
                            dueDateMap={dueDateMap}
                            setDueDateMap={setDueDateMap}
                        />
                    ))
                }
            </>
        );
    } else {
        const reportsNotOverflow = reports.slice(0, numPerList);
        const reportsOverflowen = reports.slice(numPerList);
        content = (
            <>
                {
                    reportsNotOverflow.map((report: Report) => (
                        <ReportConfig key={report.reportId}
                            report={report}
                            isDemo={isDemo}
                            inspectionDateMap={inspectionDateMap}
                            setInspectionDateMap={setInspectionDateMap}
                            dueDateMap={dueDateMap}
                            setDueDateMap={setDueDateMap}
                        />
                    ))
                }

                <Popover width={180} position="bottom" withArrow shadow="md" opened={opened} onChange={setOpened}>
                    <Popover.Target>
                        <Button size="compact-xs" variant="light" color="black" onClick={(e) => {
                            e.stopPropagation();
                            setOpened((o) => !o);
                        }}>
                            {`+${reportsOverflowen.length} more`}
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown onClick={(e) => e.stopPropagation()}>
                        {
                            reportsOverflowen.map((report: Report) => (
                                <ReportConfig key={report.reportId}
                                    report={report}
                                    isDemo={isDemo}
                                    onClick={() => setOpened(false)}
                                    inspectionDateMap={inspectionDateMap}
                                    setInspectionDateMap={setInspectionDateMap}
                                    dueDateMap={dueDateMap}
                                    setDueDateMap={setDueDateMap}
                                />
                            ))
                        }
                    </Popover.Dropdown>
                </Popover >
            </>
        );

    }

    return (
        <>
            {content}
        </>
    );
}