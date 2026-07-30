# simulate_chunks.py
def stub_create_model(X, y, output_size, device, Xdetails):
    # Return (test_total, correct, model)
    total = max(1, len(X) // 2)
    correct = max(0, total // 2)
    model = "dummy-model"
    print(f"[stub_create_model] called with {len(X)} rows -> returning total={total}, correct={correct}")
    return total, correct, model

def stub_test_model(model, Xtest, yabs, device, Xdetails):
    # Pretend half are correct for demo
    correct = len(yabs) // 2
    print(f"[stub_test_model] called with total={len(yabs)} -> returning correct={correct}")
    return correct

# Simulate chunked upload flow against assignserver using Flask test client
import sys
import types
import json

# Create lightweight fake 'torch' module to avoid installing heavy dependency
fake_torch = types.SimpleNamespace()

class FakeNoOp:
    def __call__(self, *args, **kwargs):
        return None

def fake_tensor(x, **kwargs):
    return x

def fake_device(name=None):
    return str(name)

class FakeCuda:
    @staticmethod
    def is_available():
        return False

def fake_no_grad():
    class Ctx:
        def __enter__(self):
            return None
        def __exit__(self, exc_type, exc, tb):
            return False
    return Ctx()

fake_nn = types.SimpleNamespace()
fake_nn.Module = object
fake_nn.Linear = lambda *a, **k: object()
fake_nn.ReLU = lambda *a, **k: object()
fake_nn.CrossEntropyLoss = lambda **k: object()

fake_optim = types.SimpleNamespace()
fake_optim.Adam = lambda *a, **k: object()

fake_torch.nn = fake_nn
fake_torch.optim = fake_optim
fake_torch.tensor = fake_tensor
fake_torch.device = fake_device
fake_torch.cuda = FakeCuda()
fake_torch.no_grad = fake_no_grad

sys.modules['torch'] = fake_torch
sys.modules['torch.nn'] = fake_nn
sys.modules['torch.optim'] = fake_optim

# Create a lightweight fake psycopg2 module used by modelfromdb import
fake_psycopg2 = types.SimpleNamespace()
def fake_connect(*args, **kwargs):
    raise RuntimeError('psycopg2.connect is not available in this test environment')
fake_psycopg2.connect = fake_connect
sys.modules['psycopg2'] = fake_psycopg2

import assignserver as srv

# Monkeypatch the heavy trainer and tester to avoid requiring torch
def stub_create_model(X, y, output_size, device, Xdetails):
    # Return (test_total, correct, model)
    total = max(1, len(X) // 2)
    correct = max(0, total // 2)
    model = "dummy-model"
    print(f"[stub_create_model] called with {len(X)} rows -> returning total={total}, correct={correct}")
    return total, correct, model

def stub_test_model(model, Xtest, yabs, device, Xdetails):
    # Pretend half are correct for demo
    correct = len(yabs) // 2
    print(f"[stub_test_model] called with total={len(yabs)} -> returning correct={correct}")
    return correct

# Replace heavy training pipeline with a stub so /train_chunks won't try to call real optimizer
srv.aamodel_create_model = stub_create_model
srv.test_model = stub_test_model

# Replace heavy training pipeline with a stub so /train_chunks won't try to call real optimizer
def stub_train_model(model_obj, X, y, device):
    print(f"[stub_train_model] called with {len(X)} rows; skipping heavy training")
    # set the server model to a simple marker
    srv.model = "dummy-model"

class DummyAA4:
    def __init__(self, *args, **kwargs):
        pass

srv.train_model = stub_train_model
srv.AA4Model = DummyAA4

client = srv.app.test_client()

# Prepare two small chunk records
chunk1 = {
    "details": "Invoice A",
    "value": 200,
    "executed": [2025, 12, 18],
    "mandate": "X1",
    "submitter": "Carol",
    "reference": "A200",
    "sender": "S1",
    "receiver": "R1",
    "subcategory": 3
}
chunk2 = {
    "details": "Invoice B",
    "value": 450,
    "executed": [2025, 11, 30],
    "mandate": "X2",
    "submitter": "Dan",
    "reference": "B450",
    "sender": "S2",
    "receiver": "R2",
    "subcategory": 7
}

print('\n--- Upload chunk 1')
resp = client.post('/upload_chunk', json={"chunk_id": "chunk-001", "records": [chunk1]})
print(resp.status_code)
print(resp.get_data(as_text=True))

print('\n--- Upload chunk 2')
resp = client.post('/upload_chunk', json={"chunk_id": "chunk-002", "records": [chunk2]})
print(resp.status_code)
print(resp.get_data(as_text=True))

print('\n--- Check chunks')
resp = client.get('/chunks')
print(resp.status_code)
print(resp.get_data(as_text=True))

print('\n--- Train from chunks (stubbed)')
resp = client.post('/train_chunks', json={"keep": False, "output_size": 41})
print(resp.status_code)
print(resp.get_data(as_text=True))

print('\nServer model is now:', srv.model)

# Prepare test payload (same two records)
print('\n--- Test using JSON test payload (stubbed)')
resp = client.post('/test_json', json={"test": [chunk1, chunk2]})
print(resp.status_code)
print(resp.get_data(as_text=True))

print('\n--- Done')
