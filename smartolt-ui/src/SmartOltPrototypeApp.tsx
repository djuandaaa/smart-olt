import React, { useMemo, useState, useEffect } from "react";
import { fetchOnus } from "./lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Activity,
  Bell,
  Cable,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Network,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Shield,
  Signal,
  Terminal,
  Wifi,
  XCircle,
} from "lucide-react";

// ------------------------------------------------------------
// SmartOLT-like clickable UI prototype (single-file).
// Focus: replicate SmartOLT ONUs list layout (filters + table) and detail view.
// No real device access.
// ------------------------------------------------------------

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

// Embedded logo (provided by user) as a data URL so the preview can render it.
const LOGO_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAAAUCAYAAACkjuKKAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZjZmZmM4OSwgMjAyMC8wMy8wMi0xMDozMzoxMyAgICAgICAgIj4KPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEiCiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0RjgwMTlEM0QwQzExRUVCQTNGOTc0OTQ3QkVBRjM0IgogIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDRGODAxOUUzRDBDMTFFRUJBM0Y5NzQ5NDdCRUFGMzQiPgogPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDRGODAxOUMzRDBDMTFFRUJBM0Y5NzQ5NDdCRUFGMzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDRGODAxOUQzRDBDMTFFRUJBM0Y5NzQ5NDdCRUFGMzQiLz4KPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz4K+iKMvgAAAAlwSFlzAAAL/wAAC/8Bkaw4SgAAAQhJREFUaEPtmk1ugkAQhP/EP0ELR9B5d7aM6x6t4VE3W0Y0b3NFRnVtYOhvY0t5G2J7mYV3qJg6A7cQmQb5cP6i3y5gQ2N8xJqz4rC0yZg0iZlGk8c3vZ1pC6Xk7Qw1nN8R1GJ3kqU9o2lGmKjF8x3q9xkqkBzCwCw0ZK5kM/3f3v8q9zvT4b+2Bq5aGZQp0W0o5oZQj1B7r7VwHk0mB8CqjK5FjXv2j7D5JgQf8mGgQv3e7g4m4h7lYJt1F0VgkQk8d2Bqv0V2m3mXq3Vv4s7cGm+Wgq9b8mVwO4m5Qz9G2r0s6k+EoQk7x+eQOe3n9Uu4c0cG5aX1XcXy4z2qB0g5r0G9gGxJxg1Qd4gZ8o3wB3Rr4m8w1V4m0m2QyS9Qv8P+gQd3CzJcQm3cFf8AAAAASUVORK5CYII=";

