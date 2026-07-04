import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    canPrevious: boolean;
    canNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onPageChange?: (page: number) => void;
    className?: string;
}

type PageItem = number | "ellipsis";

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
    const maxLeadingPages = 8;
    const visibleTotalPages = Math.max(totalPages, 1);
    const visibleCurrentPage = Math.min(currentPage + 1, visibleTotalPages);

    if (visibleTotalPages <= maxLeadingPages) {
        return Array.from({ length: visibleTotalPages }, (_, index) => index + 1);
    }

    if (visibleCurrentPage <= maxLeadingPages) {
        return [
            ...Array.from({ length: maxLeadingPages }, (_, index) => index + 1),
            "ellipsis",
            visibleTotalPages,
        ];
    }

    const middlePages = [
        Math.max(visibleCurrentPage - 1, 2),
        visibleCurrentPage,
        Math.min(visibleCurrentPage + 1, visibleTotalPages - 1),
    ];

    return [
        1,
        "ellipsis",
        ...Array.from(new Set(middlePages)),
        "ellipsis",
        visibleTotalPages,
    ];
}

export function Pagination({
    currentPage,
    totalPages,
    canPrevious,
    canNext,
    onPrevious,
    onNext,
    onPageChange,
    className = "",
}: PaginationProps) {
    const visibleTotalPages = Math.max(totalPages, 1);
    const visibleCurrentPage = Math.min(currentPage + 1, visibleTotalPages);
    const pageItems = buildPageItems(currentPage, totalPages);

    return (
        <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {visibleCurrentPage} of {visibleTotalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="secondary"
                    className="rounded-none!"
                    disabled={!canPrevious}
                    onClick={onPrevious}
                    leftIcon={<ChevronLeft size={16} />}
                >
                    Previous
                </Button>

                <div className="flex flex-wrap items-center gap-1">
                    {pageItems.map((item, index) => {
                        if (item === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-sm text-zinc-400 dark:text-zinc-500"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageIndex = item - 1;
                        const isCurrent = item === visibleCurrentPage;
                        const pageClasses = [
                            "flex h-9 min-w-9 items-center justify-center border px-3 text-sm transition",
                            isCurrent
                                ? "border-brand-primary bg-brand-primary text-white"
                                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                            onPageChange && !isCurrent ? "cursor-pointer" : "cursor-default",
                        ]
                            .filter(Boolean)
                            .join(" ");

                        return (
                            <button
                                key={item}
                                type="button"
                                className={pageClasses}
                                disabled={isCurrent || !onPageChange}
                                onClick={() => onPageChange?.(pageIndex)}
                                aria-current={isCurrent ? "page" : undefined}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <Button
                    variant="secondary"
                    className="rounded-none!"
                    disabled={!canNext}
                    onClick={onNext}
                    rightIcon={<ChevronRight size={16} />}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
