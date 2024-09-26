from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

def get_database_connection():
    client = MongoClient("mongodb+srv://untitled:oqdOLCDAfdbm4D09@cluster0.sxosl60.mongodb.net/ecosync?retryWrites=true&w=majority")
    db = client["ecosync"]
    return db["scan"]

@app.route('/scan', methods=['GET'])
def fetch_latest_scan_data():
    collection = get_database_connection()
    latest_scan = collection.find_one(sort=[("scan_time", -1)])  # Fetches the latest document
    if latest_scan and "devices" in latest_scan:
        results = []
        for mac, details in latest_scan["devices"].items():
            results.append({"MAC": mac, "Name": details["name"], "Count": details["count"]})
        return jsonify(results)
    else:
        return jsonify({"error": "No data available"}), 404



@app.route('/update', methods=['POST'])
def update_device_name():
    collection = get_database_connection()
    data = request.json
    mac_address = data.get("mac")
    new_name = data.get("name")

    if not mac_address or not new_name:
        return jsonify({"error": "MAC and Name are required"}), 400

    update_result = collection.update_many(
        {"devices." + mac_address: {"$exists": True}},
        {"$set": {f"devices.{mac_address}.name": new_name}}
    )

    if update_result.modified_count > 0:
        return jsonify({"message": f"Updated {update_result.modified_count} records."})
    else:
        return jsonify({"message": "No records found with the specified MAC address"}), 404

if __name__ == '__main__':
    app.run(host='192.168.137.148', port=4444, debug=True)
