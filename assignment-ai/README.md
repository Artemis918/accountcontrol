# Assignment using neuronal networks 

After using this tool for many years there now alot of entries with assigned subcategories. I extracted them with a database tool into a csv file and here we go. Let's mess around with pytorch :-)

## Basics

I used [https://pythonguides.com/pytorch-mnist/](https://pythonguides.com/pytorch-mnist/) as example and tried my first steps along this one

## Setup

since I didn't use alot of fancy stuff you only need torch and pandas. I added torchvision as recommended in the example, but didn't really use it. To setup a working environment create a python venv with

```python3 -m venv .venv```

activate this environment with

```source .venv/bin/activate```

and finally install neccessary modules

```pip install torch torchvision pandas```

Now you hould be able to try with your own csv data in 'assignment.csv'. Just type 

```python3 ./accountassign.py``` 

## Three ways of getting the model to work

The scripts are refactored, so I can test different ways:

accounsassign.py: reads the data for training and testing from as csv file

modelfromdb.py: Accesses directly the postgres database for training an testing data (currently unused)

assignserver.py: training, test and prediction are solved with rest endpoints. This version will be used as an 'ai service' within my cluster

aamodel.py: basic functions for creating, training, testing and using my model
