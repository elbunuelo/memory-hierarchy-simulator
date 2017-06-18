const Simulation = require('./models/simulation');
const simulationParams = require('./simulations/01');

const simulation = new Simulation(simulationParams);
simulation.run();
