import { useSearchParams } from "react-router-dom";
import type { Position } from "../models/Position";
import type { Status } from "../models/Status";
import { getSearchParamNumber } from "../utils/getSearchParamNumber";
import type { SearchJobApplicationsParams } from "../api/jobApplicationService";

const DEFAULT_APPLICATIONS_PAGE = 0;
const DEFAULT_APPLICATIONS_PAGE_SIZE = 12;
const APPLICATIONS_PAGE_SIZE_OPTIONS = [6, 12, 18];

export function useApplicationsFilters() {

    const [searchParams, setSearchParams] = useSearchParams();

    const requestedName = searchParams.get("name") ?? "";
    const showFavoritesOnly = searchParams.get("favorites") === "true";
    const requestedStatuses = searchParams.getAll("statuses") as Status[];
    const requestedPositions = searchParams.getAll("positions") as Position[];
    const requestedSort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

    const requestedPage = getSearchParamNumber(
        searchParams.get("page"),
        DEFAULT_APPLICATIONS_PAGE,
        0,
    );

    const requestedPageSizeParam = getSearchParamNumber(
        searchParams.get("size"),
        DEFAULT_APPLICATIONS_PAGE_SIZE,
        1,
    );

    const requestedPageSize = APPLICATIONS_PAGE_SIZE_OPTIONS.includes(requestedPageSizeParam)
        ? requestedPageSizeParam
        : DEFAULT_APPLICATIONS_PAGE_SIZE;

    const searchApplicationsParams: SearchJobApplicationsParams = {
        name: requestedName || undefined,
        statuses: requestedStatuses.length ? requestedStatuses : undefined,
        positions: requestedPositions.length ? requestedPositions : undefined,
        favorites: showFavoritesOnly ? true : undefined,
        sort: requestedSort,
        page: requestedPage,
        size: requestedPageSize,
    };

    const handleSearch = (name: string) => {
        const nextSearchName = name.trim();
        const nextSearchParams = new URLSearchParams(searchParams);

        if (nextSearchName) {
            nextSearchParams.set("name", nextSearchName);
        } else {
            nextSearchParams.delete("name");
        }

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };


    const updatePaginationParams = (nextPage: number) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const page = Math.max(nextPage, DEFAULT_APPLICATIONS_PAGE);

        nextSearchParams.set("page", String(page));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const updatePageSizeParam = (nextPageSize: number) => {

        const validPageSize = APPLICATIONS_PAGE_SIZE_OPTIONS.includes(nextPageSize)
            ? nextPageSize
            : DEFAULT_APPLICATIONS_PAGE_SIZE;

        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(validPageSize));

        setSearchParams(nextSearchParams);
    };

    const updateFavoritesFilter = (checked: boolean) => {
        
        const nextSearchParams = new URLSearchParams(searchParams);

        if (checked) {
            nextSearchParams.set("favorites", "true");
        } else {
            nextSearchParams.delete("favorites");
        }

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const resetFilters = () => {
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.delete("name");
        nextSearchParams.delete("favorites");
        nextSearchParams.delete("statuses");
        nextSearchParams.delete("positions");
        nextSearchParams.delete("sort");
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const updateStatusFilter = (status: Status) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const nextStatuses = requestedStatuses.includes(status)
            ? requestedStatuses.filter((selectedStatus) => selectedStatus !== status)
            : [...requestedStatuses, status];

        nextSearchParams.delete("statuses");
        nextStatuses.forEach((selectedStatus) => nextSearchParams.append("statuses", selectedStatus));
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };

    const updatePositionFilter = (position: Position) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const nextPositions = requestedPositions.includes(position)
            ? requestedPositions.filter((selectedPosition) => selectedPosition !== position)
            : [...requestedPositions, position];

        nextSearchParams.delete("positions");
        nextPositions.forEach((selectedPosition) => nextSearchParams.append("positions", selectedPosition));
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };


    return {
        requestedName,
        showFavoritesOnly,
        requestedStatuses,
        requestedPositions,
        requestedSort,
        requestedPage,
        requestedPageSize,
        searchApplicationsParams,
        APPLICATIONS_PAGE_SIZE_OPTIONS,
        DEFAULT_APPLICATIONS_PAGE,
        DEFAULT_APPLICATIONS_PAGE_SIZE,

        updatePaginationParams,
        updatePageSizeParam,
        updateFavoritesFilter,
        resetFilters,
        updateStatusFilter,
        updatePositionFilter,
        handleSearch,
    };
}