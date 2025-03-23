declare global {
  // eslint-disable-next-line no-var
  var umami: any;
}

/**
 * Track an event in Umami analytics
 */
export async function trackEvent(dataUmamiEvent: string | undefined): Promise<void> {
  if (!dataUmamiEvent) return;

  try {
    await umami.track(dataUmamiEvent);
  } catch (error) {
    console.warn(`Failed to track event "${dataUmamiEvent}"`);
  }
}

/**
 * Track user identity in Umami analytics
 */
export async function trackIdentity(build: string): Promise<void> {
  try {
    await umami.identify({
      build,
    });
  } catch (error) {
    console.warn(`Failed to track event "Identity"`);
  }
}
