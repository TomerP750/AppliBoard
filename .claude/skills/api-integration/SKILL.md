---
name: api-integration
description: Connect an AppliBoard frontend feature to a backend endpoint - TypeScript models from the Java DTOs, a class-based Axios service (`return (await axios.get(...)).data`, `const x = new X(); export default x`), TanStack Query hooks with query keys and invalidation, and loading/empty/error UI. Use when wiring a page or component to the Spring API (e.g. notifications, AI summary), adding an endpoint call, or replacing dummy data with real data.
---

# API integration

Connect a frontend feature to the Spring Boot API in the way the existing code does it. Reference implementations: `features/dashboard/applications/api/jobApplicationService.ts`, `features/dashboard/analytics/api/analyticsService.ts`, `features/authentication/api/authService.ts`.

Only read and edit code. Don't start the backend or frontend, call the API, or run lint or builds unless the user asks.

## 1. Read the backend contract first

Before writing anything, read in `appliboard/src/main/java/com/backend/appliboard/features/<feature>/`:
- the **controller**: base path, HTTP method, path variables, `@RequestParam`s (names, defaults, lists), request body, return type,
- the **DTOs** in `dto/` and any **enums** they use,
- whether it returns `Page<T>` (paginated).

Never guess a URL, field name or enum value. If the endpoint doesn't exist yet, say so and stop (or ask whether to write the backend part too).

## 2. Models (`src/features/<feature>/models/`)

One file per DTO or enum, named exactly like the Java class (`NotificationDto.ts`, `NotificationType.ts`).

```ts
// NotificationDto.ts
import type { NotificationType } from "./NotificationType";

export interface NotificationDto {
    id: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: string;
}
```

```ts
// NotificationType.ts — same style as Status.ts
export enum NotificationType {
    STALE_APPLICATION = "STALE_APPLICATION",
}
```

| Java | TypeScript |
| --- | --- |
| `String`, `UUID` | `string` |
| `Long`/`long` id | `string` (as in `JobApplicationDto.id`; check what the existing models do for that entity) |
| `int`, `Integer`, `long`, `double` (non-id) | `number` |
| `boolean` / `Boolean` | `boolean` (keep the JSON field name the backend sends, such as `isFavorite`) |
| `LocalDate`, `LocalDateTime`, `Instant` | `string` (ISO). Format for display; don't convert in the model. |
| `enum` | `export enum` with string values equal to the Java names |
| `List<T>` / `Set<T>` | `T[]` |
| `Map<K, V>` | `Record<K, V>` |
| `Page<T>` | `PageResponse<T>` from `shared/models/PageResponse` |
| nullable field | `field: T \| null` (or `field?: T` only if the backend omits it) |

Request bodies get their own model (`CreateXDto`, `UpdateXDto`), matching the Java request DTO.

## 3. Service class (`src/features/<feature>/api/<feature>Service.ts`)

The required pattern:

- a `class <Feature>Service` with one `async` method per endpoint,
- every method returns `(await axios.<method>(...)).data` with an explicit `Promise<T>` return type,
- URLs are built from `baseApiUrl` (`shared/util/baseApi`),
- one instance at the bottom: `const <feature>Service = new <Feature>Service();` then `export default <feature>Service;`.

```ts
import axios from "axios";
import { baseApiUrl } from "../../../shared/util/baseApi";
import type { PageResponse } from "../../../shared/models/PageResponse";
import type { NotificationDto } from "../models/NotificationDto";

export type AllNotificationsParams = {
    page?: number;
    size?: number;
};

class NotificationService {

    async allNotifications(params: AllNotificationsParams = {}): Promise<PageResponse<NotificationDto>> {
        return (await axios.get(`${baseApiUrl}/api/notifications/all`, { params })).data;
    }

    async unreadCount(): Promise<number> {
        return (await axios.get(`${baseApiUrl}/api/notifications/unread-count`)).data;
    }

    async markAsRead(notificationId: string): Promise<void> {
        return (await axios.patch(`${baseApiUrl}/api/notifications/read/${notificationId}`)).data;
    }
}

const notificationService = new NotificationService();
export default notificationService;
```

(The URLs above are an example. Use the real ones from the controller.)

Rules:
- Import the **default `axios`**. Don't call `axios.create()`: the auth interceptor (`registerAuthInterceptor.ts`) is attached to the default instance and handles the token refresh and retry.
- Query params go in `{ params }`, never concatenated into the URL. For list params (`statuses=A&statuses=B`) add `paramsSerializer: { indexes: null }`, as in `jobApplicationService`.
- Method names describe the action (`allX`, `oneX`, `createX`, `updateX`, `deleteX`, `markAsRead`), following the existing services.
- No `try/catch` and no toasts in the service. Errors go to the caller (React Query).
- No React or hooks in the service file.

## 4. Query keys and hooks

Use the service only through TanStack Query. Put a feature's queries in a hook file in `hooks/` (e.g. `useNotifications.ts`) when two or more components use them, or the page would otherwise mix fetching logic with UI. A one-off query in a single component can stay inline (as in `AnalyticsPage`).

Query keys:
- start with the feature name, then the params: `["notifications", params]`, `["notifications", "unread-count"]`,
- invalidate by the prefix (`{ queryKey: ["notifications"] }`) so every variant refreshes,
- reuse existing keys for existing data (`["applications"]`, `["analytics"]`, `["user"]`).

```ts
// Read
const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationService.allNotifications(params),
});

// Write
const queryClient = useQueryClient();
const { mutate: markAsRead, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
        toast.error(error.response?.data?.message ?? "Couldn't mark the notification as read. Please try again.");
    },
});
```

- Type mutation errors as `AxiosError<ApiErrorResponse>` (`shared/models/ApiErrorResponse`) and show `error.response?.data?.message` with a specific fallback message.
- After a write, invalidate every query that shows the changed data (for example, creating an application can also change `["analytics"]` and the activity feed).
- Stop duplicate submissions by disabling the action with `isPending`.
- For polling (unread count), use `refetchInterval` instead of `setInterval` in an effect.
- Follow `.claude/rules/react.md`: memoize derived lists and chart data, and use `useCallback` for handlers returned from a hook.

## 5. UI states

Every component that shows fetched data handles:
- **Loading:** a skeleton or spinner that keeps the layout. Never an endless spinner when the request failed.
- **Error:** a clear message and a retry (`refetch`).
- **Empty:** explains what's missing and offers the next action. "No notifications yet" is different from "no results for this filter".
- **Success:** the data.

When replacing dummy data (such as `data/dummyAiSummary.ts`), delete the dummy import from the component and say whether the dummy file is still used anywhere. Don't delete the file without asking.

## 6. Finish

Report:
- the files created or changed,
- the endpoints used (method + path) and where they're defined in the controller,
- any mismatch found between the Java DTO and the TypeScript model,
- which checks could be run (`npm run lint`, `npm run build`, trying the flow in the running app). Don't run them without the user's approval.

If the change touches UI, run the `ui-validator` skill on the changed components.
