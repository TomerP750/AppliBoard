import { useEffect, useState } from "react";
import { BellIcon, type LucideIcon } from "lucide-react";
import { formatDate, formatTime } from "../../../../shared/util/format_dateTime";
import { IconBadge } from "../../../../shared/ui/IconBadge";
import { NotificationMenu } from "./notifications/NotificationMenu";

type DashboardHeaderProps = {
    Icon: LucideIcon;
    title: string;
};

export function DashboardHeader({ Icon, title }: DashboardHeaderProps) {

    const [notificatinoMenuOpen, setNotificatinoMenuOpen] = useState<boolean>(false);

    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="w-full border-b border-black/10 dark:border-white/10 bg-transparent">
            <div className="flex items-center justify-between gap-6">

                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                    <Icon strokeWidth={1.2} size={30} className=" text-gray-700 dark:text-gray-200 shrink-0" />
                    <h1 className="text-xl lg:text-3xl font-medium text-gray-900 dark:text-gray-100 truncate">
                        {title}
                    </h1>
                </div>

                {/* Right */}
                <div className="relative flex items-center gap-5">
                    <IconBadge
                        countTheme="danger"
                        Icon={BellIcon} count={0}
                        onClick={() => setNotificatinoMenuOpen(prev => !prev)}
                    />
                    <div className="flex flex-col items-end leading-tight text-sm lg:text-base opacity-80">
                        <span className="text-gray-600 dark:text-gray-300">
                            {formatDate(now)}
                        </span>
                        <span className="font-mono text-gray-900 dark:text-gray-100">
                            {formatTime(now)}
                        </span>
                    </div>

                    <NotificationMenu open={notificatinoMenuOpen} />

                </div>

            </div>
        </header>
    );
}