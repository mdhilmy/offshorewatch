// Sample platform data for each region
// In production, this would come from BOEM/NPD APIs or static JSON files
export const PLATFORMS = {
  gom: [
    { id: 'gom-001', name: 'Thunder Horse', lat: 28.19, lon: -88.50, type: 'production', operator: 'BP' },
    { id: 'gom-002', name: 'Mad Dog', lat: 27.20, lon: -90.30, type: 'production', operator: 'BP' },
    { id: 'gom-003', name: 'Atlantis', lat: 27.20, lon: -90.03, type: 'production', operator: 'BP' },
    { id: 'gom-004', name: 'Mars', lat: 28.17, lon: -89.35, type: 'production', operator: 'Shell' },
    { id: 'gom-005', name: 'Ursa', lat: 28.15, lon: -89.10, type: 'production', operator: 'Shell' },
    { id: 'gom-006', name: 'Perdido', lat: 26.13, lon: -94.90, type: 'production', operator: 'Shell' },
    { id: 'gom-007', name: 'Na Kika', lat: 27.40, lon: -89.70, type: 'production', operator: 'Shell' },
    { id: 'gom-008', name: 'Appomattox', lat: 28.35, lon: -88.48, type: 'production', operator: 'Shell' },
    { id: 'gom-009', name: 'Jack/St Malo', lat: 26.68, lon: -91.07, type: 'production', operator: 'Chevron' },
    { id: 'gom-010', name: 'Tahiti', lat: 27.27, lon: -91.93, type: 'production', operator: 'Chevron' },
  ],
  northsea: [
    { id: 'ns-001', name: 'Brent Charlie', lat: 61.05, lon: 1.72, type: 'production', operator: 'Shell' },
    { id: 'ns-002', name: 'Forties Alpha', lat: 57.72, lon: 0.95, type: 'production', operator: 'Apache' },
    { id: 'ns-003', name: 'Ekofisk', lat: 56.54, lon: 3.21, type: 'production', operator: 'ConocoPhillips' },
    { id: 'ns-004', name: 'Statfjord', lat: 61.25, lon: 1.82, type: 'production', operator: 'Equinor' },
    { id: 'ns-005', name: 'Troll A', lat: 60.64, lon: 3.73, type: 'production', operator: 'Equinor' },
    { id: 'ns-006', name: 'Gullfaks', lat: 61.17, lon: 2.18, type: 'production', operator: 'Equinor' },
  ],
  seasia: [
    { id: 'sea-001', name: 'Malikai', lat: 6.70, lon: 115.56, type: 'production', operator: 'Shell' },
    { id: 'sea-002', name: 'Gumusut-Kakap', lat: 5.37, lon: 116.15, type: 'production', operator: 'Shell' },
    { id: 'sea-003', name: 'Kikeh', lat: 6.33, lon: 114.28, type: 'production', operator: 'MISC' },
  ],
  brazil: [
    { id: 'brz-001', name: 'P-76 Buzios', lat: -24.2, lon: -42.0, type: 'production', operator: 'Petrobras' },
    { id: 'brz-002', name: 'P-70 Atapu', lat: -24.5, lon: -42.3, type: 'production', operator: 'Petrobras' },
    { id: 'brz-003', name: 'Tupi (Lula)', lat: -25.3, lon: -43.0, type: 'production', operator: 'Petrobras' },
  ],
  westafrica: [
    { id: 'waf-001', name: 'Bonga', lat: 4.56, lon: 4.64, type: 'production', operator: 'Shell' },
    { id: 'waf-002', name: 'Akpo', lat: 4.28, lon: 5.85, type: 'production', operator: 'TotalEnergies' },
    { id: 'waf-003', name: 'Egina', lat: 4.30, lon: 5.70, type: 'production', operator: 'TotalEnergies' },
  ],
  australia: [
    { id: 'aus-001', name: 'North West Shelf', lat: -19.59, lon: 116.14, type: 'production', operator: 'Woodside' },
    { id: 'aus-002', name: 'Gorgon', lat: -20.50, lon: 114.20, type: 'production', operator: 'Chevron' },
    { id: 'aus-003', name: 'Ichthys', lat: -13.88, lon: 124.80, type: 'production', operator: 'INPEX' },
  ],
  middleeast: [
    { id: 'me-001', name: 'Safaniya', lat: 28.80, lon: 49.00, type: 'production', operator: 'Saudi Aramco' },
    { id: 'me-002', name: 'Upper Zakum', lat: 24.85, lon: 53.58, type: 'production', operator: 'ADNOC' },
    { id: 'me-003', name: 'South Pars', lat: 26.50, lon: 52.50, type: 'production', operator: 'NIOC' },
  ],
};

export const BUOY_STATIONS = {
  gom: [
    { id: '42001', name: 'Mid Gulf', lat: 25.888, lon: -89.658 },
    { id: '42002', name: 'W Gulf', lat: 25.790, lon: -93.666 },
    { id: '42003', name: 'E Gulf', lat: 25.925, lon: -85.612 },
    { id: '42019', name: 'Freeport', lat: 27.913, lon: -95.352 },
    { id: '42020', name: 'Corpus Christi', lat: 26.966, lon: -96.694 },
    { id: '42035', name: 'Galveston', lat: 29.232, lon: -94.413 },
    { id: '42036', name: 'W Tampa', lat: 28.500, lon: -84.517 },
    { id: '42039', name: 'Pensacola', lat: 28.791, lon: -86.008 },
    { id: '42040', name: 'Luke Island', lat: 29.185, lon: -88.226 },
  ],
  northsea: [
    { id: '62105', name: 'K13 Platform', lat: 53.22, lon: 3.22 },
    { id: '62103', name: 'Euro Platform', lat: 51.99, lon: 3.28 },
  ],
  seasia: [],
  brazil: [],
  westafrica: [],
  australia: [],
  middleeast: [],
};

export const getPlatformsForRegion = (regionId) => PLATFORMS[regionId] || [];
export const getBuoyStationsForRegion = (regionId) => BUOY_STATIONS[regionId] || [];
