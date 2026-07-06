import { Plus, Edit, Trash } from "lucide-react";
import { ActivityType } from "../models/ActivityDto";

export const getIconFromActivityType = (type: ActivityType): React.ReactNode => {
    console.log("TYPE RECEIVED:", type);
    switch (type) {
        case ActivityType.CREATED:
            return <Plus size={16} />;
        case ActivityType.UPDATED:
            return <Edit size={16} />;
        case ActivityType.DELETED:
            return <Trash size={16} />;
        default:
            return null;
    }
};