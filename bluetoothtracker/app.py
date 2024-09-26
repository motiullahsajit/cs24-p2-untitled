import bluetooth
import time
import json
from pymongo import MongoClient

def upload_scan_data(scan_data):
    client = MongoClient("mongodb+srv://untitled:oqdOLCDAfdbm4D09@cluster0.sxosl60.mongodb.net/ecosync?retryWrites=true&w=majority")
    db = client["ecosync"]
    collection = db["scan"]
    collection.insert_one(scan_data)

def scan_devices():
    db = {}
    while True:
        nearby_devices = bluetooth.discover_devices(duration=8, lookup_names=True, flush_cache=True, lookup_class=True)
        scan_time = time.strftime("%Y-%m-%d %H:%M:%S")

        for addr, name, device_class in nearby_devices:
            if addr not in db:
                db[addr] = {"count": 1, "name": name}
            else:
                db[addr]["count"] += 1
        scan_data = {
            "scan_time": scan_time,
            "devices": db
        }
        print(json.dumps(scan_data, indent=2))
        upload_scan_data(scan_data)
        time.sleep(1)

if __name__ == "__main__":
    scan_devices()

