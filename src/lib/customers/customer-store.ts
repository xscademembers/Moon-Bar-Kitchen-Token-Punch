import { promises as fs } from "fs";
import path from "path";
import { normalizePhone } from "@/lib/phone";
import { isSupabaseConfigured, assertStorageBackend } from "@/lib/supabase/config";
import {
  findCustomerByPhoneSupabase,
  upsertCustomerSupabase,
} from "@/lib/customers/customer-store.supabase";

export type CustomerRecord = {
  id?: string;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(CUSTOMERS_FILE);
  } catch {
    await fs.writeFile(CUSTOMERS_FILE, "[]", "utf8");
  }
}

async function readCustomers(): Promise<CustomerRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(CUSTOMERS_FILE, "utf8");
  if (!raw.trim()) return [];

  try {
    return JSON.parse(raw) as CustomerRecord[];
  } catch {
    return [];
  }
}

async function writeCustomers(customers: CustomerRecord[]) {
  await ensureStore();
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf8");
}

async function upsertCustomerJson(phone: string, name: string) {
  const normalizedPhone = normalizePhone(phone);
  const customers = await readCustomers();
  const now = new Date().toISOString();
  const existingIndex = customers.findIndex((customer) => customer.phone === normalizedPhone);

  if (existingIndex >= 0) {
    customers[existingIndex] = {
      ...customers[existingIndex],
      name: name.trim(),
      updatedAt: now,
    };
  } else {
    customers.push({
      phone: normalizedPhone,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeCustomers(customers);
  return customers.find((customer) => customer.phone === normalizedPhone)!;
}

async function findCustomerByPhoneJson(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const customers = await readCustomers();
  return customers.find((customer) => customer.phone === normalizedPhone) ?? null;
}

export async function upsertCustomer(phone: string, name: string) {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return upsertCustomerSupabase(phone, name);
  }
  return upsertCustomerJson(phone, name);
}

export async function findCustomerByPhone(phone: string) {
  assertStorageBackend();
  if (isSupabaseConfigured()) {
    return findCustomerByPhoneSupabase(phone);
  }
  return findCustomerByPhoneJson(phone);
}
