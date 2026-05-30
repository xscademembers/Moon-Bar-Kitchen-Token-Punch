import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { normalizePhone } from "@/lib/phone";
import { isSupabaseConfigured, assertStorageBackend } from "@/lib/supabase/config";
import type { SlotCode } from "@/lib/journey/slots";
import {
  createPunchSupabase,
  findCustomerFromPunchesSupabase,
  getCustomerProgressSupabase,
  getTodayPunchCountSupabase,
} from "@/lib/journey/punch-store.supabase";
import {
  buildRecentActivity,
  calculateProgress,
  getTodayDateString,
  type CustomerProgress,
  type PunchRecord,
} from "@/lib/journey/progress";

const DATA_DIR = path.join(process.cwd(), ".data");
const PUNCHES_FILE = path.join(DATA_DIR, "punches.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(PUNCHES_FILE);
  } catch {
    await fs.writeFile(PUNCHES_FILE, "[]", "utf8");
  }
}

async function readPunches(): Promise<PunchRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(PUNCHES_FILE, "utf8");
  if (!raw.trim()) return [];

  try {
    return JSON.parse(raw) as PunchRecord[];
  } catch {
    return [];
  }
}

async function writePunches(punches: PunchRecord[]) {
  await ensureStore();
  await fs.writeFile(PUNCHES_FILE, JSON.stringify(punches, null, 2), "utf8");
}

async function getCustomerProgressJson(phone: string): Promise<CustomerProgress> {
  const normalizedPhone = normalizePhone(phone);
  const punches = await readPunches();
  const customerPunches = punches.filter((punch) => punch.phone === normalizedPhone);
  const today = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);
  const todayPunches = customerPunches.filter((punch) => punch.punchDate === today);
  const { level, stage, progressPercent } = calculateProgress(customerPunches.length);

  return {
    level,
    stage,
    progressPercent,
    totalPunches: customerPunches.length,
    todayPunches,
    recentActivity: buildRecentActivity(customerPunches),
  };
}

async function createPunchJson(input: {
  phone: string;
  name: string;
  slotCode: SlotCode;
  branchCode?: string;
}): Promise<{ ok: true; punch: PunchRecord } | { ok: false; code: string; message: string }> {
  const phone = normalizePhone(input.phone);
  const punchDate = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);
  const punches = await readPunches();

  const duplicate = punches.find(
    (punch) => punch.phone === phone && punch.punchDate === punchDate && punch.slotCode === input.slotCode,
  );

  if (duplicate) {
    return {
      ok: false,
      code: "DUPLICATE_SLOT_PUNCH",
      message: `Customer already punched for ${input.slotCode} today.`,
    };
  }

  const punch: PunchRecord = {
    id: randomUUID(),
    phone,
    name: input.name.trim(),
    slotCode: input.slotCode,
    punchDate,
    branchCode: input.branchCode ?? "moon-bar",
    createdAt: new Date().toISOString(),
  };

  punches.push(punch);
  await writePunches(punches);

  return { ok: true, punch };
}

async function getTodayPunchCountJson() {
  const punches = await readPunches();
  const today = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);
  return punches.filter((punch) => punch.punchDate === today).length;
}

async function findCustomerFromPunchesJson(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const punches = await readPunches();
  const customerPunches = punches
    .filter((punch) => punch.phone === normalizedPhone)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (customerPunches.length === 0) return null;

  return {
    phone: normalizedPhone,
    name: customerPunches[0].name,
  };
}

export async function getCustomerProgress(phone: string): Promise<CustomerProgress> {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return getCustomerProgressSupabase(phone);
  }
  return getCustomerProgressJson(phone);
}

export async function createPunch(input: {
  phone: string;
  name: string;
  slotCode: SlotCode;
  branchCode?: string;
}) {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return createPunchSupabase(input);
  }
  return createPunchJson(input);
}

export async function getTodayPunchCount() {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return getTodayPunchCountSupabase();
  }
  return getTodayPunchCountJson();
}

export async function findCustomerFromPunches(phone: string) {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return findCustomerFromPunchesSupabase(phone);
  }
  return findCustomerFromPunchesJson(phone);
}

export type { CustomerProgress, PunchRecord };
