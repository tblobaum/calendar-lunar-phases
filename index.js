const getMoonPhasesList = require('./moon-phases.js');

function formatDate(date) {
  // Format the date to the ICS format: 'YYYYMMDDTHHmmssZ'
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '') + 'Z';
}

function createIcsEvent(date, title) {
  const startDate = formatDate(date);
  const endDate = formatDate(new Date(date.getTime() + 60 * 60 * 1000)); // 1 hour event
  return `BEGIN:VEVENT\nDTSTART:${startDate}\nDTEND:${endDate}\nSUMMARY:${title}\nEND:VEVENT\n`;
}

function generateIcsCalendar(moonPhases) {
  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Identifier//EN\n';

  moonPhases.forEach(({ phase, date }) => {
      icsContent += createIcsEvent(new Date(date), `Moon Phase: ${phase}`);
  });

  icsContent += 'END:VCALENDAR';
  return icsContent;
}

// Example data - replace with actual moon phase dates
// const moonPhases = [
//   { phase: 'New Moon', date: '2023-01-21T00:00:00Z' },
//   { phase: 'First Quarter', date: '2023-01-28T00:00:00Z' },
//   { phase: 'Full Moon', date: '2023-02-05T00:00:00Z' },
//   { phase: 'Last Quarter', date: '2023-02-13T00:00:00Z' },
//   // ... other moon phases for the year
// ];

const monthsToCalculate = 12; 
const moonPhases = getMoonPhasesList(monthsToCalculate); 

console.log(moonPhases); 

const icsCalendar = generateIcsCalendar(moonPhases);


console.log(icsCalendar); 

// Code to download the .ICS file (implementation depends on your environment)


