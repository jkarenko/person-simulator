const {
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
  weekdayFood,
  randomEncounter,
  isPersonAlive,
  shouldSleep,
  shouldRest,
  generateFinalReport
} = require('./person');

describe('Person Module', () => {
  describe('createPerson', () => {
    it('should create a person with default values', () => {
      const person = createPerson();
      expect(person).toEqual(expect.objectContaining({
        isAlive: true,
        daysAlive: 0,
        codeCount: 0,
        restCount: 0,
        sleepSkipped: 0,
        lastSleepSkipped: null,
        cumulativeStress: 0
      }));
      expect(person.currentDate).toBeInstanceOf(Date);
    });

    it('should create a person with a specified start date', () => {
      const startDate = new Date('2023-01-01');
      const person = createPerson(startDate);
      expect(person.currentDate).toEqual(startDate);
    });
  });

  describe('eat', () => {
    it('should update the lastMeal of a person', () => {
      const person = createPerson();
      const updatedPerson = eat(person, Food.PIZZA);
      expect(updatedPerson.lastMeal).toBe(Food.PIZZA);
    });
  });

  describe('sleep', () => {
    it('should advance the date by one day and reduce stress', () => {
      const person = createPerson(new Date('2023-01-01'));
      person.cumulativeStress = 20;
      const updatedPerson = sleep(person);
      expect(updatedPerson.currentDate).toEqual(new Date('2023-01-02'));
      expect(updatedPerson.cumulativeStress).toBe(10);
    });
  });

  describe('code', () => {
    it('should increase codeCount and stress', () => {
      const person = createPerson();
      const updatedPerson = code(person);
      expect(updatedPerson.codeCount).toBe(1);
      expect(updatedPerson.cumulativeStress).toBe(5);
    });
  });

  describe('rest', () => {
    it('should increase restCount and reduce stress', () => {
      const person = createPerson();
      person.cumulativeStress = 20;
      const updatedPerson = rest(person);
      expect(updatedPerson.restCount).toBe(1);
      expect(updatedPerson.cumulativeStress).toBe(5);
    });
  });

  describe('visit', () => {
    it('should not change isAlive when not visited by GrimReaper', () => {
      const person = createPerson();
      const updatedPerson = visit(person, null);
      expect(updatedPerson.isAlive).toBe(true);
    });

    it('should change isAlive to false when visited by GrimReaper', () => {
      const person = createPerson();
      const updatedPerson = visit(person, GrimReaper);
      expect(updatedPerson.isAlive).toBe(false);
    });
  });

  describe('getCurrentWeekday', () => {
    it('should return the correct weekday', () => {
      const date = new Date('2023-06-19'); // A Monday
      expect(getCurrentWeekday(date)).toBe(Weekday.MONDAY);
    });
  });

  describe('lifeCycle', () => {
    it('should process a day in a person\'s life', () => {
      const person = createPerson(new Date('2023-06-19')); // A Monday
      const updatedPerson = lifeCycle(person, Food.DOGFOOD, null, true, () => false);
      expect(updatedPerson.lastMeal).toBe(Food.DOGFOOD);
      expect(updatedPerson.daysAlive).toBe(1);
      expect(updatedPerson.codeCount).toBe(1);
      expect(updatedPerson.currentDate).toEqual(new Date('2023-06-20'));
    });
  });

  describe('weekdayFood', () => {
    it('should return DOGFOOD on Monday', () => {
      const date = new Date('2023-06-19'); // A Monday
      expect(weekdayFood(date)).toBe(Food.DOGFOOD);
    });

    it('should return SALAD on a regular weekday', () => {
      const date = new Date('2023-06-20'); // A Tuesday
      expect(weekdayFood(date)).toBe(Food.SALAD);
    });
  });

  describe('randomEncounter', () => {
    it('should sometimes return GrimReaper based on stress', () => {
      const encounters = Array(1000).fill().map(() => randomEncounter(100));
      const grimReaperEncounters = encounters.filter(e => e === GrimReaper);
      expect(grimReaperEncounters.length).toBeGreaterThan(0);
      expect(grimReaperEncounters.length).toBeLessThan(1000);
    });
  });
  
  describe('isPersonAlive', () => {
    it('should return true for a living person', () => {
      const person = createPerson();
      expect(isPersonAlive(person)).toBe(true);
    });

    it('should return false for a dead person', () => {
      const person = { ...createPerson(), isAlive: false };
      expect(isPersonAlive(person)).toBe(false);
    });
  });

  describe('shouldSleep', () => {
    it('should return true on a weekday', () => {
      const date = new Date('2023-06-19'); // A Monday
      expect(shouldSleep(date)).toBe(true);
    });

    it('should return false on Friday', () => {
      const date = new Date('2023-06-23'); // A Friday
      expect(shouldSleep(date)).toBe(false);
    });
  });

  describe('shouldRest', () => {
    it('should return true when stress is high', () => {
      const person = { ...createPerson(), cumulativeStress: 51 };
      expect(shouldRest(person)).toBe(true);
    });

    it('should return true on weekend', () => {
      const person = { ...createPerson(), currentDate: new Date('2023-06-24') }; // A Saturday
      expect(shouldRest(person)).toBe(true);
    });
  });

  describe('generateFinalReport', () => {
    it('should generate a report with correct properties', () => {
      const person = {
        ...createPerson(),
        daysAlive: 10,
        codeCount: 5,
        restCount: 3,
        sleepSkipped: 2,
        cumulativeStress: 30
      };
      const report = generateFinalReport(person);
      expect(report).toEqual({
        daysAlive: 10,
        codeCount: 5,
        restCount: 3,
        currentDate: expect.any(String),
        sleepSkipped: 2,
        finalStressLevel: 30
      });
    });
  });
});
