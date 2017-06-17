const FullyAssociativeCache = require('./models/fully_associative_cache');
const DirectMappedCache = require('./models/direct_mapped_cache');
const SetAssociativeCache = require('./models/set_associative_cache');
const VictimCache = require('./models/victim_cache');
const WriteBuffer = require('./models/write_buffer');
const MemoryLocation = require('./models/memory_location');
const Memory = require('./models/memory');
const Utils = require('./lib/utils');
const Simulation = require('./models/simulation');
const simulationParams = require('./simulations/direct_mapped');

const simulation = new Simulation(simulationParams);
simulation.run();
