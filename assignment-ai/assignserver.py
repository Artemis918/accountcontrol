from flask import Flask, request, jsonify
from aamodel import AA4Model, create_input, getPredictions, getDevice, train_model, test_model

app = Flask(__name__)

model = None
chunk_buffer = []


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/upload_chunk", methods=["POST"])
def upload_chunk():
    if not request.is_json:
        return jsonify({"error": "Expecting application/json"}), 415

    payload = request.get_json()
    records = payload.get("records")
    if not isinstance(records, list):
        return jsonify({"error": "JSON must include 'records' array"}), 400

    # Append records to buffer and record metadata
    before = len(chunk_buffer)
    chunk_buffer.extend(records)

    return jsonify({"message": "Chunk received", "received": len(records), "total_records": len(chunk_buffer), "previous_total": before}), 200

def create_line_from_rec(rec):  
    details = rec.get("details", "")
    value = rec.get("value", "")
    executed_field = rec.get("executed")
    executed = f"{int(executed_field[2]):02d}{int(executed_field[1]):02d}"

    mandate = rec.get("mandate", "")
    submitter = rec.get("submitter", "")
    reference = rec.get("reference", "")
    sender = rec.get("sender", "")
    receiver = rec.get("receiver", "")

    label = rec.get("subcategory")    
    label_int = int(label)-1

    line = create_input(details, str(value), executed, mandate, submitter, reference, sender, receiver)
    return line, label_int

@app.route("/train_chunks", methods=["POST"])
def train_chunks():
    if len(chunk_buffer) == 0:
        return jsonify({"error": "No chunked records available"}), 400

    # Accept optional JSON body with training options
    payload = request.get_json() if request.is_json else {}
    output_size = payload.get("output_size") 

    X = []
    y = []

    for rec in chunk_buffer:
        line,label = create_line_from_rec(rec)
        X.append(line)
        y.append(label)

    model = AA4Model(len(X[0]), output_size)
    train_model(model,X, y, getDevice())

    return jsonify({"message": "Model trained from chunks", "rows": len(X) }), 200


@app.route("/test_json", methods=["POST"])
def test_json():
    if model is None:
        return jsonify({"error": "No trained model available"}), 400

    # Accept JSON body or use chunk buffer when requested
    payload = request.get_json() if request.is_json else {}

    if not isinstance(payload, dict):
        return jsonify({"error": "Expecting application/json"}), 415

    records = payload["test"]
    if len(records) == 0:
        return jsonify({"error": "No records provided for testing"}), 400

    Xtest = []
    yabs = []
    Xdetails = []

    for rec in records:
        line,label = create_line_from_rec(rec)
        Xtest.append(line)
        yabs.append(label)
        Xdetails.append(rec.get("details", ""))

    # Run test
    correct = test_model(model, Xtest, yabs, getDevice(), Xdetails)
    total = len(yabs)
    accuracy = 100 * correct / total if total > 0 else 0.0

    return jsonify({"message": "Test completed", "total": total, "correct": correct, "accuracy": accuracy}), 200


@app.route("/clear_chunks", methods=["POST", "DELETE"])
def clear_chunks():
    chunk_buffer.clear()
    return jsonify({"message": "Chunk buffer cleared"}), 200


@app.route("/predict", methods=["POST"])
def get_categories():

    if not request.is_json:
        return jsonify({"error": "Expecting application/json"}), 415

    data = []
    data = request.get_json()
    executed_data = data["executed"]
    executed = f"{executed_data[2]:02d}{executed_data[1]:02d}"

    input = create_input(
        data["details"],
        str(data["value"]),
        executed,
        data["mandate"],
        data["submitter"],
        data["reference"],
        data["sender"],
        data["receiver"],
    )
    result = getPredictions(model, input, 4, getDevice())

    return jsonify({"result": result}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
