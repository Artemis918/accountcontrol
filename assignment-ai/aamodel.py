import torch
import torch.nn as nn
import torch.optim as optim
import random

BLOCK_SIZE = 1000
NUM_EPOCHS = 10
DETAILS_LEN = 75
FILL_CHAR = ' '

class AA3Model(nn.Module):
  def __init__(self, input_size,output_size):
    super(AA3Model, self).__init__()
    self.fc1 = nn.Linear(input_size, 512)
    self.fc2 = nn.Linear(512, 256)
    self.fc3 = nn.Linear(256, output_size)
    self.relu = nn.ReLU()

  def forward(self, x):
    x = self.fc1(x)
    x = self.relu(x)
    x = self.fc2(x)
    x = self.relu(x)
    x = self.fc3(x)
    return x

class AA4Model(nn.Module):
  def __init__(self, input_size,output_size):
    super(AA4Model, self).__init__()
    self.fc1 = nn.Linear(input_size, 512)
    self.fc2 = nn.Linear(512, 256)
    self.fc3 = nn.Linear(256, 256)
    self.fc4 = nn.Linear(256, output_size)
    self.relu = nn.ReLU()
    self.output_size = output_size
    
  def forward(self, x):
    x = self.fc1(x)
    x = self.relu(x)
    x = self.fc2(x)
    x = self.relu(x)
    x = self.fc3(x)
    x = self.relu(x)
    x = self.fc4(x)
    return x
  
### iterator over tensors with trainings or test data
##########################################################
class DataIterator() :
  def __init__(self, input, label, blocksize) :
    self.bs = blocksize
    self.cnt = 0
    self.input = input
    self.label = label
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
        res.append(self.label[di])
      self.cnt += 1
      return torch.tensor(data), torch.tensor(res)
    else :
      return None,None
  
### TRAINING
#################
def train_model (model, Xtrain, ytrain, device ) :

  trainsize = len(Xtrain)

  # Define loss function and optimizer
  criterion = nn.CrossEntropyLoss(reduction='mean')
  # optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
  optimizer = optim.Adam(model.parameters())

  for epoch in range (NUM_EPOCHS) :
    iter = DataIterator( Xtrain, ytrain, BLOCK_SIZE )


    inputs, categories = iter.next()
    while inputs is not None :
      
      inputs = inputs.to(device)
      categories = categories.to(device)

      # Zero the parameter gradients
      optimizer.zero_grad()

      outputs = model(inputs)

      loss = criterion(outputs, categories)

      loss.backward()
      optimizer.step()

      inputs,categories = iter.next()  

    print ( loss )



##### USE
##########################

def find_max(out_data) :
  max_val = out_data[0]
  max_idx = 0
  for i in range(1,len(out_data)) :
    if (out_data[i] > max_val) :
      max_val = out_data[i]
      max_idx = i
  return max_idx

def getPredictions(model, input_data, count, device) :
  with torch.no_grad():
    input = torch.tensor(input_data)
    input = input.to(device)

    output = model(input)
    out_data = output.tolist()

    result = []
    for i in range(count) :
      predicted = find_max(out_data)
      out_data[predicted] = 0
      print("predicted: " + str(predicted))
      result.append(predicted)
    return result


######  TEST
#################################
def test_model ( model , Xtest, yabs, device, Xdetails) :
  correct = 0

  TEST_BLOCK_SIZE = 200

  with torch.no_grad():
    for i in range(len (yabs)) :
      predictions = getPredictions(model,Xtest[i],3,device) 

      if (predictions[0] == yabs[i]) : 
        correct += 1
      else :
        print (f" index: {i} predicted: {predictions } actual: {yabs[i]} text: {Xdetails[i]}")

  return correct


###### data preparation
##################################

def append(te,s,l) : 
  if s is None:
      s = ''
  a = s.ljust(l,FILL_CHAR)[:l]
  for c in a :
    cv = ord(c)
    te.append( float(cv-32) )
  return te

def create_input(details,value,executed,mandate,submitter,reference,sender,receiver) :
  te = append( [] , details, DETAILS_LEN ) 
  te = append( te, value,8)
  te = append( te, executed,4)
  te = append( te, mandate,10)
  te = append( te, submitter,10)
  te = append( te, reference,10)
  te = append( te, sender,10)
  te = append( te, receiver,10)
  return te

def getDevice() :
  # Check if GPU is available
  device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
  print(f"Using device: {device}")
  return device

def createLabelArray(y,output_size) :
  y1 = []
  for i in range(len(y)) :
    res = [float(0) for _ in range(output_size)]
    res[y[i]] = float(1)
    y1.append(res)
  return y1

def splitdata(data, size) :
  trainkeys = range(size)
  testkeys = range(size,len(data))

  traindata = [data[idx] for idx in trainkeys]
  testdata = [data[idx] for idx in testkeys]
  return traindata,testdata

##creation of model
################################
def create_model(X, label_data, output_size, device, Xdetails) :

  ## PREPARE DATA / MODEL
  y = createLabelArray(label_data,output_size)

  trainsize = int(len(X)*99/100)
  input_size = len(X[1])
  num_epochs = 10

  Xtrain,Xtest = splitdata(X,trainsize) 
  ytrain,_ = splitdata(y,trainsize)
  _,yabs = splitdata(label_data,trainsize)
  _,Xdetailstrain = splitdata(Xdetails,trainsize)
  
  model = AA4Model(input_size,output_size)
  model.to(device)

  ### TRAIN
  train_model (model, Xtrain, ytrain, device )

  print ("finish training ")

  ### TEST
  model.eval()
  correct = test_model( model, Xtest, yabs, device, Xdetailstrain )
  return len(Xtest), correct, model

