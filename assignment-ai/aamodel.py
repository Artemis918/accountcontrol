import torch
import torch.nn as nn
import torch.optim as optim
import random

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
    self.fc3 = nn.Linear(256, 128)
    self.fc4 = nn.Linear(256, output_size)
    self.relu = nn.ReLU()

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
  
### TRAINING
#################
def train_model (model, Xtrain, ytrain, blocksize, num_epochs, device ) :

  trainsize = len(Xtrain)

  # Define loss function and optimizer
  criterion = nn.CrossEntropyLoss(reduction='mean')
  optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

  for epoch in range (num_epochs) :
    iter = DataIterator( Xtrain, ytrain, blocksize )
  
    runs = int( trainsize / blocksize ) + 1

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
    print ( loss )

######  TEST
#################################
def test_model ( model , Xtest, yabs, device) :
  correct = 0
  total = 0

  TEST_BLOCK_SIZE = 200

  testiter = DataIterator(Xtest,yabs,TEST_BLOCK_SIZE)

  with torch.no_grad():
    runs = int( len(yabs) / TEST_BLOCK_SIZE +1 )

    for _ in range(runs) :

      inputs, categories = testiter.next()
      inputs = inputs.to(device)
      categories = categories.to(device)

      outputs = model(inputs)
      values, predicted = torch.max(outputs, 1)

      total += categories.size(0)
      
      correct += (predicted == categories).sum().item()

  return total, correct
