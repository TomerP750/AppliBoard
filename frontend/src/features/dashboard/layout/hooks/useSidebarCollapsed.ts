import { useState } from "react";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebarCollapsed";

// Storage can throw (private mode, blocked site data), so a failure falls back to the expanded sidebar.
function readStoredSidebarCollapsed(): boolean {
    try {
        return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

function storeSidebarCollapsed(isCollapsed: boolean) {
    try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isCollapsed));
    } catch {
        // The preference just won't survive a reload.
    }
}

/** Whether the dashboard sidebar is collapsed to icons, remembered across visits. */
export function useSidebarCollapsed() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(readStoredSidebarCollapsed);

    const toggleCollapsed = () => {
        const nextIsCollapsed = !isCollapsed;
        setIsCollapsed(nextIsCollapsed);
        storeSidebarCollapsed(nextIsCollapsed);
    };

    return { isCollapsed, toggleCollapsed };
}
