# CPU Support package for the MA35H0 from Nuvoton

This CPU Support package enables the development for the MA35H0 Microprocessor family using the [Crossworks development environment](https://www.rowley.co.uk/arm/index.htm) from Rowley. The package provides all needed data and information to enabled the Development Environment to compile and debug applications on the MA35H0 Microprocessor
This Includes:

- CMSIS-Specific Code Files
- Memory-Map-Files
- Register-Descriptions for debugging
- Loader for programming the application to the Flash-memory

[Markus Klein](https://github.com/Masmiseim36) is helping with the development of this package.

## Build and Install

The Package is provided unpacked and has to be packed before it can be installed. For this open the Project File located in the root of the project with the Crossworks IDE (File WIZnet.hzp). Then “compile" it like a normal project (Build -> Build WIZnet). This will create the CPU-Support package in the root-Folder of the project (-> WIZnet.hzq).
To install the new created package, go to Tools -> Packages -> Manually Install Packages and choose the new File.  
![Package Manager](./doc/Menu_PackageManagerManual.png)


[This document was copied and modified from Markus Klein's article.](https://github.com/Masmiseim36/Kinetis)
