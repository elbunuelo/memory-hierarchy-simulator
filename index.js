const Simulation = require('./models/simulation');
const simulationParams = require('./simulations/02');

const simulation = new Simulation(simulationParams);
simulation.run();
