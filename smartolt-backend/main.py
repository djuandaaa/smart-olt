from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Vendor(str, Enum):
    HUAWEI = "HUAWEI"
    ZTE = "ZTE"


class OnuStatus(str, Enum):
    ONLINE = "ONLINE"
    LOS = "LOS"
    OFFLINE = "OFFLINE"
    FLAPPING = "FLAPPING"
    DYING_GASP = "DYING_GASP"
    UNKNOWN = "UNKNOWN"


class OnuNormalized(BaseModel):
    id: str
    serial: str
    vendor: Vendor
    olt_name: str
    pon: str
    onu_id: Optional[int] = None

    status: OnuStatus
    rx_power_dbm: Optional[float] = None
    tx_power_dbm: Optional[float] = None
    distance_km: Optional[float] = None

    last_down_cause: Optional[str] = None
    last_seen: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


app = FastAPI(title="SmartOLT NOC API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti kalau production, ganti ke domain UI kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------
# 1) RAW vendor data examples
# --------------------------

def get_raw_onus_huawei() -> List[Dict[str, Any]]:
    # contoh format Huawei (dummy)
    return [
        {
            "sn": "HWTC87654321",
            "olt": "HUAWEI-MA5800",
            "frame": 0,
            "slot": 2,
            "port": 3,
            "onu_id": 7,
            "state": "LOS",  # bisa juga "online"/"offline" tergantung source
            "rx_dbm": None,
            "distance_km": 3.1,
            "last_down": "LOS",
        }
    ]


def get_raw_onus_zte() -> List[Dict[str, Any]]:
    # contoh format ZTE (dummy)
    return [
        {
            "serial": "ZTEG12345678",
            "olt_name": "ZTE-ZXA10",
            "pon": "1/1/1",
            "onu": 12,
            "status": "ONLINE",
            "rx_power": -18.2,
            "cause": None,
        }
    ]


# --------------------------
# 2) Normalizer per vendor
# --------------------------

def map_status(vendor: Vendor, raw_status: Optional[str]) -> OnuStatus:
    s = (raw_status or "").strip().lower()

    # mapping umum (bisa kamu perluas)
    if s in ["online", "up", "working", "run", "active"]:
        return OnuStatus.ONLINE
    if s in ["los", "loss", "loss_of_signal"]:
        return OnuStatus.LOS
    if s in ["dying_gasp", "dyinggasp", "poweroff", "power_off"]:
        return OnuStatus.DYING_GASP
    if s in ["flapping", "unstable"]:
        return OnuStatus.FLAPPING
    if s in ["offline", "down"]:
        return OnuStatus.OFFLINE

    return OnuStatus.UNKNOWN


def normalize_huawei(x: Dict[str, Any]) -> OnuNormalized:
    pon = f'{x.get("frame",0)}/{x.get("slot")}/{x.get("port")}'
    serial = x.get("sn", "UNKNOWN")
    olt_name = x.get("olt", "HUAWEI-OLT")

    status = map_status(Vendor.HUAWEI, x.get("state"))
    onu_id = x.get("onu_id")

    return OnuNormalized(
        id=f"HUAWEI:{olt_name}:{pon}:{onu_id}:{serial}",
        serial=serial,
        vendor=Vendor.HUAWEI,
        olt_name=olt_name,
        pon=pon,
        onu_id=onu_id,
        status=status,
        rx_power_dbm=x.get("rx_dbm"),
        distance_km=x.get("distance_km"),
        last_down_cause=x.get("last_down"),
    )


def normalize_zte(x: Dict[str, Any]) -> OnuNormalized:
    pon = x.get("pon", "0/0/0")
    serial = x.get("serial", "UNKNOWN")
    olt_name = x.get("olt_name", "ZTE-OLT")
    onu_id = x.get("onu")

    status = map_status(Vendor.ZTE, x.get("status"))

    return OnuNormalized(
        id=f"ZTE:{olt_name}:{pon}:{onu_id}:{serial}",
        serial=serial,
        vendor=Vendor.ZTE,
        olt_name=olt_name,
        pon=pon,
        onu_id=onu_id,
        status=status,
        rx_power_dbm=x.get("rx_power"),
        last_down_cause=x.get("cause"),
    )


@app.get("/api/onus", response_model=List[OnuNormalized])
def list_onus_normalized():
    h = [normalize_huawei(x) for x in get_raw_onus_huawei()]
    z = [normalize_zte(x) for x in get_raw_onus_zte()]
    return h + z