// Lightweight ONT illustration as SVG data URL (no external assets)
const ONT_SVG_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='760' height='260' viewBox='0 0 760 260'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='#f8fafc'/>
        <stop offset='1' stop-color='#e2e8f0'/>
      </linearGradient>
    </defs>
    <rect x='18' y='40' width='724' height='180' rx='24' fill='url(#g)' stroke='#cbd5e1' />
    <rect x='58' y='88' width='160' height='64' rx='10' fill='#0f172a' opacity='0.9'/>
    <rect x='246' y='84' width='360' height='72' rx='12' fill='#eab308' opacity='0.85' stroke='#a16207'/>
    <g fill='#0f172a' opacity='0.75'>
      <rect x='262' y='98' width='52' height='44' rx='6'/>
      <rect x='322' y='98' width='52' height='44' rx='6'/>
      <rect x='382' y='98' width='52' height='44' rx='6'/>
      <rect x='442' y='98' width='52' height='44' rx='6'/>
      <rect x='502' y='98' width='52' height='44' rx='6'/>
      <rect x='562' y='98' width='28' height='44' rx='6'/>
    </g>
    <circle cx='640' cy='122' r='16' fill='#0f172a' opacity='0.8'/>
    <rect x='672' y='104' width='40' height='36' rx='10' fill='#ef4444' opacity='0.85'/>
    <text x='60' y='72' font-size='14' font-family='ui-sans-serif, system-ui' fill='#0f172a' opacity='0.6'>ONT / ONU</text>
  </svg>
  `);

function kpiFmt(n: number) {
  try {
    return new Intl.NumberFormat("en-US").format(n);
  } catch {
    return String(n);
  }
}

function formatNow() {
  const d = new Date();
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

type OltStatus = "Healthy" | "Degraded" | "Down";

type OntStatus = "Online" | "LOS" | "Flapping" | "Offline";

type Olt = {
  id: string;
  name: string;
  vendor: string;
  model: string;
  mgmtIp: string;
  region: string;
  status: OltStatus;
  onuTotal: number;
  onuOnline: number;
  ports: number;
  alarms: number;
  lastSeen: string;
};

type Ont = {
  id: string;
  serial: string;
  customer: string;
  address: { line1: string; line2: string };
  plan: string;
  pppoe: string;
  vlan: number;
  profile: string;
  rx: number;
  tx: number;
  distanceKm: number;
  status: OntStatus;
  lastAuth: string;
  provisioned: boolean;
  onuPath: { board: number; port: number; pon: number; onuId: number };
  ponType: "GPON" | "EPON";
};

type AlarmSeverity = "Critical" | "Major" | "Minor";

type Alarm = {
  id: string;
  severity: AlarmSeverity;
  source: string;
  message: string;
  firstSeen: string;
  ack: boolean;
};

type OnuRow = {
  id: string;
  oltId: string;
  oltName: string;
  status: OntStatus;
  provisioned: boolean;
  nameLines: string[];
  snOrMac: string;
  onuText: string;
  zone: string;
  odb: string;
  signalRx: number;
  signalTx: number;
  distanceKm: number;
  br: "B" | "R";
  vlan: number;
  voip: boolean;
  tv: boolean;
  onuType: string;
  authDate: string;
  profile: string;
  ponType: "GPON" | "EPON";
  board: string;
  port: string;
  pppoe: string;
  plan: string;
  mgmtIp?: string;
  wanIp?: string;
  tr069?: "Active" | "Inactive";
  wanSetupMode?: string;
  onuMode?: string;
};

type SignalBucket = "good" | "mid" | "low";

function signalBucket(rx: number): SignalBucket {
  if (rx > -25) return "good";
  if (rx > -28) return "mid";
  return "low";
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function hashToU32(s: string) {
  // Simple stable hash for demo determinism
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function toIp(a: number, b: number, c: number, d: number) {
  const clamp = (x: number) => Math.max(1, Math.min(254, x));
  return `${clamp(a)}.${clamp(b)}.${clamp(c)}.${clamp(d)}`;
}

function deriveIps(key: string) {
  const h = hashToU32(key);
  const c1 = (h >>> 16) & 255;
  const c2 = (h >>> 8) & 255;
  const c3 = h & 255;
  const mgmt = toIp(192, 168, (c1 % 200) + 10, (c2 % 200) + 10);
  const wan = toIp(100, 64, (c2 % 200) + 10, (c3 % 200) + 10);
  return { mgmt, wan };
}

function genOnts(args: {
  oltId: string;
  vendorPrefix: string;
  count: number;
  vlan: number;
  plan: string;
  profilePool: string[];
  region: string;
  seed: number;
}): Ont[] {
  const r = mulberry32(args.seed);
  const baseBoard = 1;
  const basePon = 1;

  const streets = ["DUSUN", "KAMPUNG", "PERUM", "KOMPLEK", "TEGAL", "TURSARI", "KARANG", "SUKA", "MAJU"];
  const names = [
    "Suci",
    "Vivi",
    "Uzlifat",
    "Kastiyah",
    "Nenci",
    "Nurwati",
    "Alhidayah",
    "Pratama",
    "Lestari",
    "Siregar",
    "Putri",
    "Aminah",
    "Rizky",
    "Dewi",
    "Budi",
  ];
  const villages = ["BARAT", "UTARA", "SELATAN", "TIMUR", "TENGAH", "AMPELGADING", "PAMUTIHAN", "SAWAH"];

  function pick<T>(arr: T[]) {
    return arr[Math.floor(r() * arr.length)];
  }

  const out: Ont[] = [];
  for (let i = 0; i < args.count; i++) {
    const onuId = i + 1;
    const port = 1 + Math.floor(r() * 8);
    const pon = basePon + Math.floor(r() * 2);

    const rx = Math.round((-20 - r() * 14) * 10) / 10;
    const tx = Math.round((1.5 + r() * 1.2) * 10) / 10;

    const st = r();
    const status: OntStatus = st < 0.78 ? "Online" : st < 0.9 ? "LOS" : st < 0.97 ? "Flapping" : "Offline";

    // Provisioned = already configured on OLT (service/profile applied)
    const provisioned = r() > 0.08;

    const dn = String(20230000 + Math.floor(r() * 999)).padStart(8, "0");
    const nm = pick(names).toUpperCase();
    const v1 = pick(streets);
    const v2 = pick(villages);
    const addr1 = `${v1} ${v2}`;
    const addr2 = `RT/RW ${String(1 + Math.floor(r() * 45)).padStart(3, "0")}/${String(1 + Math.floor(r() * 12)).padStart(
      3,
      "0"
    )}`;

    const serialSuffix = String(Math.floor(r() * 0xffffffff))
      .toString(16)
      .toUpperCase()
      .padStart(8, "0")
      .slice(0, 8);

    const profile = pick(args.profilePool);

    // Deterministic-ish auth date for demo; unconfigured has "-"
    const day = 1 + Math.floor(r() * 28);
    const hh = Math.floor(r() * 24);
    const mm = Math.floor(r() * 60);
    const ss = Math.floor(r() * 60);
    const lastAuth = provisioned
      ? `${String(day).padStart(2, "0")}-02-2026 ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(
          ss
        ).padStart(2, "0")}`
      : "-";

    out.push({
      id: `ONT-${args.oltId}-${String(onuId).padStart(5, "0")}`,
      serial: `${args.vendorPrefix}${serialSuffix}`,
      customer: `${dn} ${nm}`,
      address: { line1: addr1, line2: addr2 },
      plan: args.plan,
      pppoe: `${dn.toLowerCase()}@isp`,
      vlan: args.vlan,
      profile,
      rx,
      tx,
      distanceKm: Math.round((1 + r() * 18) * 10) / 10,
      status,
      lastAuth,
      provisioned,
      onuPath: { board: baseBoard, port, pon, onuId },
      ponType: "GPON",
    });
  }
  return out;
}

const MOCK: {
  me: { name: string; role: string; tenant: string };
  oltVendors: string[];
  regions: string[];
  olt: Olt[];
  ont: Record<string, Ont[]>;
  alarms: Alarm[];
  trafficSeries: Array<{ t: string; up: number; down: number }>;
} = {
  me: { name: "Operator", role: "NOC", tenant: "ISP Demo" },
  oltVendors: ["Huawei", "ZTE", "Nokia", "Fiberhome", "Other"],
  regions: ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"],
  olt: [
    {
      id: "OLT-JKT-01",
      name: "OLT-C300-PEMALANG",
      vendor: "Huawei",
      model: "MA5800-X7",
      mgmtIp: "10.10.10.2",
      region: "Jakarta",
      status: "Healthy",
      onuTotal: 4096,
      onuOnline: 3921,
      ports: 32,
      alarms: 2,
      lastSeen: "2m ago",
    },
    {
      id: "OLT-BDG-02",
      name: "BDG-North-02",
      vendor: "ZTE",
      model: "C320",
      mgmtIp: "10.20.10.2",
      region: "Bandung",
      status: "Degraded",
      onuTotal: 2048,
      onuOnline: 1860,
      ports: 16,
      alarms: 7,
      lastSeen: "1m ago",
    },
    {
      id: "OLT-SBY-01",
      name: "SBY-East-01",
      vendor: "Huawei",
      model: "MA5608T",
      mgmtIp: "10.30.10.2",
      region: "Surabaya",
      status: "Down",
      onuTotal: 1024,
      onuOnline: 0,
      ports: 8,
      alarms: 19,
      lastSeen: "18m ago",
    },
  ],
  ont: {
    "OLT-JKT-01": genOnts({
      oltId: "JKT01",
      vendorPrefix: "HWTC",
      count: 160,
      vlan: 103,
      plan: "Home 50 Mbps",
      profilePool: ["ALL-ONT", "Router", "Bridge"],
      region: "Jakarta",
      seed: 101,
    }),
    "OLT-BDG-02": genOnts({
      oltId: "BDG02",
      vendorPrefix: "HWTC",
      count: 120,
      vlan: 103,
      plan: "Home 50 Mbps",
      profilePool: ["ALL-ONT", "Router", "Bridge"],
      region: "Bandung",
      seed: 202,
    }),
    "OLT-SBY-01": genOnts({
      oltId: "SBY01",
      vendorPrefix: "HWTC",
      count: 40,
      vlan: 103,
      plan: "Home 50 Mbps",
      profilePool: ["ALL-ONT", "Router", "Bridge"],
      region: "Surabaya",
      seed: 303,
    }),
  },
  alarms: [
    {
      id: "AL-20019",
      severity: "Critical",
      source: "OLT-SBY-01",
      message: "OLT unreachable (SNMP timeout)",
      firstSeen: "18m ago",
      ack: false,
    },
    {
      id: "AL-20021",
      severity: "Major",
      source: "OLT-BDG-02",
      message: "PON port 1/5 high CRC errors",
      firstSeen: "12m ago",
      ack: false,
    },
    {
      id: "AL-20022",
      severity: "Minor",
      source: "OLT-JKT-01",
      message: "ONT optical power low",
      firstSeen: "9m ago",
      ack: true,
    },
  ],
  trafficSeries: [
    { t: "00:00", up: 120, down: 880 },
    { t: "02:00", up: 95, down: 760 },
    { t: "04:00", up: 80, down: 640 },
    { t: "06:00", up: 110, down: 900 },
    { t: "08:00", up: 180, down: 1240 },
    { t: "10:00", up: 210, down: 1420 },
    { t: "12:00", up: 240, down: 1560 },
    { t: "14:00", up: 230, down: 1510 },
    { t: "16:00", up: 260, down: 1650 },
    { t: "18:00", up: 310, down: 1920 },
    { t: "20:00", up: 340, down: 2100 },
    { t: "22:00", up: 260, down: 1720 },
  ],
};

function buildOnuRows(): OnuRow[] {
  const oltsById = new Map(MOCK.olt.map((o) => [o.id, o] as const));

  const rows: OnuRow[] = [];
  for (const [oltId, onts] of Object.entries(MOCK.ont)) {
    const olt = oltsById.get(oltId);
    if (!olt) continue;

    for (const o of onts) {
      const isRouter = o.profile.toLowerCase().includes("router") || o.profile === "ALL-ONT";
      const br: "B" | "R" = isRouter ? "R" : "B";
      const onuText = `${olt.name} gpon-onu_${o.onuPath.board}/${o.onuPath.port}/${o.onuPath.pon}:${o.onuPath.onuId}`;

      const { mgmt, wan } = deriveIps(o.id);
      const canExposeIp = o.provisioned && o.status === "Online";

      rows.push({
        id: o.id,
        oltId,
        oltName: olt.name,
        status: o.status,
        provisioned: o.provisioned,
        nameLines: [o.customer, o.address.line1, o.address.line2],
        snOrMac: o.serial,
        onuText,
        zone: "Zone 1",
        odb: "None",
        signalRx: o.rx,
        signalTx: o.tx,
        distanceKm: o.distanceKm,
        br,
        vlan: o.vlan,
        voip: false,
        tv: false,
        onuType: "ALL-ONT",
        authDate: o.lastAuth,
        profile: o.profile,
        ponType: o.ponType,
        board: String(o.onuPath.board),
        port: String(o.onuPath.port),
        pppoe: o.pppoe,
        plan: o.plan,
        mgmtIp: canExposeIp ? mgmt : undefined,
        wanIp: canExposeIp ? wan : undefined,
        tr069: o.provisioned ? (o.status === "Online" ? "Active" : "Inactive") : "Inactive",
        wanSetupMode: "Setup via ONU webpage",
        onuMode: isRouter ? `Routing - WAN vlan: ${o.vlan}` : `Bridge - WAN vlan: ${o.vlan}`,
      });
    }
  }
  return rows;
}

// -------------------------
// Filtering helpers (pure)
// -------------------------

function filterOlts(
  olts: Olt[],
  args: {
    q: string;
    region: string;
    vendor: string;
    status: string;
    onlyProblem: boolean;
  }
) {
  const ql = args.q.trim().toLowerCase();
  return olts
    .filter((o) => {
      const hitQ = !ql || `${o.name} ${o.id} ${o.model} ${o.mgmtIp}`.toLowerCase().includes(ql);
      const hitR = args.region === "all" || o.region === args.region;
      const hitV = args.vendor === "all" || o.vendor === args.vendor;
      const hitS = args.status === "all" || o.status === args.status;
      const hitP = !args.onlyProblem || o.status !== "Healthy";
      return hitQ && hitR && hitV && hitS && hitP;
    })
    .sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status.localeCompare(b.status)));
}

function filterAlarms(
  alarms: Alarm[],
  args: {
    q: string;
    severity: string;
    source: string;
    onlyUnacked: boolean;
  }
) {
  const ql = args.q.trim().toLowerCase();
  return alarms.filter((a) => {
    const hitQ = !ql || `${a.id} ${a.source} ${a.message}`.toLowerCase().includes(ql);
    const hitAck = !args.onlyUnacked || !a.ack;
    const hitSev = args.severity === "all" || a.severity === args.severity;
    const hitSrc = args.source === "all" || a.source === args.source;
    return hitQ && hitAck && hitSev && hitSrc;
  });
}

function filterOnuRows(
  rows: OnuRow[],
  args: {
    q: string;
    olt: string;
    board: string;
    port: string;
    zone: string;
    odb: string;
    vlan: string;
    onuType: string;
    profile: string;
    ponType: string;
    statusSet: Set<OntStatus>;
    sigSet: Set<SignalBucket>;
    br: "any" | "B" | "R";
    configuredMode: "configured" | "unconfigured";
  }
) {
  const ql = args.q.trim().toLowerCase();
  const vlanNum = args.vlan === "any" ? null : Number(args.vlan);
  const useVlan = vlanNum !== null && Number.isFinite(vlanNum);

  return rows.filter((r) => {
    const ip = `${r.mgmtIp ?? ""} ${r.wanIp ?? ""}`;

    const hitQ =
      !ql ||
      `${r.snOrMac} ${r.oltName} ${r.onuText} ${r.nameLines.join(" ")} ${r.pppoe} ${ip}`.toLowerCase().includes(ql);

    const hitOlt = args.olt === "any" || r.oltId === args.olt;
    const hitBoard = args.board === "any" || r.board === args.board;
    const hitPort = args.port === "any" || r.port === args.port;
    const hitZone = args.zone === "any" || r.zone === args.zone;
    const hitOdb = args.odb === "any" || r.odb === args.odb;
    const hitVlan = !useVlan || r.vlan === vlanNum;
    const hitType = args.onuType === "any" || r.onuType === args.onuType;
    const hitProfile = args.profile === "any" || r.profile === args.profile;
    const hitPon = args.ponType === "any" || r.ponType === args.ponType;

    const hitStatus = args.statusSet.size === 0 || args.statusSet.has(r.status);
    const hitSig = args.sigSet.size === 0 || args.sigSet.has(signalBucket(r.signalRx));
    const hitBR = args.br === "any" || r.br === args.br;

    // Expected behavior from user:
    // Unconfigured = ONT discovered but NOT yet configured (NOT provisioned).
    // Configured = ONT already configured (provisioned).
    const hitCfg = args.configuredMode === "configured" ? r.provisioned : !r.provisioned;

    return (
      hitQ &&
      hitOlt &&
      hitBoard &&
      hitPort &&
      hitZone &&
      hitOdb &&
      hitVlan &&
      hitType &&
      hitProfile &&
      hitPon &&
      hitStatus &&
      hitSig &&
      hitBR &&
      hitCfg
    );
  });
}

// -------------------------
// Small UI bits
// -------------------------

function StatusDot({ status }: { status: OntStatus }) {
  const cls =
    status === "Online"
      ? "bg-emerald-500"
      : status === "LOS"
        ? "bg-rose-500"
        : status === "Flapping"
          ? "bg-amber-500"
          : "bg-slate-400";
  return <span className={cx("inline-block h-2.5 w-2.5 rounded-full", cls)} />;
}

function StatusPill({ status }: { status: string }) {
  const cfg =
    status === "Healthy"
      ? { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : status === "Degraded"
        ? { icon: Activity, cls: "bg-amber-50 text-amber-700 border-amber-200" }
        : status === "Down"
          ? { icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" }
          : status === "Online"
            ? { icon: Wifi, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
            : status === "LOS"
              ? { icon: Cable, cls: "bg-rose-50 text-rose-700 border-rose-200" }
              : status === "Flapping"
                ? { icon: RefreshCcw, cls: "bg-amber-50 text-amber-700 border-amber-200" }
                : { icon: Signal, cls: "bg-slate-50 text-slate-700 border-slate-200" };
  const Icon = cfg.icon;
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs", cfg.cls)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function SeverityPill({ sev }: { sev: AlarmSeverity }) {
  const cfg =
    sev === "Critical"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : sev === "Major"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-50 text-slate-700 border-slate-200";
  return <span className={cx("inline-flex rounded-full border px-2 py-0.5 text-xs", cfg)}>{sev}</span>;
}

function SignalBars({ rx }: { rx: number }) {
  const b = signalBucket(rx);
  const on = b === "good" ? 3 : b === "mid" ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5" title={`RX ${rx} dBm`}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cx(
            "w-1 rounded-sm",
            i === 1 ? "h-2" : i === 2 ? "h-3" : "h-4",
            i <= on ? (b === "good" ? "bg-emerald-500" : b === "mid" ? "bg-amber-500" : "bg-rose-500") : "bg-slate-200"
          )}
        />
      ))}
    </div>
  );
}

function TopNavShell({
  route,
  onRoute,
  onLogout,
  children,
}: {
  route: string;
  onRoute: (r: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const items: Array<{ k: string; label: string }> = [
    { k: "unconfigured", label: "Unconfigured" },
    { k: "configured", label: "Configured" },
    { k: "graphs", label: "Graphs" },
    { k: "diagnostics", label: "Diagnostics" },
    { k: "tasks", label: "Tasks" },
    { k: "reports", label: "Reports" },
    { k: "alarms", label: "Alarms" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(56,189,248,0.50),transparent_60%),radial-gradient(circle_at_75%_50%,rgba(99,102,241,0.45),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.30] [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex h-14 items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-white/10 ring-1 ring-white/15">
                <img src={LOGO_DATA_URL} alt="logo" className="h-5 w-auto" />
              </div>
              <div className="text-sm font-semibold tracking-wide">SMARTOLT</div>
              <div className="hidden items-center gap-1 text-xs text-white/75 md:flex">
                <span className="rounded bg-white/10 px-2 py-0.5">{MOCK.me.tenant}</span>
                <span className="rounded bg-white/10 px-2 py-0.5">{MOCK.me.role}</span>
              </div>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              {items.map((it) => {
                const active = route === it.k;
                return (
                  <button
                    key={it.k}
                    onClick={() => onRoute(it.k)}
                    className={cx(
                      "rounded px-3 py-1.5 text-sm transition",
                      active ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10"
                    )}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-9 rounded bg-white/15 text-white hover:bg-white/20"
                onClick={() => {
                  onRoute(route);
                }}
              >
                Save config
              </Button>

              <button
                className="inline-flex h-9 items-center gap-2 rounded bg-white/15 px-3 text-sm text-white hover:bg-white/20"
                onClick={() => onRoute("settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              <Button className="h-9 rounded bg-white text-slate-900 hover:bg-white/90" onClick={onLogout}>
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4">{children}</div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const canSignIn = email.trim().length > 2 && pass.trim().length > 2;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,100,200,0.45),transparent_45%),radial-gradient(circle_at_82%_20%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_52%_90%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15">
                <img src={LOGO_DATA_URL} alt="logo" className="h-6 w-auto" />
              </div>
              <div>
                <div className="text-2xl font-semibold leading-tight">SmartOLT</div>
                <div className="text-sm text-white/70">Cloud portal for OLT & ONT operations</div>
              </div>
            </div>

            <div className="mt-6 max-w-md text-sm leading-relaxed text-white/75">
              Prototype UI only. Any credentials work. After sign in, open Unconfigured to see ONTs not yet provisioned.
            </div>

            <div className="mt-6 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Network className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">ONUs list</div>
                    <div className="mt-1 text-xs text-white/70">Search + filter like SmartOLT</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Alarms</div>
                    <div className="mt-1 text-xs text-white/70">Ack incidents and triage</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Terminal className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Provisioning</div>
                    <div className="mt-1 text-xs text-white/70">Simulate activation + IP</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Access control</div>
                    <div className="mt-1 text-xs text-white/70">Roles, audit readiness</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Sign in</CardTitle>
              <div className="text-xs text-white/70">Prototype only. Any credentials work.</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-white/80">Email</div>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-white/80">Password</div>
                <Input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  <div className="text-xs text-white/70">Remember me</div>
                </div>
                <button className="text-xs text-white/70 hover:text-white" type="button">
                  Forgot password?
                </button>
              </div>

              <Button
                className="w-full rounded-2xl bg-white text-slate-900 hover:bg-white/90"
                onClick={onLogin}
                disabled={!canSignIn}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Sign in
              </Button>

              <Separator className="bg-white/10" />

              <div className="text-xs text-white/60">No real authentication or device access.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Pages
// -------------------------

function Graphs() {
  const totalOlts = MOCK.olt.length;
  const totalOnt = MOCK.olt.reduce((a, o) => a + o.onuTotal, 0);
  const onlineOnt = MOCK.olt.reduce((a, o) => a + o.onuOnline, 0);
  const onlinePct = totalOnt ? Math.round((onlineOnt / totalOnt) * 100) : 0;

  const critical = MOCK.alarms.filter((a) => a.severity === "Critical" && !a.ack).length;
  const major = MOCK.alarms.filter((a) => a.severity === "Major" && !a.ack).length;
  const totalActive = MOCK.alarms.filter((a) => !a.ack).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">OLT Fleet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold">{kpiFmt(totalOlts)}</div>
            <div className="text-xs text-slate-500">Registered OLTs</div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded">
                Huawei {MOCK.olt.filter((x) => x.vendor === "Huawei").length}
              </Badge>
              <Badge variant="outline" className="rounded">
                ZTE {MOCK.olt.filter((x) => x.vendor === "ZTE").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ONT Online</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-semibold">{onlinePct}%</div>
                <div className="text-xs text-slate-500">
                  {kpiFmt(onlineOnt)} / {kpiFmt(totalOnt)}
                </div>
              </div>
              <Wifi className="h-6 w-6" />
            </div>
            <Progress value={onlinePct} />
            <div className="text-xs text-slate-500">Fleet availability snapshot</div>
          </CardContent>
        </Card>

        <Card className="rounded">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Alarms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{kpiFmt(totalActive)}</div>
              <Bell className="h-6 w-6" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <SeverityPill sev="Critical" />
              <span className="text-slate-600">{critical}</span>
              <SeverityPill sev="Major" />
              <span className="text-slate-600">{major}</span>
            </div>
            <div className="text-xs text-slate-500">Unacknowledged incidents</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Traffic (Gbps)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK.trafficSeries} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
                <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="down" fillOpacity={0.12} strokeWidth={2} />
                <Area type="monotone" dataKey="up" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Alarms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK.alarms.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded border bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SeverityPill sev={a.severity} />
                    <div className="text-sm font-medium">{a.source}</div>
                  </div>
                  <div className="text-xs text-slate-500">{a.firstSeen}</div>
                </div>
                <div className="mt-2 text-sm text-slate-700">{a.message}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function genMiniSeries(seedKey: string) {
  const r = mulberry32(hashToU32(seedKey));
  const points: Array<{ t: string; v: number }> = [];
  const labels = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  let base = 200 + Math.floor(r() * 200);
  for (let i = 0; i < labels.length; i++) {
    const drift = (r() - 0.5) * 60;
    base = Math.max(50, base + drift);
    points.push({ t: labels[i], v: Math.round(base) });
  }
  return points;
}

function OnuDetailsDialog({
  open,
  onOpenChange,
  row,
  onConfigure,
  onResync,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: OnuRow | null;
  onConfigure: (id: string) => void;
  onResync: (id: string) => void;
}) {
  const traffic = useMemo(() => {
    if (!row) return [] as Array<{ t: string; up: number; down: number }>;
    const up = genMiniSeries(`${row.id}-up`);
    const down = genMiniSeries(`${row.id}-down`);
    return up.map((p, i) => ({ t: p.t, up: Math.round(p.v / 10), down: Math.round(down[i]?.v ?? p.v) }));
  }, [row]);

  const signal = useMemo(() => {
    if (!row) return [] as Array<{ t: string; rx: number }>;
    const s = genMiniSeries(`${row.id}-sig`);
    // Map to dBm window
    return s.map((p) => ({ t: p.t, rx: Math.round((-32 + (p.v % 14)) * 10) / 10 }));
  }, [row]);

  const ipLabel = (x?: string) => x ?? "Inactive";
  const canConfigure = row && !row.provisioned;

  const speedRows = row
    ? [{ download: row.plan.includes("1G") ? "1G" : row.plan.includes("100") ? "100M" : "50M", upload: "server" }]
    : [];

  const ethRows = row
    ? [
        { port: "eth_0/1", admin: "Enabled", mode: "LAN", dhcp: "From ONU" },
        { port: "eth_0/2", admin: "Enabled", mode: "LAN", dhcp: "From ONU" },
        { port: "eth_0/3", admin: "Enabled", mode: "LAN", dhcp: "From ONU" },
        { port: "eth_0/4", admin: "Enabled", mode: "LAN", dhcp: "From ONU" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded">
        <DialogHeader>
          <DialogTitle>ONU Details</DialogTitle>
        </DialogHeader>

        {!row ? (
          <div className="p-4 text-sm text-slate-600">No ONU selected.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded bg-amber-500/90 px-4 py-3 text-white">
              <div className="text-sm">
                The settings of this ONU were imported. Please use the “Resync config” button before doing any changes to the ONU.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="h-8 rounded bg-white/20 px-3 text-white hover:bg-white/30"
                  onClick={() => onResync(row.id)}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Resync config
                </Button>
                <DialogClose asChild>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-white/20 hover:bg-white/30" aria-label="Close">
                    ✕
                  </button>
                </DialogClose>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded border bg-white p-3">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-slate-500">OLT</span>
                        <div className="font-medium">{row.oltName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Board</span>
                        <div className="font-medium">{row.board}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Port</span>
                        <div className="font-medium">{row.port}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">ONU</span>
                        <div className="font-mono text-xs">{row.onuText}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">GPON channel</span>
                        <div className="font-medium">{row.ponType}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-slate-500">SN</span>
                        <div className="font-mono text-xs">{row.snOrMac}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">ONU type</span>
                        <div className="font-medium">{row.onuType}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Zone</span>
                        <div className="font-medium">{row.zone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">ODB (Splitter)</span>
                        <div className="font-medium">{row.odb}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Name</span>
                        <div className="font-medium">{row.nameLines[0]}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded border bg-white p-3">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="space-y-1 text-sm">
                      <div className="text-xs text-slate-500">Status</div>
                      <StatusPill status={row.status} />
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-slate-500">ONU/OLT Rx signal</span>
                        <span className="font-medium">{row.signalRx} dBm</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Distance</span>
                        <span className="font-medium">{row.distanceKm} km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Attached VLANs</span>
                        <span className="font-medium">{row.vlan}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="text-xs text-slate-500">Provisioning</div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Provisioned</span>
                        <span className={cx("font-medium", row.provisioned ? "text-emerald-700" : "text-amber-700")}>
                          {row.provisioned ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">ONU mode</span>
                        <span className="font-medium">{row.onuMode ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">TR069</span>
                        <span className="font-medium">{row.tr069 ?? "Inactive"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Mgmt IP</span>
                        <span className="font-medium">{ipLabel(row.mgmtIp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">WAN IP</span>
                        <span className="font-medium">{ipLabel(row.wanIp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">WAN setup mode</span>
                        <span className="font-medium">{row.wanSetupMode ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">PPPoE</span>
                        <span className="font-mono text-xs">{row.pppoe}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="h-9 rounded">
                    Get status
                  </Button>
                  <Button variant="outline" className="h-9 rounded">
                    Show running-config
                  </Button>
                  <Button variant="outline" className="h-9 rounded">
                    SW info
                  </Button>
                  <Button className="h-9 rounded bg-emerald-600 text-white hover:bg-emerald-700">LIVE!</Button>
                  {canConfigure && (
                    <Button className="h-9 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => onConfigure(row.id)}>
                      Configure
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border bg-white p-3">
                  <div className="text-xs text-slate-500">Device</div>
                  <div className="mt-2 flex items-center justify-center rounded bg-slate-50 p-2">
                    <img src={ONT_SVG_DATA_URL} alt="onu" className="h-36 w-auto" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded border bg-white p-3">
                    <div className="text-xs text-slate-500">Traffic</div>
                    <div className="mt-2 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={traffic} margin={{ left: 0, right: 10, top: 8, bottom: 0 }}>
                          <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="down" fillOpacity={0.10} strokeWidth={2} />
                          <Area type="monotone" dataKey="up" fillOpacity={0.10} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded border bg-white p-3">
                    <div className="text-xs text-slate-500">Signal</div>
                    <div className="mt-2 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={signal} margin={{ left: 0, right: 10, top: 8, bottom: 0 }}>
                          <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} domain={[-35, -18]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="rx" fillOpacity={0.10} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="rounded border bg-white p-3">
                  <div className="text-xs text-slate-500">Speed profiles</div>
                  <div className="mt-2 rounded border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Download</TableHead>
                          <TableHead>Upload</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {speedRows.map((s, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{s.download}</TableCell>
                            <TableCell>{s.upload}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" className="h-8 rounded">
                                Configure
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="rounded border bg-white p-3">
                  <div className="text-xs text-slate-500">Ethernet ports</div>
                  <div className="mt-2 rounded border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Port</TableHead>
                          <TableHead>Admin state</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>DHCP</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ethRows.map((e) => (
                          <TableRow key={e.port}>
                            <TableCell>{e.port}</TableCell>
                            <TableCell>{e.admin}</TableCell>
                            <TableCell>{e.mode}</TableCell>
                            <TableCell>{e.dhcp}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" className="h-8 rounded">
                                Configure
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded border bg-white p-3">
              <div className="text-xs text-slate-500">Auth date</div>
              <div className="mt-1 text-sm font-medium">{row.authDate}</div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button className="rounded">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OnuListPage({
  mode,
  rows,
  onConfigure,
  onResync,
}: {
  mode: "configured" | "unconfigured";
  rows: OnuRow[];
  onConfigure: (id: string) => void;
  onResync: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [olt, setOlt] = useState<string>("any");
  const [board, setBoard] = useState("any");
  const [port, setPort] = useState("any");
  const [zone, setZone] = useState("any");
  const [odb, setOdb] = useState("any");
  const [vlan, setVlan] = useState("any");
  const [onuType, setOnuType] = useState("any");
  const [profile, setProfile] = useState("any");
  const [ponType, setPonType] = useState("any");

  const [statusSet, setStatusSet] = useState<Set<OntStatus>>(new Set());
  const [sigSet, setSigSet] = useState<Set<SignalBucket>>(new Set());
  const [br, setBr] = useState<"any" | "B" | "R">("any");

  const [page, setPage] = useState(1);
  const pageSize = 100;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const optBoards = useMemo(() => Array.from(new Set(rows.map((r) => r.board))).sort(), [rows]);
  const optPorts = useMemo(
    () => Array.from(new Set(rows.map((r) => r.port))).sort((a, b) => Number(a) - Number(b)),
    [rows]
  );
  const optZones = useMemo(() => Array.from(new Set(rows.map((r) => r.zone))).sort(), [rows]);
  const optOdb = useMemo(() => Array.from(new Set(rows.map((r) => r.odb))).sort(), [rows]);
  const optVlan = useMemo(
    () => Array.from(new Set(rows.map((r) => String(r.vlan)))).sort((a, b) => Number(a) - Number(b)),
    [rows]
  );
  const optOnuType = useMemo(() => Array.from(new Set(rows.map((r) => r.onuType))).sort(), [rows]);
  const optProfile = useMemo(() => Array.from(new Set(rows.map((r) => r.profile))).sort(), [rows]);
  const optPon = useMemo(() => Array.from(new Set(rows.map((r) => r.ponType))).sort(), [rows]);

  const filtered = useMemo(() => {
    return filterOnuRows(rows, {
      q,
      olt,
      board,
      port,
      zone,
      odb,
      vlan,
      onuType,
      profile,
      ponType,
      statusSet,
      sigSet,
      br,
      configuredMode: mode,
    });
  }, [rows, q, olt, board, port, zone, odb, vlan, onuType, profile, ponType, statusSet, sigSet, br, mode]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(total, startIdx + pageSize);
  const slice = filtered.slice(startIdx, endIdx);

  const selectedRow = useMemo(() => {
    if (!selectedId) return null;
    return rows.find((r) => r.id === selectedId) ?? null;
  }, [rows, selectedId]);

  function toggleStatus(s: OntStatus) {
    setPage(1);
    setStatusSet((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function toggleSig(b: SignalBucket) {
    setPage(1);
    setSigSet((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  }

  function resetAll() {
    setQ("");
    setOlt("any");
    setBoard("any");
    setPort("any");
    setZone("any");
    setOdb("any");
    setVlan("any");
    setOnuType("any");
    setProfile("any");
    setPonType("any");
    setStatusSet(new Set());
    setSigSet(new Set());
    setBr("any");
    setPage(1);
  }

  const title = mode === "configured" ? "Configured" : "Unconfigured";

  return (
    <Card className="rounded">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="text-xs text-slate-600">
            {total === 0 ? 0 : startIdx + 1}-{endIdx} ONUs of {kpiFmt(total)} displayed
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded border bg-white p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="text-xs text-slate-600">Search</div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  placeholder="SN, IP, name, address, pppoe"
                  className="h-9 rounded pl-8"
                />
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-600">OLT</div>
              <Select
                value={olt}
                onValueChange={(v) => {
                  setPage(1);
                  setOlt(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {MOCK.olt.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">Board</div>
              <Select
                value={board}
                onValueChange={(v) => {
                  setPage(1);
                  setBoard(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optBoards.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">Port</div>
              <Select
                value={port}
                onValueChange={(v) => {
                  setPage(1);
                  setPort(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optPorts.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">Zone</div>
              <Select
                value={zone}
                onValueChange={(v) => {
                  setPage(1);
                  setZone(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optZones.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-6">
            <div>
              <div className="text-xs text-slate-600">ODB</div>
              <Select
                value={odb}
                onValueChange={(v) => {
                  setPage(1);
                  setOdb(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optOdb.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">VLAN</div>
              <Select
                value={vlan}
                onValueChange={(v) => {
                  setPage(1);
                  setVlan(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optVlan.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">ONU type</div>
              <Select
                value={onuType}
                onValueChange={(v) => {
                  setPage(1);
                  setOnuType(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optOnuType.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">Profile</div>
              <Select
                value={profile}
                onValueChange={(v) => {
                  setPage(1);
                  setProfile(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optProfile.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-slate-600">PON type</div>
              <Select
                value={ponType}
                onValueChange={(v) => {
                  setPage(1);
                  setPonType(v);
                }}
              >
                <SelectTrigger className="h-9 rounded">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {optPon.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className={cx("h-9 rounded px-3", br === "B" ? "bg-slate-900 text-white" : "")}
                  onClick={() => {
                    setPage(1);
                    setBr(br === "B" ? "any" : "B");
                  }}
                >
                  B
                </Button>
                <Button
                  variant="outline"
                  className={cx("h-9 rounded px-3", br === "R" ? "bg-slate-900 text-white" : "")}
                  onClick={() => {
                    setPage(1);
                    setBr(br === "R" ? "any" : "R");
                  }}
                >
                  R
                </Button>
              </div>

              <Button variant="outline" className="h-9 w-9 rounded p-0" title="Reset" onClick={resetAll}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-600">Status</div>
              <div className="inline-flex overflow-hidden rounded border bg-white">
                {(["Online", "LOS", "Flapping", "Offline"] as OntStatus[]).map((s) => {
                  const active = statusSet.has(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className={cx(
                        "inline-flex items-center gap-2 px-3 py-2 text-xs",
                        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <StatusDot status={s} />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-600">Signal</div>
              <div className="inline-flex overflow-hidden rounded border bg-white">
                {([
                  { k: "good" as const, label: "Good" },
                  { k: "mid" as const, label: "Mid" },
                  { k: "low" as const, label: "Low" },
                ] as const).map((x) => {
                  const active = sigSet.has(x.k);
                  return (
                    <button
                      key={x.k}
                      onClick={() => toggleSig(x.k)}
                      className={cx(
                        "inline-flex items-center gap-2 px-3 py-2 text-xs",
                        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <SignalBars rx={x.k === "good" ? -23 : x.k === "mid" ? -26.5 : -30.5} />
                      {x.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-500">Mapping: Unconfigured = not provisioned yet. Configured = provisioned.</div>
          </div>
        </div>

        <div className="rounded border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">Status</TableHead>
                <TableHead className="w-[80px]">View</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[140px]">SN / MAC</TableHead>
                <TableHead className="w-[220px]">ONU</TableHead>
                <TableHead className="w-[90px]">Zone</TableHead>
                <TableHead className="w-[90px]">ODB</TableHead>
                <TableHead className="w-[80px]">Signal</TableHead>
                <TableHead className="w-[70px]">B/R</TableHead>
                <TableHead className="w-[70px]">VLAN</TableHead>
                <TableHead className="w-[70px]">VoIP</TableHead>
                <TableHead className="w-[60px]">TV</TableHead>
                <TableHead className="w-[90px]">Type</TableHead>
                <TableHead className="w-[110px]">Auth date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((r) => (
                <TableRow key={r.id} className={cx(!r.provisioned ? "bg-amber-50/40" : "")}>
                  <TableCell>
                    <StatusDot status={r.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="h-8 rounded bg-blue-600 px-3 text-white hover:bg-blue-700"
                      onClick={() => {
                        setSelectedId(r.id);
                        setDetailsOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      {r.nameLines.map((ln, idx) => (
                        <div
                          key={idx}
                          className={cx("leading-tight", idx === 0 ? "font-medium text-slate-900" : "text-xs text-slate-600")}
                        >
                          {ln}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs">{r.snOrMac}</TableCell>
                  <TableCell className="text-xs text-slate-700">{r.onuText}</TableCell>
                  <TableCell className="text-xs">{r.zone}</TableCell>
                  <TableCell className="text-xs">{r.odb}</TableCell>
                  <TableCell>
                    <SignalBars rx={r.signalRx} />
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded bg-slate-800 px-2 py-0.5 text-xs text-white">{r.br === "R" ? "Router" : "Bridge"}</span>
                  </TableCell>
                  <TableCell className="text-xs">{r.vlan}</TableCell>
                  <TableCell className="text-xs">{r.voip ? "Y" : ""}</TableCell>
                  <TableCell className="text-xs">{r.tv ? "Y" : ""}</TableCell>
                  <TableCell className="text-xs">{r.onuType}</TableCell>
                  <TableCell className="text-xs">{r.authDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {slice.length === 0 && <div className="p-6 text-center text-sm text-slate-600">No ONUs match the filters.</div>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((p) => {
              if (p > pageCount) return null;
              return (
                <Button
                  key={p}
                  variant="outline"
                  className={cx("h-9 rounded px-3", safePage === p ? "bg-slate-900 text-white" : "")}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              className="h-9 rounded px-3"
              disabled={safePage >= pageCount}
              onClick={() => setPage(Math.min(pageCount, safePage + 1))}
            >
              &gt;
            </Button>
            <Button variant="outline" className="h-9 rounded px-3" disabled={safePage >= pageCount} onClick={() => setPage(pageCount)}>
              &gt;&gt;
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            Page {safePage} / {pageCount}
          </div>
        </div>

        <OnuDetailsDialog
          open={detailsOpen}
          onOpenChange={(v) => {
            setDetailsOpen(v);
            if (!v) setSelectedId(null);
          }}
          row={selectedRow}
          onConfigure={(id) => {
            onConfigure(id);
            // keep dialog open; re-render with new row data
          }}
          onResync={(id) => onResync(id)}
        />
      </CardContent>
    </Card>
  );
}

function TasksProvisioning() {
  const [oltId, setOltId] = useState(MOCK.olt[0].id);
  const [serial, setSerial] = useState("");
  const [customer, setCustomer] = useState("");
  const [profile, setProfile] = useState("Router");
  const [vlan, setVlan] = useState("103");
  const [tos, setTos] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  function submit() {
    const id = `JOB-${Math.floor(100000 + Math.random() * 900000)}`;
    setJobId(id);
  }

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-sm">Tasks (Provisioning mock)</CardTitle>
        <div className="text-xs text-slate-500">This form does not modify the ONT list. Use Configure button in Unconfigured.</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-xs text-slate-600">OLT</div>
            <Select value={oltId} onValueChange={setOltId}>
              <SelectTrigger className="h-9 rounded">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK.olt.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">Serial</div>
            <Input className="h-9 rounded" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="HWTC..." />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">Customer</div>
            <Input className="h-9 rounded" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Name" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">Profile</div>
            <Select value={profile} onValueChange={setProfile}>
              <SelectTrigger className="h-9 rounded">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Router", "Bridge", "ALL-ONT"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">VLAN</div>
            <Input className="h-9 rounded" value={vlan} onChange={(e) => setVlan(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 rounded border bg-white p-2 md:col-span-2">
            <Checkbox checked={tos} onCheckedChange={(v) => setTos(Boolean(v))} />
            <div className="text-xs text-slate-600">I confirm I am authorized (audit logged).</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            className="h-9 rounded bg-slate-900 text-white hover:bg-slate-800"
            disabled={!tos || serial.trim().length < 6 || customer.trim().length < 3}
            onClick={submit}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create task
          </Button>

          {jobId && (
            <div className="text-xs text-slate-600">
              Created <span className="font-mono">{jobId}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DiagnosticsPage() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [status, setStatus] = useState("all");
  const [onlyProblem, setOnlyProblem] = useState(false);

  const rows = useMemo(
    () =>
      filterOlts(MOCK.olt, {
        q,
        region,
        vendor,
        status,
        onlyProblem,
      }),
    [q, region, vendor, status, onlyProblem]
  );

  return (
    <Card className="rounded">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Diagnostics (OLT inventory mock)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, IP" className="h-9 rounded pl-9" />
          </div>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-9 rounded">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {MOCK.regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vendor} onValueChange={setVendor}>
            <SelectTrigger className="h-9 rounded">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {MOCK.oltVendors.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 rounded">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(["Healthy", "Degraded", "Down"] as OltStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between gap-2 rounded border bg-white px-3">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              Only problem
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 w-9 rounded p-0"
                title="Reset"
                onClick={() => {
                  setQ("");
                  setRegion("all");
                  setVendor("all");
                  setStatus("all");
                  setOnlyProblem(false);
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Switch checked={onlyProblem} onCheckedChange={setOnlyProblem} />
            </div>
          </div>
        </div>

        <div className="rounded border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OLT</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Mgmt IP</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>{o.vendor}</TableCell>
                  <TableCell>{o.model}</TableCell>
                  <TableCell>{o.mgmtIp}</TableCell>
                  <TableCell>{o.region}</TableCell>
                  <TableCell>
                    <StatusPill status={o.status} />
                  </TableCell>
                  <TableCell>{o.lastSeen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsPage() {
  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-sm">Reports</CardTitle>
        <div className="text-xs text-slate-500">Placeholder.</div>
      </CardHeader>
      <CardContent className="text-sm text-slate-700">
        Example: ONU churn report, optical power distribution, OLT capacity per PON, daily faults.
      </CardContent>
    </Card>
  );
}

function AlarmsPage() {
  const [rows, setRows] = useState<Alarm[]>(MOCK.alarms);
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("all");
  const [source, setSource] = useState("all");
  const [onlyUnacked, setOnlyUnacked] = useState(true);

  const sources = useMemo(() => Array.from(new Set(rows.map((a) => a.source))).sort(), [rows]);
  const filtered = useMemo(
    () =>
      filterAlarms(rows, {
        q,
        severity,
        source,
        onlyUnacked,
      }),
    [rows, q, severity, source, onlyUnacked]
  );

  function ack(id: string) {
    setRows((prev) => prev.map((a) => (a.id === id ? { ...a, ack: true } : a)));
  }

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-sm">Alarms</CardTitle>
        <div className="text-xs text-slate-500">Simple alarm board with acknowledgement (mock).</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alarms" className="h-9 rounded pl-9" />
          </div>

          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-9 rounded">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(["Critical", "Major", "Minor"] as AlarmSeverity[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="h-9 rounded">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between gap-2 rounded border bg-white px-3">
            <div className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Only unacked
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 w-9 rounded p-0"
                title="Reset"
                onClick={() => {
                  setQ("");
                  setSeverity("all");
                  setSource("all");
                  setOnlyUnacked(true);
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Switch checked={onlyUnacked} onCheckedChange={setOnlyUnacked} />
            </div>
          </div>
        </div>

        <div className="rounded border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Ack</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell>
                    <SeverityPill sev={a.severity} />
                  </TableCell>
                  <TableCell className="font-medium">{a.source}</TableCell>
                  <TableCell className="max-w-[420px] truncate">{a.message}</TableCell>
                  <TableCell>{a.firstSeen}</TableCell>
                  <TableCell>{a.ack ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" className="h-9 rounded" disabled={a.ack} onClick={() => ack(a.id)}>
                      Ack
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsPage() {
  const [polling, setPolling] = useState(true);
  const [pollInterval, setPollInterval] = useState("60");
  const [retention, setRetention] = useState("90");
  const [webhook, setWebhook] = useState("https://hooks.example.local/incident");

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-sm">Settings (mock)</CardTitle>
        <div className="text-xs text-slate-500">Common system controls for a SmartOLT-like platform.</div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Telemetry polling</div>
              <div className="text-xs text-slate-500">SNMP/NETCONF scraping (simulated)</div>
            </div>
            <Switch checked={polling} onCheckedChange={setPolling} />
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Poll interval (seconds)</div>
            <Input value={pollInterval} onChange={(e) => setPollInterval(e.target.value)} className="h-9 rounded" />
          </div>
        </div>

        <div className="rounded border bg-white p-3">
          <div className="text-sm font-medium">Data retention</div>
          <div className="text-xs text-slate-500">Metrics + logs storage policy</div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">Retention (days)</div>
            <Input value={retention} onChange={(e) => setRetention(e.target.value)} className="h-9 rounded" />
          </div>
        </div>

        <div className="rounded border bg-white p-3 md:col-span-2">
          <div className="text-sm font-medium">Alarm webhook</div>
          <div className="text-xs text-slate-500">Send events to your ITSM / ChatOps</div>
          <Separator className="my-3" />
          <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} className="h-9 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------------
// Minimal self-tests
// -------------------------

function runSelfTests() {
  const envAny =
    typeof process !== "undefined" && (process as any) && (process as any).env ? ((process as any).env as any) : undefined;
  const isTestEnv = Boolean(envAny && (envAny.NODE_ENV === "test" || envAny.VITEST || envAny.JEST_WORKER_ID));

  if (!isTestEnv) return;

  const olts = MOCK.olt;
  const alarms = MOCK.alarms;
  const onuRows = buildOnuRows();

  // Test 1: OLT filter by region
  const byRegion = filterOlts(olts, { q: "", region: "Jakarta", vendor: "all", status: "all", onlyProblem: false });
  console.assert(byRegion.every((o) => o.region === "Jakarta"), "Test failed: OLT region filter");

  // Test 2: OLT onlyProblem should exclude Healthy
  const problems = filterOlts(olts, { q: "", region: "all", vendor: "all", status: "all", onlyProblem: true });
  console.assert(problems.every((o) => o.status !== "Healthy"), "Test failed: OLT onlyProblem");

  // Test 3: Alarms onlyUnacked
  const unacked = filterAlarms(alarms, { q: "", severity: "all", source: "all", onlyUnacked: true });
  console.assert(unacked.every((a) => !a.ack), "Test failed: alarms onlyUnacked");

  // Test 4: ONU filter by VLAN should be stable
  const vlan103 = filterOnuRows(onuRows, {
    q: "",
    olt: "any",
    board: "any",
    port: "any",
    zone: "any",
    odb: "any",
    vlan: "103",
    onuType: "any",
    profile: "any",
    ponType: "any",
    statusSet: new Set(),
    sigSet: new Set(),
    br: "any",
    configuredMode: "configured",
  });
  console.assert(vlan103.every((r) => r.vlan === 103), "Test failed: ONU VLAN filter");

  // Test 5: Signal bucket filter should constrain buckets
  const lowOnly = filterOnuRows(onuRows, {
    q: "",
    olt: "any",
    board: "any",
    port: "any",
    zone: "any",
    odb: "any",
    vlan: "any",
    onuType: "any",
    profile: "any",
    ponType: "any",
    statusSet: new Set(),
    sigSet: new Set(["low"]),
    br: "any",
    configuredMode: "configured",
  });
  console.assert(lowOnly.every((r) => signalBucket(r.signalRx) === "low"), "Test failed: Signal bucket filter");

  // Test 6: Configured vs Unconfigured mapping must match provisioned flag
  const allCfg = filterOnuRows(onuRows, {
    q: "",
    olt: "any",
    board: "any",
    port: "any",
    zone: "any",
    odb: "any",
    vlan: "any",
    onuType: "any",
    profile: "any",
    ponType: "any",
    statusSet: new Set(),
    sigSet: new Set(),
    br: "any",
    configuredMode: "configured",
  });
  const allUncfg = filterOnuRows(onuRows, {
    q: "",
    olt: "any",
    board: "any",
    port: "any",
    zone: "any",
    odb: "any",
    vlan: "any",
    onuType: "any",
    profile: "any",
    ponType: "any",
    statusSet: new Set(),
    sigSet: new Set(),
    br: "any",
    configuredMode: "unconfigured",
  });
  console.assert(allCfg.every((r) => r.provisioned), "Test failed: configured should be provisioned");
  console.assert(allUncfg.every((r) => !r.provisioned), "Test failed: unconfigured should be not provisioned");
  console.assert(allCfg.length + allUncfg.length === onuRows.length, "Test failed: configured+unconfigured must cover all");

  // Test 7: Search should match PPPoE token
  const anyPppoe = onuRows.find((r) => r.pppoe.includes("@isp"));
  console.assert(Boolean(anyPppoe), "Test failed: expected at least one PPPoE");
  if (anyPppoe) {
    const hit = filterOnuRows(onuRows, {
      q: anyPppoe.pppoe,
      olt: "any",
      board: "any",
      port: "any",
      zone: "any",
      odb: "any",
      vlan: "any",
      onuType: "any",
      profile: "any",
      ponType: "any",
      statusSet: new Set(),
      sigSet: new Set(),
      br: "any",
      configuredMode: anyPppoe.provisioned ? "configured" : "unconfigured",
    });
    console.assert(hit.some((x) => x.id === anyPppoe.id), "Test failed: search PPPoE should return the ONU");
  }

  // Test 8: deriveIps must return valid dotted IPs
  const ips = deriveIps("ONT-TEST-00001");
  console.assert(ips.mgmt.split(".").length === 4, "Test failed: mgmt IP format");
  console.assert(ips.wan.split(".").length === 4, "Test failed: wan IP format");
}

runSelfTests();

// -------------------------
// App
// -------------------------

export default function SmartOltPrototypeApp() {
  const [authed, setAuthed] = useState(false);
  const [route, setRoute] = useState<
    "configured" | "unconfigured" | "graphs" | "diagnostics" | "tasks" | "reports" | "settings" | "alarms"
  >("configured");

  const [onuRows, setOnuRows] = useState<OnuRow[]>(() => buildOnuRows());

  function logout() {
    setAuthed(false);
    setRoute("configured");
  }

  function configure(id: string) {
    setOnuRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const { mgmt, wan } = deriveIps(r.id);
        // In demo we expose IP when provisioned; keep it even if status not online so user sees field
        return {
          ...r,
          provisioned: true,
          authDate: r.authDate && r.authDate !== "-" ? r.authDate : formatNow(),
          mgmtIp: r.mgmtIp ?? mgmt,
          wanIp: r.wanIp ?? wan,
          tr069: r.status === "Online" ? "Active" : "Inactive",
        };
      })
    );
  }

  function resync(id: string) {
    // For prototype: just refresh authDate to show action has effect
    setOnuRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return { ...r, authDate: r.authDate && r.authDate !== "-" ? r.authDate : formatNow() };
      })
    );
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <TopNavShell route={route} onRoute={(r) => setRoute(r as any)} onLogout={logout}>
      {route === "configured" && <OnuListPage mode="configured" rows={onuRows} onConfigure={configure} onResync={resync} />}
      {route === "unconfigured" && <OnuListPage mode="unconfigured" rows={onuRows} onConfigure={configure} onResync={resync} />}
      {route === "graphs" && <Graphs />}
      {route === "diagnostics" && <DiagnosticsPage />}
      {route === "tasks" && <TasksProvisioning />}
      {route === "reports" && <ReportsPage />}
      {route === "settings" && <SettingsPage />}
      {route === "alarms" && <AlarmsPage />}
    </TopNavShell>
  );
}
