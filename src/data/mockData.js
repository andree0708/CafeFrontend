export const mockFarms = [
  {
    id: 1,
    name: 'Finca El Paraíso',
    location: 'Vereda La Esperanza',
    municipality: 'Salento',
    department: 'Quindío',
    hectares: 4.5,
    altitude: 1850,
    batchCount: 3,
  },
  {
    id: 2,
    name: 'Finca La Montaña',
    location: 'Vereda El Bosque',
    municipality: 'Pitalito',
    department: 'Huila',
    hectares: 7.2,
    altitude: 1650,
    batchCount: 2,
  },
  {
    id: 3,
    name: 'Finca Las Nubes',
    location: 'Vereda Aguas Claras',
    municipality: 'Jardín',
    department: 'Antioquia',
    hectares: 3.1,
    altitude: 2050,
    batchCount: 1,
  },
]

export const mockBatches = [
  {
    id: 1,
    code: 'LOT-2024-001',
    farmId: 1,
    farmName: 'Finca El Paraíso',
    harvestDate: '2024-06-15',
    processingMethod: 'Lavado',
    variety: 'Caturra',
    weight: 450,
    prediction: { status: 'DONE', predictedScore: 87.5, qualityCategory: 'SPECIALTY', confidenceLevel: 0.91 },
  },
  {
    id: 2,
    code: 'LOT-2024-002',
    farmId: 1,
    farmName: 'Finca El Paraíso',
    harvestDate: '2024-07-20',
    processingMethod: 'Natural',
    variety: 'Castillo',
    weight: 320,
    prediction: { status: 'DONE', predictedScore: 78.2, qualityCategory: 'PREMIUM', confidenceLevel: 0.85 },
  },
  {
    id: 3,
    code: 'LOT-2024-003',
    farmId: 2,
    farmName: 'Finca La Montaña',
    harvestDate: '2024-08-10',
    processingMethod: 'Honey',
    variety: 'Geisha',
    weight: 180,
    prediction: { status: 'DONE', predictedScore: 91.3, qualityCategory: 'SPECIALTY', confidenceLevel: 0.94 },
  },
  {
    id: 4,
    code: 'LOT-2024-004',
    farmId: 3,
    farmName: 'Finca Las Nubes',
    harvestDate: '2024-09-05',
    processingMethod: 'Lavado',
    variety: 'Colombia',
    weight: 560,
    prediction: { status: 'PENDING', predictedScore: null, qualityCategory: null, confidenceLevel: null },
  },
]

export const mockStats = {
  totalFarms: 3,
  totalBatches: 4,
  specialtyBatches: 2,
  avgScore: 85.7,
  pendingPredictions: 1,
}

export const mockChartData = [
  { month: 'Abr', score: 78 },
  { month: 'May', score: 82 },
  { month: 'Jun', score: 87.5 },
  { month: 'Jul', score: 78.2 },
  { month: 'Ago', score: 91.3 },
  { month: 'Sep', score: null },
]

// Admin mock data
export const mockAllProducers = [
  { id: 1, firstName: 'Carlos', lastName: 'Gómez', email: 'productor@cafeIA.com', farms: 3, batches: 6 },
  { id: 2, firstName: 'María', lastName: 'López', email: 'maria@finca.com', farms: 2, batches: 4 },
  { id: 3, firstName: 'Jorge', lastName: 'Herrera', email: 'jorge@cafe.com', farms: 1, batches: 2 },
  { id: 4, firstName: 'Ana', lastName: 'Martínez', email: 'ana@finca.com', farms: 4, batches: 9 },
]

export const mockAdminStats = {
  totalProducers: 4,
  totalFarms: 10,
  totalBatches: 21,
  totalPredictions: 18,
  specialtyPercentage: 42,
  avgScoreGlobal: 82.4,
}
