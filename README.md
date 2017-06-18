# Memory hierarchy simulator

# Dependencies
The project needs the latest version of nodejs to run (tested on v8.1.0), [here are installation instructions for mac os and other platforms]( https://nodejs.org/en/download/package-manager/#osx).

# Running
* First, you must get the sources from github either by [downloading the zip file](https://github.com/elbunuelo/memory-hierarchy-simulator/archive/master.zip) or cloning the repository by running `git clone https://github.com/elbunuelo/memory-hierarchy-simulator.git`
* After cloning the repository run `cd memory-hierarchy-simulator` and then `npm install` to install all of the dependencies.
* Run one of the following commands to view the simulations:
    * `npm run first`: Simulates a fully associative cache with first in first out overwrite strategy, write through + no write allocate write strategies and single page memory.
    * `npm run second`: Simulates a fully associative cache with random overwrite strategy, write through + no write allocate write strategies and single page memory.
    * `npm run third`: Simulates a direct mapped cache with victim cache, write back + write allocate write strategies, single page memory and a victim cache.
    * `npm run fourth`: Simulates a 4 way set associative cache with write buffer, least recently used overwrite strategy, write through + no write allocate write strategy, two page virtual memory and a write buffer.

# Creating new simulations

New simulations should be placed in the `simulations` folder with any name. The file contents should follow the same format as the existing simulations which can be used as reference. 
To execute custom simulations you can either run `node index.js your-file-name`(without the .js extension) or add an entry in the scripts object in the package.json: 
```
scripts: {
...
"my-custom-simulation": "node index.js your-file-name"
}
``` 
and then run `npm run my-custom-simulation`
