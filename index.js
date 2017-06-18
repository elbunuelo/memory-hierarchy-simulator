const Simulation = require('./models/simulation');

const number = process.argv[2];
let simulationParams = null;

try {
  simulationParams = require(`./simulations/0${number}`);
} catch (e) {
  console.log('Invalid configuration selected. Terminating');
}

if (simulationParams) {
  const simulation = new Simulation(simulationParams);
  simulation.run();
}
