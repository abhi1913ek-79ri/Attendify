import React from 'react';
import { Tooltip } from 'react-tooltip';
import useAutoUpdatingTodayDate from '../../utils/useAutoUpdatingTodayDate';
import './StudentHeatmapCalendar.css';
import { CalendarSearch } from 'lucide-react';

const StudentHeatmapCalendar = ({ presentDates }) => {
  const todayStr = useAutoUpdatingTodayDate();
  const today = new Date(todayStr);

  const daysToShow = 275;
  const start = new Date(today);
  start.setDate(today.getDate() - daysToShow + 1);

  const validDates = Array.isArray(presentDates)
    ? presentDates.filter(date => !isNaN(new Date(date)))
    : [];

  const values = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    return {
      date,
      dateStr,
      count: validDates.includes(dateStr) ? 1 : 0,
    };
  });

  // Organize dates by week (each week is an array of 7 days)
  const weeks = [];
  let week = new Array(7).fill(null);
  values.forEach((v) => {
    const day = v.date.getDay(); // Sunday = 0
    if (day === 0 && week.some(cell => cell)) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
    week[day] = v;
  });
  weeks.push(week); // push last

  // Get month labels for each week
  const getMonthLabels = () => {
    return weeks.map((week, idx) => {
      for (let day of week) {
        if (day) {
          return day.date.toLocaleString('default', { month: 'short' });
        }
      }
      return '';
    });
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="heat-calendar bg-white p-4 rounded-lg shadow-2xl ">
      <h2 className="heat-calendar-heading text-2xl font-semibold text-blue-950  flex justify-center items-center gap-0.5">
        <CalendarSearch /> Attendance History
      </h2>

      <div className="flex gap-1">
        {/* Weekday labels (vertical) */}
        <div className="week-lable flex flex-col items-center gap-1 mr-2 mt-5 pt-5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className=" text-xs text-gray-600 w-5 h-5 flex items-center justify-center">{d}</div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1 items-center">
              <div className="text-[10px] text-gray-500 mb-1">{monthLabels[weekIdx]}</div>
              {week.map((day, dayIdx) => {
                const isFuture = day?.date > today;
                const isPresent = day?.count === 1;
                return (
                  <div
                    key={dayIdx}
                    className={`w-5 h-5 rounded-sm border border-gray-200 ${
                      isFuture ? 'bg-black' : isPresent ? 'bg-green-300' : 'bg-gray-100'
                    }`}
                    data-tooltip-id="attendance-tooltip"
                    data-tooltip-content={
                      day?.date
                        ? `${day.date.toDateString()} — ${isPresent ? 'Present' : isFuture ? 'Future' : 'Absent'}`
                        : ''
                    }
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Tooltip id="attendance-tooltip" />
    </div>
  );
};

export default StudentHeatmapCalendar;
