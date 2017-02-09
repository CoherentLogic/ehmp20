Overview
========
This is an example of using dropwizard [http://bit.ly/WcgD9s]

How-to compile
==============
You can compile using the gradle wrapper or the native gradle
```
gradle clean fatJar
```

or
```
./g clean fatJar
```

How-to run
==========
```
./run.sh
```

You may have to grant executable rights `chmod a+x run.sh`


Opening in Eclipse
==================
If you use Eclipse, the gradle scripts are nice enough to create your eclipse project and classpath files.

First time only
---------------
If you have gradle installed, run:
```
gradle eclipse
```
Now you can import the project into eclipse.

Updating classpath files
------------------------
If you update dependencies, pull the new libs into your classpath:
```
gradle eclipseClasspath
```

Opening in Intellij Idea
==================
If you use Intellij, the gradle scripts are nice enough to create your intellij project and classpath files.

First time only
---------------
If you have gradle installed, run:
```
gradle idea
```
Now you can import the project into Intellij.

Configuration
=============

Change port
-----------
### Command Line
main port: `-Ddw.http.PORT     `
admin port: `-Ddw.http.adminPORT     `

### Config File
```
http:
	port: 9090
	adminPort:9091
