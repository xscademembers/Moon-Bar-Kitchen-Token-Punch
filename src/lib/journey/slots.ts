export type SlotCode = "morning" | "afternoon" | "night";

const SLOT_ORDER: Record<SlotCode, number> = {
  morning: 0,
  afternoon: 1,
  night: 2,
};

export function resolveSlotFromHour(hour24: number): SlotCode {
  if (hour24 >= 5 && hour24 < 12) return "morning";
  if (hour24 >= 12 && hour24 < 18) return "afternoon";
  return "night";
}

export function getCurrentHourInTimezone(timezone = process.env.NEXT_PUBLIC_APP_TIMEZONE ?? "Asia/Kolkata") {
  const hourPart = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hourCycle: "h23",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "hour");

  return Number(hourPart?.value ?? new Date().getHours());
}

export function resolveCurrentSlot(timezone?: string) {
  const hour = getCurrentHourInTimezone(timezone);
  return { hour, slot: resolveSlotFromHour(hour) };
}

export function isSlotBeforeCurrent(slotCode: SlotCode, currentSlot: SlotCode, currentHour: number) {
  if (currentSlot === "night" && currentHour < 5) {
    return false;
  }

  return SLOT_ORDER[slotCode] < SLOT_ORDER[currentSlot];
}

export function isSlotAfterCurrent(slotCode: SlotCode, currentSlot: SlotCode, currentHour: number) {
  if (currentSlot === "night" && currentHour < 5) {
    return slotCode === "morning" || slotCode === "afternoon";
  }

  return SLOT_ORDER[slotCode] > SLOT_ORDER[currentSlot];
}

