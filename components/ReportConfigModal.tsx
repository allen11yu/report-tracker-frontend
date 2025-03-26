import { Text, TextInput, Button, Chip, Textarea, TagsInput, Tooltip, Tabs, Input, Space, ActionIcon } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { useEffect, useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import businessDays from "business-days-js";
import { REPORT_EXP_DAYS_DUE, REPORT_NORMAL_DAYS_DUE } from './constants';
import { Report } from './types/report';
import Cookies from 'js-cookie';
import { isEqual } from "lodash";

interface ReportConfigModalProps {
    report: Report;
    isDemo: boolean;
    inspectionDateMap: Map<string, Report[]>;
    setInspectionDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
    dueDateMap: Map<string, Report[]>;
    setDueDateMap: React.Dispatch<React.SetStateAction<Map<string, Report[]>>>;
}

export function ReportConfigModal({ report, isDemo, inspectionDateMap, setInspectionDateMap, dueDateMap, setDueDateMap }: ReportConfigModalProps) {
    const [clientName, setClientName] = useState<string>(report.clientName);

    const [inspectionDate, setInspectionDate] = useState<Date | null>(report.inspectionDate);
    const [dueDate, setDueDate] = useState<Date | null>(report.dueDate);
    const [expedited, setExpedited] = useState<boolean>(report.expedited);
    const [tags, setTags] = useState<string[]>(report.tags);
    const [notes, setNotes] = useState<string>(report.notes);
    const [activeStatus, setActiveStatus] = useState<string | null>(report.status);

    const bDays = businessDays();
    const today = new Date();
    const form = useForm();

    useEffect(() => {
        if (report.inspectionDate.getTime() === report.dueDate.getTime()) {
            updateDueDate(report.inspectionDate, report.expedited);
        }
    }, []);

    const handleSave = async () => {
        const addToDatabase = async () => {
            const token = Cookies.get("token");
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/reports/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "clientName": clientName,
                    "inspectionDate": inspectionDate,
                    "dueDate": dueDate,
                    "expedited": expedited,
                    "tags": tags,
                    "notes": notes,
                    "status": activeStatus
                })
            });
            const data = await response.json();
            return data.reportId;
        }

        const saveToDatabase = async (reportId: string) => {
            const token = Cookies.get("token");
            await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/reports/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "reportId": reportId,
                    "clientName": clientName,
                    "inspectionDate": inspectionDate,
                    "dueDate": dueDate,
                    "expedited": expedited,
                    "tags": tags,
                    "notes": notes,
                    "status": activeStatus
                })
            });
        }

        const saveToMap = (newReport: Report) => {
            const oldInspectionDateString = report.inspectionDate.toISOString().split("T")[0];
            const oldDueDateString = report.dueDate.toISOString().split("T")[0];

            setInspectionDateMap((prevMap) => {
                const updatedMap = new Map(prevMap);
                const newDateString = newReport.inspectionDate.toISOString().split("T")[0];
                const newReports = [...(updatedMap.get(newDateString) || [])];
                if (oldInspectionDateString !== newDateString) {
                    // Remove the old date report and possibly the key
                    const oldReports = updatedMap.get(oldInspectionDateString) || [];
                    const filteredReports = oldReports.filter((report) => report.reportId !== newReport.reportId);
                    if (filteredReports.length > 0) {
                        updatedMap.set(oldInspectionDateString, filteredReports);
                    } else {
                        updatedMap.delete(oldInspectionDateString);
                    }
                    newReports.push(newReport);
                } else {
                    const existingIndex = newReports.findIndex(report => report.reportId === newReport.reportId);
                    newReports[existingIndex] = newReport;
                }
                updatedMap.set(newDateString, newReports);
                return updatedMap;
            });

            setDueDateMap((prevMap) => {
                const updatedMap = new Map(prevMap);
                const newDateString = newReport.dueDate.toISOString().split("T")[0];
                const newReports = [...(updatedMap.get(newDateString) || [])];
                if (oldDueDateString !== newDateString) {
                    // Remove the old date report and possibly the key
                    const oldReports = updatedMap.get(oldDueDateString) || [];
                    const filteredReports = oldReports.filter((report) => report.reportId !== newReport.reportId);
                    if (filteredReports.length > 0) {
                        updatedMap.set(oldDueDateString, filteredReports);
                    } else {
                        updatedMap.delete(oldDueDateString);
                    }
                    newReports.push(newReport);
                } else {
                    const existingIndex = newReports.findIndex(report => String(report.reportId) === String(newReport.reportId));
                    newReports[existingIndex] = newReport;
                }
                updatedMap.set(newDateString, newReports);
                return updatedMap;
            });
        }

        const getReportById = (map: Map<string, Report[]>, reportId: string, dateString: string): Report | undefined => {
            const reports = map.get(dateString) || [];
            return reports.find(report => report.reportId === reportId);
        };

        let newReportId: string = "";
        if (!isDemo) {
            if (!report.reportId) {
                newReportId = await addToDatabase();
            } else {
                newReportId = report.reportId;
                const oldInspectionDateString = report.inspectionDate.toISOString().split("T")[0];
                const inspectionReport = getReportById(inspectionDateMap, report.reportId, oldInspectionDateString);

                if (!isEqual(inspectionReport,
                    {
                        "reportId": report.reportId,
                        "clientName": clientName,
                        "inspectionDate": inspectionDate || new Date(),
                        "dueDate": dueDate || new Date(),
                        "expedited": expedited,
                        "tags": tags,
                        "notes": notes,
                        "status": activeStatus || "waiting"
                    })
                ) {
                    saveToDatabase(report.reportId);
                }
            }
        }

        const newReport: Report = {
            "reportId": newReportId === "" ? report.reportId : newReportId,
            "clientName": clientName,
            "inspectionDate": inspectionDate || new Date(),
            "dueDate": dueDate || new Date(),
            "expedited": expedited,
            "tags": tags,
            "notes": notes,
            "status": activeStatus || "waiting"
        }
        saveToMap(newReport);

        const saveIcon = <IconDeviceFloppy size={20} />
        modals.closeAll();
        notifications.show({
            title: 'Report saved',
            message: `Client name: ${clientName}`,
            autoClose: 2000,
            icon: saveIcon
        })
    };

    const handleDelete = () => {
        const deleteFromMap = (reportId: string) => {
            setInspectionDateMap((prevMap) => {
                const oldInspectionDateString = report.inspectionDate.toISOString().split("T")[0];
                const updatedMap = new Map(prevMap);
                const reports = updatedMap.get(oldInspectionDateString) || [];
                updatedMap.set(oldInspectionDateString, reports.filter((report) => report.reportId !== reportId));
                return updatedMap;
            });
            setDueDateMap((prevMap) => {
                const oldDueDateString = report.dueDate.toISOString().split("T")[0];
                const updatedMap = new Map(prevMap);
                const reports = updatedMap.get(oldDueDateString) || [];
                updatedMap.set(oldDueDateString, reports.filter((report) => report.reportId !== reportId));
                return updatedMap;
            });
        }

        const deleteFromDatabase = async (reportId: string) => {
            const token = Cookies.get("token");
            await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/reports/delete/" + reportId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        }

        const handleConfirmDelete = () => {
            if (!isDemo) {
                deleteFromDatabase(report.reportId);
            }
            deleteFromMap(report.reportId);

            const deleteIcon = <IconTrash size={20} />
            modals.closeAll();
            notifications.show({
                title: 'Report deleted',
                message: `Client name: ${clientName}`,
                color: "red",
                autoClose: 2000,
                icon: deleteIcon
            })
        }

        modals.openConfirmModal({
            title: 'Delete report',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this report?
                </Text>
            ),
            labels: { confirm: 'Delete report', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: handleConfirmDelete,
        });
    };

    const handleExpedited = () => {
        setExpedited((v) => {
            const isExpedited = !v;
            if (inspectionDate) {
                updateDueDate(inspectionDate, isExpedited);
            }
            return isExpedited;
        });
    }

    const handleInspectionDate = (insDate: DateValue) => {
        setInspectionDate(insDate);
        updateDueDate(insDate, expedited);
    }

    const updateDueDate = (insDate: DateValue, isExpedited: boolean) => {
        let newDueDate;
        if (isExpedited) {
            newDueDate = bDays.addDays(insDate ?? today, REPORT_EXP_DAYS_DUE);
        } else {
            newDueDate = bDays.addDays(insDate ?? today, REPORT_NORMAL_DAYS_DUE);
        }
        setDueDate(newDueDate.toDate());
    }

    return (
        <>
            <form onSubmit={form.onSubmit(handleSave)}>
                <div className='flex flex-col gap-y-3'>
                    {/* Client name */}
                    <TextInput required label="Client name" value={clientName} onChange={(event) => setClientName(event.currentTarget.value)} />

                    {/* Inspection date */}
                    <DatePickerInput
                        required
                        label="Inspection date"
                        placeholder=""
                        value={inspectionDate}
                        onChange={handleInspectionDate}
                        firstDayOfWeek={0}
                        hideOutsideDates
                    />

                    {/* Report due date and isExpedited */}
                    <div className='flex flex-col gap-y-2'>
                        <DatePickerInput
                            required
                            label="Due date"
                            placeholder=""
                            value={dueDate}
                            onChange={setDueDate}
                            firstDayOfWeek={0}
                            hideOutsideDates
                        />
                        <Chip checked={expedited} onChange={handleExpedited}>
                            Expedited
                        </Chip>
                    </div>

                    {/* Tags */}
                    <Tooltip label="Press ENTER to add tags. Tags may include inspector name, type, etc.">
                        <TagsInput label="Tags" data={[]} value={tags} onChange={setTags} />
                    </Tooltip>

                    {/* Notes */}
                    <Textarea
                        label="Notes"
                        placeholder="Additional notes about this job/report..."
                        resize="vertical"
                        value={notes}
                        onChange={(event) => setNotes(event.currentTarget.value)}
                    />

                    {/* Status */}
                    <div>
                        <Input.Wrapper label="Status">
                            <Tabs value={activeStatus} onChange={setActiveStatus}>
                                <Tabs.List>
                                    <Tabs.Tab value="waiting">Waiting</Tabs.Tab>
                                    <Tabs.Tab value="inprogress">In progress</Tabs.Tab>
                                    <Tabs.Tab value="completed">Completed</Tabs.Tab>
                                </Tabs.List>
                            </Tabs>
                        </Input.Wrapper>
                    </div>

                    {/* Save and Delete */}
                    <Space h="xs" />
                    <div className='flex flex-row gap-x-4'>
                        <Button onClick={handleDelete} color="red">Delete</Button>
                        <Button type='submit'>Save</Button>
                    </div>
                </div>
            </form>
        </>


    )
}