// dateFormatter.js

import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export const formatRoundDates = (round) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startDate = round?.startTime
        ? utcToZonedTime(new Date(round.startTime), userTimeZone)
        : null;
    const endDate = round?.endTime
        ? utcToZonedTime(new Date(round.endTime), userTimeZone)
        : null;

    const displayStartDate = startDate
        ? format(startDate, "dd.MM.yyyy HH:mm")
        : "";
    const formattedEndDate = endDate ? format(endDate, "dd.MM.yyyy HH:mm") : "";
    const isSameDay =
        startDate &&
        endDate &&
        format(startDate, "dd.MM.yyyy") === format(endDate, "dd.MM.yyyy");
    const displayEndDate = isSameDay
        ? endDate
            ? format(endDate, "HH:mm")
            : ""
        : formattedEndDate;

    return {
        displayStartDate,
        displayEndDate
    };
};
