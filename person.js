const Food = {
  DOGFOOD: 'dogfood',
  PIZZA: 'pizza',
  SUSHI: 'sushi',
  SALAD: 'salad',
  COFFEE: 'coffee'
};

const GrimReaper = Symbol('GrimReaper');

const Weekday = {
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday'
};

const createPerson = (startDate = new Date()) => ({
  isAlive: true,
  daysAlive: 0,
  codeCount: 0,
  restCount: 0,
  currentDate: startDate,
  sleepSkipped: 0,
  lastSleepSkipped: null,
  cumulativeStress: 0
});

const eat = (person, food) => ({
  ...person,
  lastMeal: food
});

const sleep = person => ({
  ...person,
  currentDate: new Date(person.currentDate.getTime() + 24 * 60 * 60 * 1000),
  cumulativeStress: Math.max(0, person.cumulativeStress - 10)
});

const code = person => ({
  ...person,
  codeCount: person.codeCount + 1,
  cumulativeStress: person.cumulativeStress + 5
});

const rest = person => ({
  ...person,
  restCount: person.restCount + 1,
  cumulativeStress: Math.max(0, person.cumulativeStress - 15)
});

const visit = (person, entity) => 
  entity === GrimReaper ? { ...person, isAlive: false } : person;

const getCurrentWeekday = date => {
  const days = Object.values(Weekday);
  return days[date.getDay()];
};

const lifeCycle = (person, food, entity, shouldSleep, shouldRest) => {
  const currentDay = person.currentDate.toDateString();
  
  const updatedPerson = [
    p => eat(p, food),
    p => shouldSleep && person.lastSleepSkipped !== currentDay
      ? sleep(p)
      : {
          ...p,
          sleepSkipped: p.sleepSkipped + 1,
          lastSleepSkipped: currentDay,
          currentDate: new Date(p.currentDate.getTime() + 24 * 60 * 60 * 1000),
          cumulativeStress: p.cumulativeStress + 20
        },
    p => shouldRest(p) ? rest(p) : code(p),
    p => ({ ...p, daysAlive: p.daysAlive + 1 }),
    p => visit(p, entity)
  ].reduce((acc, fn) => fn(acc), person);

  return updatedPerson;
};

const simulateLife = (initialPerson, foodSource, entityEncounter, isAlive, shouldSleep, shouldRest) => {
  const updatedPerson = lifeCycle(
    initialPerson, 
    foodSource(initialPerson.currentDate), 
    entityEncounter(initialPerson.cumulativeStress),
    shouldSleep(initialPerson.currentDate),
    shouldRest
  );
  
  console.log(`Day ${updatedPerson.daysAlive}: ${getCurrentWeekday(updatedPerson.currentDate)} - Ate ${updatedPerson.lastMeal}, ${shouldSleep(initialPerson.currentDate) ? 'Slept' : 'Skipped sleep'}, ${shouldRest(updatedPerson) ? 'Rested' : 'Coded'}, Stress: ${updatedPerson.cumulativeStress}`);
  
  return isAlive(updatedPerson) ? 
    simulateLife(updatedPerson, foodSource, entityEncounter, isAlive, shouldSleep, shouldRest) : 
    updatedPerson;
};

const weekdayFood = date => {
  const weekday = getCurrentWeekday(date);
  const foodMap = {
    [Weekday.MONDAY]: Food.DOGFOOD,
    [Weekday.FRIDAY]: Food.PIZZA,
    [Weekday.SATURDAY]: Food.SUSHI,
    [Weekday.SUNDAY]: Food.SUSHI
  };
  return foodMap[weekday] || Food.SALAD;
};

const randomEncounter = cumulativeStress => {
  const baseChance = 0.01;
  const increasedChance = baseChance * (1 + cumulativeStress * 0.01);
  return Math.random() < increasedChance ? GrimReaper : null;
};

const isPersonAlive = person => person.isAlive;

const shouldSleep = date => {
  const weekday = getCurrentWeekday(date);
  return ![Weekday.FRIDAY, Weekday.SATURDAY].includes(weekday);
};

const shouldRest = person => {
  const weekday = getCurrentWeekday(person.currentDate);
  return person.cumulativeStress > 50 || 
         [Weekday.SATURDAY, Weekday.SUNDAY].includes(weekday);
};

const generateFinalReport = person => ({
  daysAlive: person.daysAlive,
  codeCount: person.codeCount,
  restCount: person.restCount,
  currentDate: person.currentDate.toDateString(),
  sleepSkipped: person.sleepSkipped,
  finalStressLevel: person.cumulativeStress
});

const runSimulation = () => {
  const finalPerson = simulateLife(
    createPerson(),
    weekdayFood,
    randomEncounter,
    isPersonAlive,
    shouldSleep,
    shouldRest
  );

  const report = generateFinalReport(finalPerson);
  console.log('\nFinal Report:', report);
  return report;
};

module.exports = {
  Food,
  Weekday,
  GrimReaper,
  createPerson,
  eat,
  sleep,
  code,
  rest,
  visit,
  getCurrentWeekday,
  lifeCycle,
  simulateLife,
  weekdayFood,
  randomEncounter,
  isPersonAlive,
  shouldSleep,
  shouldRest,
  generateFinalReport,
  runSimulation
};
