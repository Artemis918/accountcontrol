# accountcontrol

A small tool for supervising activities on your bank account

## History

At first, I just wanted to track, where all my money is lost :-). After trying this with and good old Excel sheet i moved over to some JSP (Primefaces) and J2EE stuff. The result was a more helpful supervising tool with a little forecast, where I will end up at the end of the year. This works for me some years.

But after all I was interested in all the new stuff around there in the world and i was searching for a small project to try out all that fancy stuff with browsers and containers. So refactored my previous project. While reusing the database and some small business code I ended up in completely rewriting everything.

## Technologies

Here some Buzzwords of the used tools and stuff:

* Springboot 
* Liquibase
* React
* javascript
* Typescript
* webpack
* npm
* gradle
* docker
* kubernetes
* pytorch

## Current state

This can be called as 'works for me' :-). There are lot of bugs and improvements remaining, as I wrote this program for learning react and java. But some of my colleagues were interested in it, so I pushed it up to github

Comments and contributions are welcome 

## Setup

1. Database: 
   * I use postgresql. But should work with other databases too.
   * create a database. The tables will be setup with liquibase
   * fill in the connection in `docker/Dockerfile` as parameter to the ENTRYPOINT

2. Build:
   * `./gradlew CopyDocker`
   * `cd build/docker`
   * `docker build .`

3. Start the service
   * `docker run <image id>`

4. Work: You should now be able to connect to http://localhost:8080 and see the first page

## Docker/Kubernetes

I used the files in docker and kubernetes sub directory to deploy this service into a small kubernetes cluster with use of external database service and ingresses. Theses scripts are not perfect but may be used as an example

## A small How to use 

My idea of filling the empty database:

0. select language. there is a small dropdown in the right lower corner. Default is German, because I'm using it this way

1. Add your categories and sub categories on 'Configuration page'. I am using something like this
   * daily
   ** food
   ** drugs
   * home
   ** monthly
   ** misc
   ** repair
   * income
   ** salary
   * misc
   ** doctor
   ** ...

2. Download the account data of your account as xml (hopefully, I implemented CAMT format)

3. Upload this file to your database with page "Account Records"

4. Now begin your journey through the first month in Tab "Assign"
    * Select an entry which is revolving
    * Press "Create Plan"
    * Choose category an sub category of the entry, edit pattern to match future occurrences of this entry and press save
    * back on the page "Assign", you should now press "Auto assign". Your entry should disappear from the list.
    * you can find it now assigned to your previous selected type in Tab "Check"
    * ...

5. if you upload the second month go again to "Assign" and press again "Auto assign". All the previous created revolving plans will disappear into the category section

6. In the category section now you can control all the revolving data and commit them with "commit". Then the data will get into account for the statistical overview which contains also a small forecast

There are some more functions and buttons, helping me planing and supervising my money, but I currently have no time to write a complete handbook. Fell free to look at the source code :-)

## Addons

There are some directories containing experimental stuff, which may be used as examples 

    * kubernetes: contains example yaml files to deploy accountcontrol into a kubernetes cluster
    * accountcontrol-ki: trying to create a model to automate assignments with KI :-D
