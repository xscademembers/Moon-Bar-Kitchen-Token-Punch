import type { SlotCode } from "@/lib/journey/slots";
import { isSlotAfterCurrent, isSlotBeforeCurrent } from "@/lib/journey/slots";
import { BRAND_NAME } from "@/lib/brand";

export type PunchRecord = {
  id: string;
  phone: string;
  name: string;
  slotCode: SlotCode;
  punchDate: string;
  branchCode: string;
  createdAt: string;
};

export type CustomerProgress = {
  level: number;
  stage: number;
  progressPercent: number;
  totalPunches: number;
  todayPunches: PunchRecord[];
  recentActivity: string[];
};

const SLOT_LABELS: Record<SlotCode, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  night: "Night",
};

export function calculateProgress(totalPunches: number): Pick<CustomerProgress, "level" | "stage" | "progressPercent"> {
  const level = Math.floor(totalPunches / 5) + 1;
  const stage = (totalPunches % 5) + 1;
  const progressPercent = Math.round(((totalPunches % 5) / 5) * 100);

  return { level, stage, progressPercent };
}

export type SlotStatus = "Completed" | "Available" | "Missed" | "Upcoming";

export function getSlotStatus(
  slotCode: SlotCode,
  todayPunches: PunchRecord[],
  currentSlot: SlotCode,
  currentHour: number,
): SlotStatus {
  if (todayPunches.some((punch) => punch.slotCode === slotCode)) {
    return "Completed";
  }

  if (slotCode === currentSlot) {
    return "Available";
  }

  if (isSlotBeforeCurrent(slotCode, currentSlot, currentHour)) {
    return "Missed";
  }

  if (isSlotAfterCurrent(slotCode, currentSlot, currentHour)) {
    return "Upcoming";
  }

  return "Missed";
}

export function buildRecentActivity(punches: PunchRecord[]): string[] {
  if (punches.length === 0) {
    return [`Account created. Visit ${BRAND_NAME} and show your QR to collect your first punch.`];
  }

  return punches
    .slice(-5)
    .reverse()
    .map(
      (punch) =>
        `${SLOT_LABELS[punch.slotCode]} punch collected at ${BRAND_NAME} on ${punch.punchDate}`,
    );
}

export function getTodayDateString(timezone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
