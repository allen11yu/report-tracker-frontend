'use client';

import CalendarWrapper from '@/components/CalendarWrapper';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { redirect } from "next/navigation";

export default function Home() {
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            redirect("/login");
        }
    }, []);


    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-200">
            <CalendarWrapper isDemo={false} />
        </main>
    );
}