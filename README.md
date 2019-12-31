# kontospring
A small tool for supervising activities on your bank account

## History

At first, I just wanted to track, where all my money is lost :-). After trying this with and good old Excel sheet i moved over to some JSP (Primefaces) and J2EE stuff. The result was a more helpfull supervising tool with a little forecast, where I will end up at the end of the year. This works for me some years.   

But after all I was interrested in all the new stuff around there in the world and i was searching for a small project to try out all that fancy stuff with browsers and containers. So refactored my previous project. While reusing the database and some small business code I ended up in completly rewriting everything. 

## Technologies

Here some Buzzwords of the used tools and stuff:

* Springboot 
* React
* javascript
* Typescript
* webpack
* npm
* gradle
* docker

## Current state
This can be called as 'works for me' :-). There are lot of bugs and improvements remaining, as I wrote this programm for learning react and java. But some of my colleagues were interested in it, so I pushed it up to github

Comments and contributions are welcome 

## Setup
1. Database: 
    * I use postgresql. But should work with other databases too. 
   	* create a database 
   	* excute the sql-scripts in src/sql. This creates the tables and fills in some basic stuff. Hibernate should create the tables, but prefered this way
    * fill in the connection in docker/Dockerfile as parameter to the ENTRYPOINT
2. Build:
    * ./gradlew CopyDocker
    * cd build/docker
    * docker build .
3. Start the service
    * docker run <image id>
4. Work: You should now be able to connect to localhost:8080 and see the first page

## A small How to use 

My idea of filling the empty database:
1. Download the account data of your acount as xml (hopefully, I implemented CAMT format)
2. Upload this file int your database with Tab "Belege"
3. Now begin your journey through the first month in Tab "Buchen"
    * Select an entry which is revolving
	* Press "Planen"
	* Choose type an Subtype of the entry, edit pattern to match future occurences of this entry and press save
	* back on the Tab "Buchen", you should now press "automatisch". Your entry should disappear from the list.
	* you can find it now assigned to your previous selected type in Tab "Konten"
	* ...
4. if you upload the second month go again to "Buchen" and press again "Automatisch". All the previous created revovling plans will dispear into the category section
5. In the category section now you can control all the revolving data and commit them with "bestätigen". Then the data will get into account for the statistical overview wich contains also asmall forecast

There are some more functions and buttons, helping me planing and supervising my money, but I currently have no time to write a complete handbook. Fell free to look at the source code :-)
