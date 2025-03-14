import { SegmentedControl, Skeleton, Space, Text } from "@mantine/core";

export function SkeletionCalendar() {
    return (
        <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
            <div className="sticky -top-px z-50 w-full rounded-t-2xl bg-white px-5 pt-7 sm:px-8 sm:pt-8">
                <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button type="button" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5">
                            Today
                        </button>
                        <button type="button" className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5">
                            + Add Report
                        </button>
                    </div>
                    <div className="flex w-fit items-center justify-between">
                        <div className='flex gap-x-2 items-center justify-center'>
                            <Text size="md" fw={500} span>View by:</Text>
                            <SegmentedControl
                                value={'inspection'}
                                data={[
                                    { label: 'Inspection Date', value: 'inspection' },
                                    { label: 'Due Date', value: 'due' },
                                ]}
                            />
                        </div>
                        <Space w="xs" />

                        <button
                            className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
                        >
                            <svg className="size-5 text-slate-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl"><Skeleton /></h1>
                        <button
                            className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
                        >
                            <svg className="size-5 text-slate-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="grid w-full grid-cols-7 justify-between text-slate-500">
                    <Skeleton />
                </div>
            </div>
            <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">
                <Skeleton />
            </div>
        </div>

    );

}