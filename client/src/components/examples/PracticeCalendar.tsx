import PracticeCalendar from '../PracticeCalendar';

export default function PracticeCalendarExample() {
  // todo: remove mock functionality
  const mockDays = [
    { day: 1, minutes: 15, rounds: ['NS'], isToday: false },
    { day: 2, minutes: 20, rounds: ['SP'], isToday: false },
    { day: 3, minutes: 10, rounds: ['TG'], isToday: false },
    { day: 4, minutes: 15, rounds: ['NS'], isToday: false },
    { day: 5, minutes: 25, rounds: ['TM', 'SP'], isToday: true },
    { day: 6 }, { day: 7 }, { day: 8 },
    { day: 9, minutes: 15, rounds: ['NS'] },
    { day: 10, minutes: 30, rounds: ['TG'] },
    { day: 11 }, { day: 12 },
    { day: 13, minutes: 15, rounds: ['NS'] },
    { day: 14 }, { day: 15, minutes: 20, rounds: ['SP'] },
    { day: 16, minutes: 15, rounds: ['NS'] },
    { day: 17 }, { day: 18, minutes: 10, rounds: ['TG'] },
    { day: 19, minutes: 15, rounds: ['NS'] },
    { day: 20 }, { day: 21, minutes: 25, rounds: ['TM'] },
    { day: 22, minutes: 15, rounds: ['NS'] },
    { day: 23 }, { day: 24, minutes: 10, rounds: ['TG'] },
    { day: 25, minutes: 15, rounds: ['NS'] },
    { day: 26, minutes: 30, rounds: ['TG'] },
    { day: 27 }, { day: 28, minutes: 15, rounds: ['NS'] },
    { day: 29 }, { day: 30, minutes: 20, rounds: ['SP'] }
  ];

  return <PracticeCalendar month="Practice Calendar" days={mockDays} />;
}