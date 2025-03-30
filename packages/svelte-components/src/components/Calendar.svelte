<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
  }

  const { events = [], initialView } = $props<{
    events?: CalendarEvent[];
    initialView?: 'month' | 'week' | undefined;
  }>();

  const dispatch = createEventDispatcher<{
    eventClick: CalendarEvent;
    viewChange: { view: 'month' | 'week' };
    dayClick: { date: Date | null };
  }>();

  let currentDate = $state(new Date());
  let isMobile = $state(false);
  let selectedDate = $state<Date | null>(null);
  let currentView = $state<'month' | 'week'>('month');

  // Check if we're on a mobile device and set initial view accordingly
  function checkIsMobile() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 640;

    // If initialView is undefined, set view based on mobile state
    if (initialView === undefined) {
      if (isMobile && currentView === 'month') {
        currentView = 'week';
        dispatch('viewChange', { view: 'week' });
      } else if (!isMobile && wasMobile && currentView === 'week') {
        currentView = 'month';
        dispatch('viewChange', { view: 'month' });
      }
    }
  }

  // Set initial view based on initialView prop or mobile state
  $effect(() => {
    if (initialView !== undefined) {
      currentView = initialView;
    } else if (isMobile) {
      currentView = 'week';
    } else {
      currentView = 'month';
    }
  });

  // Add a resize listener to update mobile status
  if (typeof window !== 'undefined') {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // Clean up on component destruction
    onDestroy(() => {
      window.removeEventListener('resize', checkIsMobile);
    });
  }

  const year = $derived(currentDate.getFullYear());
  const month = $derived(currentDate.getMonth());
  const weekStartDate = $derived(getWeekStartDate(currentDate));
  const weekEndDate = $derived(getWeekEndDate(currentDate));

  function getWeekStartDate(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay() || 7; // Get day of week (0 is Sunday, so convert 0 to 7 for Monday)
    if (day !== 1) {
      // If not Monday
      d.setHours(-24 * (day - 1)); // Go back to Monday
    }
    return new Date(d.setHours(0, 0, 0, 0));
  }

  function getWeekEndDate(date: Date): Date {
    const d = new Date(getWeekStartDate(date));
    d.setDate(d.getDate() + 6); // Sunday
    return new Date(d.setHours(23, 59, 59, 999));
  }

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
      month: '2-digit',
    });
  }

  function handleEventClick(event: CalendarEvent) {
    dispatch('eventClick', event);
  }

  function handleDayClick(date: Date) {
    // Toggle selection - if clicking the same date, unselect it
    if (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      selectedDate = null;
    } else {
      selectedDate = date;
    }
    dispatch('dayClick', { date: selectedDate });
  }

  function previousPeriod() {
    if (currentView === 'month') {
      currentDate = new Date(year, month - 1);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      currentDate = d;
    }
  }

  function nextPeriod() {
    if (currentView === 'month') {
      currentDate = new Date(year, month + 1);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      currentDate = d;
    }
  }

  function goToToday() {
    currentDate = new Date();
  }

  function switchView(newView: 'month' | 'week') {
    currentView = newView;
    dispatch('viewChange', { view: newView });
  }

  function getDateFromNumbers(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  }

  function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isSelectedDate(date: Date): boolean {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  }

  const calendarDays = $derived(
    Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1)
  );

  const firstDayOfMonth = $derived(getFirstDayOfMonth(year, month));
  const monthName = $derived(currentDate.toLocaleString('de-DE', { month: 'long' }));

  const weekDays = $derived(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStartDate);
      d.setDate(d.getDate() + i);
      return d;
    })
  );

  const eventsInMonth = $derived(
    events.filter((event: CalendarEvent) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
      return eventStart <= monthEnd && eventEnd >= monthStart;
    })
  );

  const eventsInWeek = $derived(
    events.filter((event: CalendarEvent) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return eventStart <= weekEndDate && eventEnd >= weekStartDate;
    })
  );

  function getEventsForDay(date: Date) {
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
  }

  function isFirstDayOfEvent(event: CalendarEvent, date: Date): boolean {
    const eventStart = new Date(event.start);

    return (
      eventStart.getDate() === date.getDate() &&
      eventStart.getMonth() === date.getMonth() &&
      eventStart.getFullYear() === date.getFullYear()
    );
  }

  // Get max events count for the week to determine cell heights in desktop view
  function getMaxEventsCountForWeek() {
    let maxCount = 0;
    weekDays.forEach((day) => {
      const count = getEventsForDay(day).length;
      if (count > maxCount) maxCount = count;
    });
    return maxCount;
  }

  // Dynamic week cell height based on number of events
  function getWeekCellHeight(day: Date) {
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
  }

  // Format the weekday header more nicely
  function formatWeekdayHeader(date: Date): string {
    const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
    const dayNum = date.getDate();
    return `${dayName} ${dayNum}`;
  }

  // Format time in a concise way
  function formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  // Get the month in a better format
  const formattedMonth = $derived(
    `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
  );

  // Format the week range in a nicer way
  const formattedWeekRange = $derived(
    `${weekStartDate.getDate()}. - ${weekEndDate.getDate()}. ${weekStartDate.toLocaleDateString('de-DE', { month: 'long' })} ${year}`
  );
</script>

<div class="calendar bg-white rounded-lg border border-gray-200 shadow-sm w-full overflow-x-auto">
  <div
    class="calendar-header p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-thw-50 to-white"
  >
    <div class="flex items-center justify-between">
      <button
        class="p-2 text-thw-600 hover:bg-thw-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        on:click={previousPeriod}
        aria-label="Vorherige Periode"
      >
        ←
      </button>
      <div class="flex flex-col items-center">
        {#if currentView === 'month'}
          <h2 class="text-sm sm:text-lg font-semibold text-thw-800">{formattedMonth}</h2>
        {:else}
          <h2 class="text-sm sm:text-lg font-semibold text-thw-800">{formattedWeekRange}</h2>
        {/if}
        <div class="flex items-center gap-2 mt-1">
          <button
            class="text-xs text-thw-600 hover:text-thw-700 underline px-2 py-1 rounded hover:bg-thw-50 transition-colors"
            on:click={goToToday}
          >
            Heute
          </button>
          <div class="text-xs rounded-md overflow-hidden flex border border-thw-200">
            <button
              class="px-3 py-1 transition-colors {currentView === 'month'
                ? 'bg-thw-600 text-white'
                : 'text-thw-600 hover:bg-thw-50'}"
              on:click={() => switchView('month')}
            >
              Monat
            </button>
            <button
              class="px-3 py-1 transition-colors {currentView === 'week'
                ? 'bg-thw-600 text-white'
                : 'text-thw-600 hover:bg-thw-50'}"
              on:click={() => switchView('week')}
            >
              Woche
            </button>
          </div>
        </div>
      </div>
      <button
        class="p-2 text-thw-600 hover:bg-thw-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        on:click={nextPeriod}
        aria-label="Nächste Periode"
      >
        →
      </button>
    </div>
  </div>

  <div class="calendar-body p-2 sm:p-4">
    {#if currentView === 'month'}
      <!-- Month view - modernized -->
      <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {#each ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as day}
          <div class="text-center text-xs sm:text-sm font-medium text-thw-600 p-1">{day}</div>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 sm:gap-2">
        {#each Array(firstDayOfMonth - 1 || 7) as _}
          <div
            class="h-14 sm:h-20 md:h-24 lg:h-28 p-0.5 border border-gray-100 bg-gray-50 rounded-md opacity-50"
          ></div>
        {/each}

        {#each calendarDays as day}
          {@const date = getDateFromNumbers(year, month, day)}
          <div
            class="h-14 sm:h-20 md:h-24 lg:h-28 p-0.5 sm:p-1 border hover:border-thw-300 rounded-md transition-colors cursor-pointer
            {isToday(date)
              ? 'bg-thw-100 border-thw-500 shadow-md'
              : isSelectedDate(date)
                ? 'bg-thw-100 border-thw-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'}"
            on:click={() => handleDayClick(date)}
          >
            <div class="flex justify-between items-center mb-1 px-1">
              <span
                class={isToday(date)
                  ? 'bg-thw-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md'
                  : isSelectedDate(date)
                    ? 'bg-thw-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'
                    : 'text-xs sm:text-sm font-medium text-gray-700'}
              >
                {day}
              </span>
              {#if isToday(date)}
                <span
                  class="text-xs text-thw-700 font-semibold bg-white px-1.5 py-0.5 rounded hidden sm:inline shadow-sm"
                  >Heute</span
                >
              {/if}
              {#if isSelectedDate(date) && !isToday(date)}
                <span class="text-xs text-thw-500 bg-white px-1 rounded hidden sm:inline"
                  >Ausgewählt</span
                >
              {/if}
            </div>

            <div class="space-y-0.5 overflow-y-auto max-h-[calc(100%-20px)]">
              {#each getEventsForDay(date) as event}
                {@const isFirst = isFirstDayOfEvent(event, date)}
                <button
                  class="w-full text-left text-xs p-1 rounded-sm flex items-center gap-0.5 transition-opacity hover:opacity-90"
                  style="background-color: {event.color || '#005b99'}; color: white;"
                  on:click|stopPropagation={() => handleEventClick(event)}
                  title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                >
                  {#if !isFirst}
                    <span class="text-xs">↪</span>
                  {/if}
                  <span class="truncate flex-1 {isFirst ? '' : 'pl-0.5'}">
                    {isMobile && event.title.length > 8
                      ? event.title.substring(0, 8) + '...'
                      : event.title}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Week View - Vertical on mobile, horizontal on desktop -->
      {#if isMobile}
        <!-- Mobile vertical layout - modernized -->
        <div class="space-y-3">
          {#each weekDays as day}
            <div
              class="border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer
              {isToday(day) ? 'border-thw-300' : isSelectedDate(day) ? 'border-thw-500' : ''}"
              on:click={() => handleDayClick(day)}
            >
              <!-- Day header -->
              <div
                class="flex justify-between items-center p-2
                {isToday(day)
                  ? 'bg-thw-200 shadow-inner'
                  : isSelectedDate(day)
                    ? 'bg-thw-100'
                    : 'bg-gray-50'}"
              >
                <div class="flex items-center gap-2">
                  <div class="flex flex-col">
                    <span class="text-xs font-medium text-gray-600">
                      {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                    </span>
                    <span
                      class="text-base font-bold
                      {isToday(day)
                        ? 'text-thw-800'
                        : isSelectedDate(day)
                          ? 'text-thw-600'
                          : 'text-gray-800'}"
                    >
                      {day.getDate()}.{day.getMonth() + 1}.
                    </span>
                  </div>
                </div>
                {#if isToday(day)}
                  <span
                    class="text-xs font-medium text-thw-700 bg-white px-2 py-0.5 rounded-full shadow-sm"
                  >
                    Heute
                  </span>
                {/if}
                {#if isSelectedDate(day) && !isToday(day)}
                  <span
                    class="text-xs font-medium text-thw-500 bg-white px-2 py-0.5 rounded-full shadow-sm"
                  >
                    Ausgewählt
                  </span>
                {/if}
              </div>

              <!-- Day events -->
              <div class="p-2 {getEventsForDay(day).length > 0 ? 'space-y-2' : ''}">
                {#if getEventsForDay(day).length === 0}
                  <div class="text-xs text-gray-500 text-center py-2">Keine Reservierungen</div>
                {:else}
                  {#each getEventsForDay(day) as event}
                    {@const isFirst = isFirstDayOfEvent(event, day)}
                    <button
                      class="w-full text-left p-2 rounded-md flex items-center gap-1 shadow-sm transition-opacity hover:opacity-90"
                      style="background-color: {event.color || '#005b99'}; color: white;"
                      on:click|stopPropagation={() => handleEventClick(event)}
                      title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                    >
                      {#if !isFirst}
                        <span class="text-sm mr-1 opacity-80">↪</span>
                      {/if}
                      <div class="flex-1">
                        <div class="font-medium">
                          {event.title}
                        </div>
                        {#if isFirst}
                          <div class="text-xs mt-0.5 opacity-80">
                            {formatTime(new Date(event.start))}
                          </div>
                        {/if}
                      </div>
                    </button>
                  {/each}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Desktop horizontal layout - modernized -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-3">
          {#each weekDays as day}
            <div class="text-center flex flex-col items-center">
              <div class="text-xs sm:text-sm font-medium text-thw-600 mb-0.5">
                {day.toLocaleDateString('de-DE', { weekday: 'short' })}
              </div>
              <div
                class="text-sm sm:text-base font-bold mb-1 w-8 h-8 flex items-center justify-center rounded-full
                {isToday(day)
                  ? 'bg-thw-700 text-white shadow-md'
                  : isSelectedDate(day)
                    ? 'bg-thw-500 text-white shadow-sm'
                    : 'text-gray-700'}"
              >
                {day.getDate()}
              </div>
            </div>
          {/each}
        </div>

        <div class="grid grid-cols-7 gap-1 sm:gap-2">
          {#each weekDays as day}
            <div
              class="{getWeekCellHeight(
                day
              )} p-1 sm:p-2 border rounded-md hover:border-thw-300 transition-colors cursor-pointer
              {isToday(day)
                ? 'bg-thw-100 border-thw-500 shadow-md'
                : isSelectedDate(day)
                  ? 'bg-thw-100 border-thw-500 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50'}"
              on:click={() => handleDayClick(day)}
            >
              <div class="space-y-1 overflow-y-auto h-full">
                {#each getEventsForDay(day) as event}
                  {@const isFirst = isFirstDayOfEvent(event, day)}
                  <button
                    class="w-full text-left text-xs p-1.5 sm:p-2 rounded-md flex items-center shadow-sm transition-opacity hover:opacity-90"
                    style="background-color: {event.color || '#005b99'}; color: white;"
                    on:click|stopPropagation={() => handleEventClick(event)}
                    title={`${event.title} (${new Date(event.start).toLocaleDateString('de-DE')} - ${new Date(event.end).toLocaleDateString('de-DE')})`}
                  >
                    {#if !isFirst}
                      <span class="mr-1 opacity-80">↪</span>
                    {/if}
                    <span class="flex-1 truncate {isFirst ? '' : 'pl-0.5'}">
                      {event.title}
                    </span>
                    {#if isFirst}
                      <span
                        class="text-xs bg-black bg-opacity-20 rounded px-1 whitespace-nowrap ml-1"
                      >
                        {formatTime(new Date(event.start))}
                      </span>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
