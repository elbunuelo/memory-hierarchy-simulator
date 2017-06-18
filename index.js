const Simulation = require('./models/simulation');

let number = process.argv[2];
if (number < 10) {
  number = `0${number}`;
}
let simulationParams = null;

try {
  simulationParams = require(`./simulations/${number}`);
} catch (e) {
  console.log('Invalid configuration selected. Terminating');
}

if (simulationParams) {
  const simulation = new Simulation(simulationParams);
  simulation.run();
}
