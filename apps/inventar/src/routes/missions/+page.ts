import type { PageLoad } from './$types';

// TODO: Replace with a real API client
async function getMissions() {
  // This is a mock implementation. In a real scenario, this would
  // be an API call handled by the missions.service.ts
  return [
    { id: '1', name: 'Hochwasser Elbe 2025', location: 'Magdeburg', status: 'ACTIVE', startDate: new Date() },
    { id: '2', name: 'Sturmschaden Beseitigung', location: 'Düsseldorf', status: 'ACTIVE', startDate: new Date('2025-08-24') },
    { id: '3', name: 'Übung OV-Stab', location: 'Düsseldorf', status: 'COMPLETED', startDate: new Date('2025-08-20') },
  ];
}

export const load: PageLoad = async () => {
  // In the future, we will call missionsService.getAllMissions() here
  const missions = await getMissions();
  return {
    missions,
  };
};
