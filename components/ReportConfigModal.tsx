import { Text, TextInput, Button, Chip, Textarea, TagsInput, Tooltip, Tabs, Input, Space, ActionIcon } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import businessDays from "business-days-js";
import { REPORT_EXP_DAYS_DUE, REPORT_NORMAL_DAYS_DUE } from './constants';
import { Report } from './types/report';

interface ReportConfigModalProps {
    report: Report;
    isDemo: boolean;
}

export function ReportConfigModal({ report, isDemo }: ReportConfigModalProps) {
    const [clientName, setClientName] = useState<string>(report.clientName);
    const [inspectionDate, setInspectionDate] = useState<Date | null>(new Date(String(report.inspectionDate) + "T00:00:00"));
    const [dueDate, setDueDate] = useState<Date | null>(new Date(String(report.dueDate) + "T00:00:00"));
    const [expedited, setExpedited] = useState<boolean>(report.expedited);
    const [tags, setTags] = useState<string[]>(report.tags);
    const [notes, setNotes] = useState<string>(report.notes);
    const [activeStatus, setActiveStatus] = useState<string | null>(report.status);

    const bDays = businessDays();
    const today = new Date();

    useEffect(() => {
        if (report.inspectionDate && !report.dueDate) {
            updateDueDate(report.inspectionDate, report.expedited);
        }
    }, []);

    const handleSave = () => {
        // report id for backend to save

        // get the object from hashmap
        // compare object to new object
        // if not the same -> replace/add the object in hashmap
        if (!isDemo) {
            // saving to database, replace/add the object in hashmap
        }

        const saveIcon = <IconDeviceFloppy size={20} />
        modals.closeAll();
        console.log("Saving");
        notifications.show({
            title: 'Report saved',
            message: `Client name: ${report.clientName}`,
            autoClose: 2000,
            icon: saveIcon
        })
    };

    const handleDelete = () => {
        const handleConfirmDelete = () => {
            // report id for backend to delete
            // get the object from hashmap
            // compare object to new object
            // if not the same -> replace/add the object in hashmap
            if (!isDemo) {
                // delete from database, replace the object in hashmap
            }

            const deleteIcon = <IconTrash size={20} />
            modals.closeAll();
            console.log("Deleting");
            notifications.show({
                title: 'Report deleted',
                message: `Client name: ${report.clientName}`,
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
            onCancel: () => console.log('Cancel'),
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
        console.log("Updating due date");

        let newDueDate;
        if (isExpedited) {
            console.log("Report is expedited");
            newDueDate = bDays.addDays(insDate ?? today, REPORT_EXP_DAYS_DUE);
        } else {
            console.log("Report is NOT expedited");
            newDueDate = bDays.addDays(insDate ?? today, REPORT_NORMAL_DAYS_DUE);
        }
        console.log("Setting new due date:", newDueDate.toDate());
        setDueDate(newDueDate.toDate());
    }

    return (
        <div className='flex flex-col gap-y-3'>
            {/* Client name */}
            <TextInput label="Client name" value={clientName} onChange={(event) => setClientName(event.currentTarget.value)} />

            {/* Inspection date */}
            <DatePickerInput
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
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}