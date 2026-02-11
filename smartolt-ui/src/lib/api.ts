const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.124.134:8000";

export type ApiOnu = {
  id: number;
  serial: string;
  olt: string;
  pon: string;
  status: string;
  rx_power: number | null;
};

export async function fetchOnus(): Promise<ApiOnu[]> {
  const res = await fetch(`${API_BASE}/api/onus`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}
