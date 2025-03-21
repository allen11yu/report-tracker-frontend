'use client';

import React, { useEffect, useState } from "react";
import { ContinuousCalendar } from "@/components/ContinuousCalendar";
import { modals } from '@mantine/modals';
import { ReportConfigModal } from "./ReportConfigModal";
import { Report } from './types/report';
import Cookies from 'js-cookie';

interface CalendarWrapperProps {
  isDemo: boolean;
}

export default function CalendarWrapper({ isDemo }: CalendarWrapperProps) {
  const [inspectionDateMap, setInspectionDateMap] = useState<Map<string, Report[]>>(new Map());
  const [dueDateMap, setDueDateMap] = useState<Map<string, Report[]>>(new Map());

  useEffect(() => {
    const groupReports = (reports: Report[]) => {
      // Make sure the dates are formatted correctly
      reports.forEach((report) => {
        report.inspectionDate = new Date(report.inspectionDate + "T00:00:00");
        report.dueDate = new Date(report.dueDate + "T00:00:00");
      });

      // Group by inspection date
      const inspectionMap = reports.reduce((acc: Map<string, Report[]>, report: Report) => {
        const inspectionDate = report.inspectionDate.toISOString().split("T")[0];
        if (!acc.has(inspectionDate)) {
          acc.set(inspectionDate, []);
        }
        acc.get(inspectionDate)?.push(report);

        return acc;
      }, new Map<string, Report[]>());

      // Group by due date
      const dueMap = reports.reduce((acc: Map<string, Report[]>, report: Report) => {
        const dueDate = report.dueDate.toISOString().split("T")[0];
        if (!acc.has(dueDate)) {
          acc.set(dueDate, []);
        }
        acc.get(dueDate)?.push(report);

        return acc;
      }, new Map<string, Report[]>());

      setInspectionDateMap(new Map(inspectionMap));
      setDueDateMap(new Map(dueMap));
    };

    const fetchReports = async (url: string) => {
      const token = Cookies.get("token");
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const reports = await response.json();
      groupReports(reports);
    }

    if (isDemo) {
      fetchReports("/demo/reports");
    } else {
      fetchReports("/reports/all");
    }

  }, []);

  const onClickHandler = (day: number, month: number, year: number) => {
    const newReport: Report = {
      reportId: "",
      clientName: "",
      inspectionDate: new Date(year, month, day),
      dueDate: new Date(year, month, day),
      expedited: false,
      tags: [],
      notes: "",
      status: "waiting",
    };

    modals.open({
      title: 'Add new report',
      children: (
        <ReportConfigModal
          report={newReport}
          isDemo={isDemo}
          inspectionDateMap={inspectionDateMap}
          setInspectionDateMap={setInspectionDateMap}
          dueDateMap={dueDateMap}
          setDueDateMap={setDueDateMap}
        />
      ),
    });
  }


  return (
    <div className="relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center">
      <div className="relative h-full w-4/6 overflow-auto mt-20">
        <ContinuousCalendar
          onClick={onClickHandler}
          inspectionDateMap={inspectionDateMap}
          setInspectionDateMap={setInspectionDateMap}
          dueDateMap={dueDateMap}
          setDueDateMap={setDueDateMap}
          isDemo={isDemo}
        />
      </div>
    </div>
  );
}
