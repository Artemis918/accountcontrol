
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import random

# Configuration
DATA_PATH = "./assignments.csv"
MODEL_PATH = "./trained_model.joblib"
TARGET_COL = "subcategory"
BLOCK_SIZE = 64
DETAILS_LEN = 100
NUM_CATEGORIES = 41

class DataIterator() :
  def __init__(self, input, result, blocksize) :
    self.bs = blocksize
    self.cnt = 0
    self.input = input
    self.result = result
    self.len = len(input)
    self.range = random.sample(range( self.len ),self.len)

  def next(self) :
    data = []
    res = []
    start = self.cnt * self.bs
    end = start + self.bs
    if (start < self.len ) :
      if (end > self.len ) :
        end = self.len

      for i in range(start,end) :
        di = self.range[i]
        data.append(self.input[di])
        res.append(self.result[di])

    return torch.tensor(data), torch.tensor(res)

class MyModel(nn.Module):
  def __init__(self):
    super(MyModel, self).__init__()
    self.fc1 = nn.Linear(DETAILS_LEN, 64)
    self.relu = nn.ReLU()
    self.fc2 = nn.Linear(64, 64)
    self.fc3 = nn.Linear(64, NUM_CATEGORIES)

  def forward(self, x):
    x = self.fc1(x)
    x = self.relu(x)
    x = self.fc2(x)
    x = self.relu(x)
    x = self.fc3(x)
    return x


def load_data():
  df = pd.read_csv(DATA_PATH, delimiter=';',dtype={'details': str},keep_default_na=False)
  if TARGET_COL not in df.columns:
    raise KeyError(f"Target column '{TARGET_COL}' not found in {path}") 
  #X = df.drop(columns=[TARGET_COL])
  X = df['details']
  y = df['subcategory']
  return X,y

def createInputTensor(X) :
  X1 = []
  for x in X :
    te = []
    for c in x.ljust(DETAILS_LEN)[:DETAILS_LEN] :
      te.append( float(ord(c)) )
    X1.append(te)
  return X1

def createLabelTensors(y) :
  y1 = []
  for i in range(len(y)) :
    res = [float(0) for _ in range(NUM_CATEGORIES)]
    res[y[i]-1] = float(1)
    y1.append(res)
  return y1

def splitdata(data, size) :
  trainkeys = range(size)
  testkeys = range(size,len(data))

  traindata = [data[idx] for idx in trainkeys]
  testdata = [data[idx] for idx in testkeys]
  return traindata,testdata


X, y = load_data()

X1 = createInputTensor(X);
y1 = createLabelTensors(y);

trainsize = int(len(X1)*80/100);
Xtrain,Xtest = splitdata(X1,trainsize)
ytrain,ytest = splitdata(y1,trainsize)
_,yabs = splitdata(y,trainsize)

model = MyModel()

# Define loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Check if GPU is available
#device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
#print(f"Using device: {device}")
device = "cpu"
model.to(device)

# Training loop
num_epochs = 1


for epoch in range(num_epochs):
    print ("---------------- epoch ", epoch)
    running_loss = 0.0

    iter = DataIterator( Xtrain, ytrain, BLOCK_SIZE )

    runs = int( trainsize / BLOCK_SIZE ) + 1
    for step in range(runs) :
      inputs, categories = iter.next()
      inputs = inputs.to(device)
      categories = categories.to(device)

      # Zero the parameter gradients
      optimizer.zero_grad()

      outputs = model(inputs)
      loss = criterion(outputs, categories)

      loss.backward()
      optimizer.step()

      print (step, loss)

print ("finish training")

model.eval()
correct = 0
total = 0

testiter = DataIterator(Xtest,yabs,BLOCK_SIZE)

for i in range (len(ytest)) :
  yabs[i] = yabs[i]-1

with torch.no_grad():
    runs = int( len(yabs) / BLOCK_SIZE ) + 1
    for step in range(runs) :

      inputs, categories = testiter.next()
      inputs = inputs.to(device)
      categories = categories.to(device)

      outputs = model(inputs)
      _, predicted = torch.max(outputs, 1)
      #print(predicted,categories))

      total += categories.size(0)
      correct += (predicted == categories).sum().item()
      #print (step, total, correct)

accuracy = 100 * correct / total
print(f'Accuracy on the test set: {accuracy:.2f}%')

