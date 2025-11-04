# Assignment using neuronal networks 

After using this tool for many years there now alot of entries with assigned subcategories. I extrycted them with a database tool into a csv file and here we go. Let's mess around with pytorch :-)

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
