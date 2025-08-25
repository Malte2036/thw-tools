import type { PageLoad } from './$types';

// TODO: Replace with a real API client
async function getMissionDetails(id: string) {
  // This is a mock implementation. In a real scenario, this would
  // be an API call handled by the missions.service.ts
  console.log(`Fetching details for mission ${id}`);
  
  // Mock data for demonstration
  return {
    id: id,
    name: 'Hochwasser Elbe 2025',
    location: 'Magdeburg',
    description: 'Deichverteidigung und Pumparbeiten im Stadtgebiet.',
    status: 'ACTIVE',
    startDate: new Date(),
    materials: [
      { id: 'mat1', inventoryItem: { ausstattung: 'Pumpe "Mast TP 8-1"' }, status: 'CHECKED_OUT', checkedOutAt: new Date() },
      { id: 'mat2', inventoryItem: { ausstattung: 'Stromerzeuger 20kVA' }, status: 'CHECKED_OUT', checkedOutAt: new Date() },
      { id: 'mat3', manualName: 'Sandsäcke', manualQuantity: 200, manualUnit: 'Stk', status: 'CHECKED_OUT', checkedOutAt: new Date() },
      { id: 'mat4', inventoryItem: { ausstattung: 'Kettensäge Stihl' }, status: 'RETURNED', checkedOutAt: new Date('2025-08-25T10:00:00Z'), returnedAt: new Date('2025-08-25T14:00:00Z') },
    ]
  };
}

export const load: PageLoad = async ({ params }) => {
  // In the future, we will call missionsService.getMissionById(params.id) here
  const mission = await getMissionDetails(params.id);
  return {
    mission,
  };
};
