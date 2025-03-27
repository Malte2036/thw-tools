<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
  }

  export let events: CalendarEvent[] = [];

  const dispatch = createEventDispatcher<{
    eventClick: CalendarEvent;
  }>();

  let currentDate = new Date();
  let currentView = 'month';

  $: year = currentDate.getFullYear();
  $: month = currentDate.getMonth();

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  }

  function handleEventClick(event: CalendarEvent) {
    dispatch('eventClick', event);
  }

  function previousMonth() {
    currentDate = new Date(year, month - 1);
  }

  function nextMonth() {
    currentDate = new Date(year, month + 1);
  }

  function goToToday() {
    currentDate = new Date();
  }

  function getDateFromNumbers(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  }

  function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  function isToday(year: number, month: number, day: number): boolean {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  }

  $: calendarDays = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  $: firstDayOfMonth = getFirstDayOfMonth(year, month);
  $: monthName = currentDate.toLocaleString('de-DE', { month: 'long' });

  $: eventsInMonth = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
    return eventStart <= monthEnd && eventEnd >= monthStart;
  });

  function getEventsForDay(day: number) {
    const currentDate = getDateFromNumbers(year, month, day);
    const nextDate = getDateFromNumbers(year, month, day + 1);
    
    return eventsInMonth.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Check if the event spans this day
      return isDateInRange(currentDate, eventStart, eventEnd) || 
             isDateInRange(nextDate, eventStart, eventEnd) ||
             (eventStart <= currentDate && eventEnd >= nextDate);
    });
  }

  function isFirstDayOfEvent(event: CalendarEvent, day: number): boolean {
    const eventStart = new Date(event.start);
    const currentDate = getDateFromNumbers(year, month, day);
    
    return eventStart.getDate() === currentDate.getDate() && 
           eventStart.getMonth() === currentDate.getMonth() && 
           eventStart.getFullYear() === currentDate.getFullYear();
  }
</script>

<div class="calendar bg-white rounded-lg border border-gray-200 w-full">
  <div class="calendar-header p-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <button
        class="p-2 hover:bg-gray-100 rounded-md"
        on:click={previousMonth}
      >
        ←
      </button>
      <div class="flex flex-col items-center">
        <h2 class="text-lg font-semibold">{monthName} {year}</h2>
        <button 
          class="text-xs text-thw-600 hover:text-thw-700 mt-1 underline"
          on:click={goToToday}
        >
          Heutiger Tag
        </button>
      </div>
      <button
        class="p-2 hover:bg-gray-100 rounded-md"
        on:click={nextMonth}
      >
        →
      </button>
    </div>
  </div>

  <div class="calendar-body p-4">
    <div class="grid grid-cols-7 gap-2 mb-2">
      {#each ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as day}
        <div class="text-center text-sm font-medium text-gray-600">{day}</div>
      {/each}
    </div>

    <div class="grid grid-cols-7 gap-2">
      {#each Array(firstDayOfMonth - 1 || 7) as _}
        <div class="h-20 sm:h-24 p-1 border border-gray-100 bg-gray-50"></div>
      {/each}

      {#each calendarDays as day}
        <div class="h-20 sm:h-24 p-1 border border-gray-100 hover:bg-gray-50 overflow-hidden
          {isToday(year, month, day) ? 'bg-thw-50 border-thw-300' : ''}">
          <div class="text-sm font-medium mb-1 flex justify-between items-center">
            <span class={isToday(year, month, day) ? 'bg-thw-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}>
              {day}
            </span>
            {#if isToday(year, month, day)}
              <span class="text-xs text-thw-600">Heute</span>
            {/if}
          </div>
          <div class="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
            {#each getEventsForDay(day) as event}
              <button
                class="w-full text-left text-xs p-1 rounded truncate"
                style="background-color: {event.color || '#3b82f6'}; color: white;"
                on:click={() => handleEventClick(event)}
                title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
              >
                {isFirstDayOfEvent(event, day) ? event.title : '↪ ' + event.title}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div> 