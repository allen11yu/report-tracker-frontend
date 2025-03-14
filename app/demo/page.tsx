import CalendarWrapper from "@/components/CalendarWrapper";

export default function DemoPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-200">
            <CalendarWrapper isDemo={true} />
        </main>
    );
}