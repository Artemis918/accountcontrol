import configparser
import psycopg2
from aamodel import create_model, getDevice, create_input

DETAILS_LEN = 75
NUM_CATEGORIES = 41
FILL_CHAR = ' '

def open_db_connection():

  db_config = configparser.ConfigParser()
  db_config.read('dbconfig.ini')

  conn = psycopg2.connect(
      dbname=db_config.get('database','dbname'),
      user=db_config.get('database','user'),
      password=db_config.get('database','password'),
      host=db_config.get('database','host'),
      port=db_config.get('database','port')
  )
  return conn 

def close_db_connection(conn):
  conn.close()

### converting data set to input string
###############################################

def fetch_train_data():
  conn = open_db_connection()
  cursor = conn.cursor()
  query = "select ar.details, ar.value, ar.executed, ar.mandate , ar.submitter, ar.reference, ar.sender, ar.receiver, assign.subcategory " \
          "from assignment assign " \
          "join account_record ar on assign.accountrecord = ar.id"

  X = []
  Xdetails = []
  y = []

  cursor.execute(query)
  dataset = cursor.fetchone()
  while dataset != None :
    line = create_input(dataset[0], str(dataset[1]), dataset[2].strftime("%d%m"),dataset[3],dataset[4],dataset[5],dataset[6], dataset[7])
 
    sub= dataset[8]
    X.append(line)
    y.append(sub-1)
    Xdetails.append(dataset[0])
    dataset = cursor.fetchone()
  conn.close()
  return X,y,Xdetails


def create_model_from_db():
  X,y,Xdetails = fetch_train_data()
  print ("Total rows fetched:", len(X))
  
  total, correct, model = create_model(X,y,NUM_CATEGORIES, getDevice(),Xdetails)
  accuracy = 100 * correct / total

  print(f'Accuracy on the test set: {accuracy:.2f}')
  return model,accuracy