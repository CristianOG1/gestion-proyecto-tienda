export const SortBy = () => {
    return (
        <div className="flex items-center gap-2 rounded-full bg-[#111827] p-1 w-fit">
            <button
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
                Default
            </button>

            <button
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6.75h18M6.75 12h10.5M10.5 17.25h3"
                    />
                </svg>

                By price
            </button>
        </div>
    );
};