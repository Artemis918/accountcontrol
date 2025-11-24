from flask import Flask, request, jsonify
from accountassign import load_data_from_buffer

app = Flask(__name__)

# in-memory store for received items

CSV_DATA = ''

@app.route("/cleardata", methods=["POST"])
def clear_data():
  CSV_DATA = ''
  return 200

@app.route("/adddata", methods=["POST"])
def add_data():
  
  if not request.is_json:
    return jsonify({"error": "Expecting application/json"}), 415

  data = request.get_json()

  if isinstance(data, dict) & ("csvdata" in data) :
      CSV_DATA = CSV_DATA + data["csvdata"]
  else:
    return jsonify({"error": "Unsupported JSON type"}), 400

  return jsonify({"received": len(data["csvdata"]), "total_stored": len(CSV_DATA)}), 201

@app.route("/createmodel", methods=["GET"])
def create_model():
    if len(CSV_DATA) == 0 :
       return jsonify({"error": "No data"}), 401
    
    X,y = load_data_from_buffer(CSV_DATA)
    return jsonify({"stats"})

@app.route("/getcats", methods=["Post"])
def create_model():
    return jsonify("result":[1,2,3]),200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)