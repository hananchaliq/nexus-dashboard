import { PRAYER_TIMES } from "../utils/constants";

export const usePrayer = () => {
   return { prayerTimes: PRAYER_TIMES, loading: false };
};
