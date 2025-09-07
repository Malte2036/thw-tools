'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export type CalendarView = 'month' | 'week';

interface CalendarProps {
  events?: CalendarEvent[];
  initialView?: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date | null) => void;
  onViewChange?: (view: CalendarView) => void;
}

export function Calendar({
  events = [],
  initialView,
  onEventClick,
  onDayClick,
  onViewChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('month');

  const switchView = useCallback(
    (view: CalendarView) => {
      setCurrentView(view);
      onViewChange?.(view);
    },
    [onViewChange]
  );

  // Check if we're on a mobile device and set initial view accordingly
  const checkIsMobile = useCallback(() => {
    const wasMobile = isMobile;
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    // If initialView is undefined, set view based on mobile state
    if (initialView === undefined) {
      if (mobile && currentView === 'month') {
        switchView('week');
      } else if (!mobile && wasMobile && currentView === 'week') {
        switchView('month');
      } else if (!mobile && wasMobile && currentView === 'month') {
        switchView('week');
      }
    }
  }, [initialView, currentView, isMobile, switchView]);

  // Set initial view based on initialView prop or mobile state
  useEffect(() => {
    if (initialView !== undefined) {
      switchView(initialView);
    } else if (isMobile) {
      switchView('week');
    } else {
      switchView('month');
    }
  }, [initialView, isMobile, switchView]);

  // Add a resize listener to update mobile status
  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [checkIsMobile]);

  const year = useMemo(() => currentDate.getFullYear(), [currentDate]);
  const month = useMemo(() => currentDate.getMonth(), [currentDate]);

  const getWeekStartDate = useCallback((date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay() || 7; // Get day of week (0 is Sunday, so convert 0 to 7 for Monday)
    if (day !== 1) {
      // If not Monday
      d.setHours(-24 * (day - 1)); // Go back to Monday
    }
    return new Date(d.setHours(0, 0, 0, 0));
  }, []);

  const getWeekEndDate = useCallback(
    (date: Date): Date => {
      const d = new Date(getWeekStartDate(date));
      d.setDate(d.getDate() + 6); // Sunday
      return new Date(d.setHours(23, 59, 59, 999));
    },
    [getWeekStartDate]
  );

  const weekStartDate = useMemo(
    () => getWeekStartDate(currentDate),
    [currentDate, getWeekStartDate]
  );
  const weekEndDate = useMemo(() => getWeekEndDate(currentDate), [currentDate, getWeekEndDate]);

  const getDaysInMonth = useCallback((year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      onEventClick?.(event);
    },
    [onEventClick]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      // Toggle selection - if clicking the same date, unselect it
      if (
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      ) {
        setSelectedDate(null);
        onDayClick?.(null);
      } else {
        setSelectedDate(date);
        onDayClick?.(date);
      }
    },
    [selectedDate, onDayClick]
  );

  const previousPeriod = useCallback(() => {
    if (currentView === 'month') {
      setCurrentDate(new Date(year, month - 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  }, [currentView, year, month, currentDate]);

  const nextPeriod = useCallback(() => {
    if (currentView === 'month') {
      setCurrentDate(new Date(year, month + 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  }, [currentView, year, month, currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const getDateFromNumbers = useCallback((year: number, month: number, day: number): Date => {
    return new Date(year, month, day);
  }, []);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  const isSelectedDate = useCallback(
    (date: Date): boolean => {
      if (!selectedDate) return false;
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    },
    [selectedDate]
  );

  const calendarDays = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1),
    [getDaysInMonth, year, month]
  );

  const firstDayOfMonth = useMemo(
    () => getFirstDayOfMonth(year, month),
    [getFirstDayOfMonth, year, month]
  );
  const monthName = useMemo(
    () => currentDate.toLocaleString('de-DE', { month: 'long' }),
    [currentDate]
  );

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStartDate);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [weekStartDate]
  );

  const getEventsForDay = useCallback(
    (date: Date) => {
      // Normalize the date to midnight for comparison
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

      return events.filter((event: CalendarEvent) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Check if the event overlaps with this day
        return (
          (eventStart <= dayEnd && eventEnd >= dayStart) || // Event overlaps with the day
          (eventStart.getFullYear() === dayStart.getFullYear() &&
            eventStart.getMonth() === dayStart.getMonth() &&
            eventStart.getDate() === dayStart.getDate()) // Event starts on this day
        );
      });
    },
    [events]
  );

  const isFirstDayOfEvent = useCallback((event: CalendarEvent, date: Date): boolean => {
    const eventStart = new Date(event.start);

    return (
      eventStart.getDate() === date.getDate() &&
      eventStart.getMonth() === date.getMonth() &&
      eventStart.getFullYear() === date.getFullYear()
    );
  }, []);

  // Get max events count for the week to determine cell heights in desktop view
  const getMaxEventsCountForWeek = useCallback(() => {
    let maxCount = 0;
    weekDays.forEach((day) => {
      const count = getEventsForDay(day).length;
      if (count > maxCount) maxCount = count;
    });
    return maxCount;
  }, [weekDays, getEventsForDay]);

  // Dynamic week cell height based on number of events
  const getWeekCellHeight = useCallback(
    (day: Date) => {
      if (isMobile) return 'min-h-16';

      const eventCount = getEventsForDay(day).length;
      const maxEvents = getMaxEventsCountForWeek();

      // If we have a significant number of events in any day, adjust all cells to be larger
      if (maxEvents > 3) {
        return 'h-auto min-h-40 md:min-h-48 lg:min-h-56';
      } else if (eventCount > 3) {
        // Only this specific day has many events
        return 'h-auto min-h-40 md:min-h-48';
      } else {
        // Default height
        return 'h-24 sm:h-28 md:h-36 lg:h-40';
      }
    },
    [isMobile, getEventsForDay, getMaxEventsCountForWeek]
  );

  // Format time in a concise way
  const formatTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Get the month in a better format
  const formattedMonth = useMemo(
    () => `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`,
    [monthName, year]
  );

  // Format the week range in a nicer way
  const formattedWeekRange = useMemo(
    () =>
      `${weekStartDate.getDate()}. - ${weekEndDate.getDate()}. ${weekStartDate.toLocaleDateString('de-DE', { month: 'long' })} ${year}`,
    [weekStartDate, weekEndDate, year]
  );

  return (
    <div className="calendar bg-white rounded-lg border border-gray-200 shadow-sm w-full overflow-x-auto">
      <div className="calendar-header p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-thw-50 to-white">
        <div className="flex items-center justify-between">
          <button
            className="p-2 text-thw-600 hover:bg-thw-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={previousPeriod}
            aria-label="Vorherige Periode"
          >
            ←
          </button>
          <div className="flex flex-col items-center">
            {currentView === 'month' ? (
              <h2 className="text-sm sm:text-lg font-semibold text-thw-800">{formattedMonth}</h2>
            ) : (
              <h2 className="text-sm sm:text-lg font-semibold text-thw-800">
                {formattedWeekRange}
              </h2>
            )}
            <div className="flex items-center gap-2 mt-1">
              <button
                className="text-xs text-thw-600 hover:text-thw-700 underline px-2 py-1 rounded hover:bg-thw-50 transition-colors"
                onClick={goToToday}
              >
                Heute
              </button>
              <div className="text-xs rounded-md overflow-hidden flex border border-thw-200">
                <button
                  className={`px-3 py-1 transition-colors ${
                    currentView === 'month'
                      ? 'bg-thw-600 text-white'
                      : 'text-thw-600 hover:bg-thw-50'
                  }`}
                  onClick={() => switchView('month')}
                >
                  Monat
                </button>
                <button
                  className={`px-3 py-1 transition-colors ${
                    currentView === 'week'
                      ? 'bg-thw-600 text-white'
                      : 'text-thw-600 hover:bg-thw-50'
                  }`}
                  onClick={() => switchView('week')}
                >
                  Woche
                </button>
              </div>
            </div>
          </div>
          <button
            className="p-2 text-thw-600 hover:bg-thw-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={nextPeriod}
            aria-label="Nächste Periode"
          >
            →
          </button>
        </div>
      </div>

      <div className="calendar-body p-2 sm:p-4">
        {currentView === 'month' ? (
          <>
            {/* Month view - modernized */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-thw-600 p-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-14 sm:h-20 md:h-24 lg:h-28 p-0.5 border border-gray-100 bg-gray-50 rounded-md opacity-50"
                  ></div>
                )
              )}

              {calendarDays.map((day) => {
                const date = getDateFromNumbers(year, month, day);
                return (
                  <div
                    key={day}
                    className={`h-14 sm:h-20 md:h-24 lg:h-28 p-0.5 sm:p-1 border hover:border-thw-300 rounded-md transition-colors cursor-pointer
                    ${
                      isToday(date)
                        ? 'bg-thw-100 border-thw-500 shadow-md'
                        : isSelectedDate(date)
                          ? 'bg-thw-100 border-thw-500 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDayClick(date)}
                  >
                    <div className="flex justify-between items-center mb-1 px-1">
                      <span
                        className={
                          isToday(date)
                            ? 'bg-thw-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md'
                            : isSelectedDate(date)
                              ? 'bg-thw-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'
                              : 'text-xs sm:text-sm font-medium text-gray-700'
                        }
                      >
                        {day}
                      </span>
                      {isToday(date) && (
                        <span className="text-xs text-thw-700 font-semibold bg-white px-1.5 py-0.5 rounded hidden sm:inline shadow-sm">
                          Heute
                        </span>
                      )}
                      {isSelectedDate(date) && !isToday(date) && (
                        <span className="text-xs text-thw-500 bg-white px-1 rounded hidden sm:inline">
                          Ausgewählt
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-y-auto max-h-[calc(100%-20px)]">
                      {getEventsForDay(date).map((event) => {
                        const isFirst = isFirstDayOfEvent(event, date);
                        return (
                          <button
                            key={event.id}
                            className="w-full text-left text-xs p-1 rounded-sm flex items-center gap-0.5 transition-opacity hover:opacity-90"
                            style={{
                              backgroundColor: event.color || '#005b99',
                              color: 'white',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                          >
                            {!isFirst && <span className="text-xs">↪</span>}
                            <span className={`truncate flex-1 ${isFirst ? '' : 'pl-0.5'}`}>
                              {isMobile && event.title.length > 8
                                ? event.title.substring(0, 8) + '...'
                                : event.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Week View - Vertical on mobile, horizontal on desktop */}
            {isMobile ? (
              /* Mobile vertical layout - modernized */
              <div className="space-y-3">
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer
                    ${isToday(day) ? 'border-thw-300' : isSelectedDate(day) ? 'border-thw-500' : ''}`}
                    onClick={() => handleDayClick(day)}
                  >
                    {/* Day header */}
                    <div
                      className={`flex justify-between items-center p-2
                      ${
                        isToday(day)
                          ? 'bg-thw-200 shadow-inner'
                          : isSelectedDate(day)
                            ? 'bg-thw-100'
                            : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-600">
                            {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                          </span>
                          <span
                            className={`text-base font-bold
                            ${
                              isToday(day)
                                ? 'text-thw-800'
                                : isSelectedDate(day)
                                  ? 'text-thw-600'
                                  : 'text-gray-800'
                            }`}
                          >
                            {day.getDate()}.{day.getMonth() + 1}.
                          </span>
                        </div>
                      </div>
                      {isToday(day) && (
                        <span className="text-xs font-medium text-thw-700 bg-white px-2 py-0.5 rounded-full shadow-sm">
                          Heute
                        </span>
                      )}
                      {isSelectedDate(day) && !isToday(day) && (
                        <span className="text-xs font-medium text-thw-500 bg-white px-2 py-0.5 rounded-full shadow-sm">
                          Ausgewählt
                        </span>
                      )}
                    </div>

                    {/* Day events */}
                    <div className={`p-2 ${getEventsForDay(day).length > 0 ? 'space-y-2' : ''}`}>
                      {getEventsForDay(day).length === 0 ? (
                        <div className="text-xs text-gray-500 text-center py-2">
                          Keine Reservierungen
                        </div>
                      ) : (
                        getEventsForDay(day).map((event) => {
                          const isFirst = isFirstDayOfEvent(event, day);
                          return (
                            <button
                              key={event.id}
                              className="w-full text-left p-2 rounded-md flex items-center gap-1 shadow-sm transition-opacity hover:opacity-90"
                              style={{
                                backgroundColor: event.color || '#005b99',
                                color: 'white',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                            >
                              {!isFirst && <span className="text-sm mr-1 opacity-80">↪</span>}
                              <div className="flex-1">
                                <div className="font-medium">{event.title}</div>
                                {isFirst && (
                                  <div className="text-xs mt-0.5 opacity-80">
                                    {formatTime(new Date(event.start))}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop horizontal layout - modernized */
              <>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-3">
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="text-center flex flex-col items-center">
                      <div className="text-xs sm:text-sm font-medium text-thw-600 mb-0.5">
                        {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                      </div>
                      <div
                        className={`text-sm sm:text-base font-bold mb-1 w-8 h-8 flex items-center justify-center rounded-full
                        ${
                          isToday(day)
                            ? 'bg-thw-700 text-white shadow-md'
                            : isSelectedDate(day)
                              ? 'bg-thw-500 text-white shadow-sm'
                              : 'text-gray-700'
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={`${getWeekCellHeight(day)} p-1 sm:p-2 border rounded-md hover:border-thw-300 transition-colors cursor-pointer
                      ${
                        isToday(day)
                          ? 'bg-thw-100 border-thw-500 shadow-md'
                          : isSelectedDate(day)
                            ? 'bg-thw-100 border-thw-500 shadow-sm'
                            : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="space-y-1 overflow-y-auto h-full">
                        {getEventsForDay(day).map((event) => {
                          const isFirst = isFirstDayOfEvent(event, day);
                          return (
                            <button
                              key={event.id}
                              className="w-full text-left text-xs p-1.5 sm:p-2 rounded-md flex items-center shadow-sm transition-opacity hover:opacity-90"
                              style={{
                                backgroundColor: event.color || '#005b99',
                                color: 'white',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                            >
                              {!isFirst && <span className="mr-1 opacity-80">↪</span>}
                              <span className={`flex-1 truncate ${isFirst ? '' : 'pl-0.5'}`}>
                                {event.title}
                              </span>
                              {isFirst && (
                                <span className="text-xs bg-black bg-opacity-20 rounded px-1 whitespace-nowrap ml-1">
                                  {formatTime(new Date(event.start))}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
