const { runSimulation } = require('./person');

class SimulationRunner {
  constructor() {
    this.originalConsoleLog = console.log;
    this.logs = [];
  }

  captureLog(message) {
    this.logs.push(message);
    this.originalConsoleLog(message);
  }

  run() {
    console.log = this.captureLog.bind(this);
    const report = runSimulation();
    console.log = this.originalConsoleLog;
    return { report };
  }

  printDailyOutputs() {
    this.logs.forEach(log => console.log(log));
  }
}

const runner = new SimulationRunner();
const { report } = runner.run();

console.log(report);
