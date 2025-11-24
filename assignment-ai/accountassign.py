
import pandas as pd
import torch

from io import StringIO
from aamodel import AA3Model,train_model, test_model

# Configuration
DATA_PATH = "./assignments.csv"
TARGET_COL = "subcategory"
BLOCK_SIZE = 400
DETAILS_LEN = 75
NUM_CATEGORIES = 41
FILL_CHAR = ' '

model = AA3Model(200,41)

### load data into pandas dataframe
#############################################
def prepare_csv(df) :
  X = df.drop(columns=[TARGET_COL])
  y = df[TARGET_COL]

  for i in range (len(y)) :
    y.at[i] = y.at[i]-1

  return X,y

def load_data():
  df = pd.read_csv(DATA_PATH, delimiter=';',dtype={'details': str},keep_default_na=False)
  return prepare_csv(df)

def load_data_from_buffer(strbuf) :
  df = pd.read_csv(StringIO(strbuf))
  return prepare_csv(df)


### converting tensor arrays from dataframes 
###############################################
def append(te,s,l) : 
  a = s.ljust(l,FILL_CHAR)[:l]
  for c in a :
    cv = ord(c)
    te.append( float(cv-32) )
  return te

def create_input(line) :
  te = append( [] , line['details'],DETAILS_LEN )
  te = append( te, str(line['value.1']),8)
  te = append( te, line['executed'],5)
  te = append( te, line['mandate'],10)
  te = append( te, line['submitter'],10)
  te = append( te, line['reference'],10)
  te = append( te, line['sender'],10) 
  te = append( te, line['receiver'],10)
  return te

def createInputArray(X) :
  X1 = []
  s,_ = X.shape
  for i in range(s) :
    X1.append(create_input(X.iloc[i]))
  return X1

def createLabelArray(y) :
  y1 = []
  for i in range(len(y)) :
    res = [float(0) for _ in range(NUM_CATEGORIES)]
    res[y[i]] = float(1)
    y1.append(res)
  return y1

def splitdata(data, size) :
  trainkeys = range(size)
  testkeys = range(size,len(data))

  traindata = [data[idx] for idx in trainkeys]
  testdata = [data[idx] for idx in testkeys]
  return traindata,testdata

##########################
def create_model(input_data, label_data, device)

  ## PREPARE DATA / MODEL
  X = createInputArray(input_data)
  y = createLabelArray(label_data)

  trainsize = int(len(X)*99/100)
  input_size = len(X[1])
  num_epochs = 10

  Xtrain,Xtest = splitdata(X,trainsize)
  ytrain,ytest = splitdata(y,trainsize)
  _,yabs = splitdata(y,trainsize)

  model = AA3Model(input_size,NUM_CATEGORIES)
  model.to(device)

  ### TRAIN
  train_model (model, Xtrain, ytrain, BLOCK_SIZE, num_epochs, device )

  print ("finish training ")

  ### TEST
  model.eval()

  return test_model( model, Xtest, yabs, device )



############################
##### MAIN           #######
############################

# Check if GPU is available
#device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
#print(f"Using device: {device}")
device = "cpu"

X, y = load_data()

itotal, correct = train_model(X,y,device)


accuracy = 100 * correct / total

print(f'Accuracy on the test set: {accuracy:.2f}%')

### call model for one line
#################################

data = pd.DataFrame( {
  'details' : [ "REWE SAGT DANKE. 41652011//Hamburg/ | DE | Terminal 56004441 | 2018-11-16T18:02:51 | Verfalld. 1812" ],
  'value.1' : [ "-7841"],
  'executed' : [ "2018-11-19"],
  'mandate' : [ "DE16RPA00000020245"],
  'submitter' : [ "OFFLINE"],
  'reference' : [ "56004441231520161118180251"],
  'sender' : [ "Marion Balsen Dieter Balsen"],
  'receiver' : [ "REWE Daniel Kunkel oHG" ],
} )

print (data)
input = create_input(data.iloc[0])
print (input)

output = model(torch.tensor(input))
print (output)
