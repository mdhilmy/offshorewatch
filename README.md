# OffshoreWatch

**Global Offshore Operations Weather & Safety Planning Platform**

A comprehensive, browser-based weather and safety planning platform designed for petroleum engineers, offshore operations planners, HSE managers, marine coordinators, and logistics personnel operating in the global offshore oil and gas industry.

**Currently in Improvement Phase**
- APIs error handling
- Data correctness

## Features

- **Real-time Weather Forecasts**: 7-day marine and atmospheric forecasts using Open-Meteo API
- **Storm Tracking**: Active tropical cyclone monitoring from NOAA NHC
- **Seismic Monitoring**: Real-time earthquake data from USGS
- **Global Coverage**: Seven major offshore producing regions
- **Offline-First**: IndexedDB caching for offline functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router (HashRouter for GitHub Pages)
- **Styling**: Tailwind CSS (light theme)
- **State Management**: React Context + useReducer
- **Mapping**: Leaflet + React-Leaflet (ready for implementation)
- **Charts**: Chart.js + react-chartjs-2 (ready for implementation)
- **Offline Storage**: Dexie.js (IndexedDB wrapper)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server will start at `http://localhost:5173/offshorewatch/`

## Project Structure

```
offshorewatch/
├── src/
│   ├── components/
│   │   ├── common/          # Shared UI components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── weather/         # Weather components (to be expanded)
│   │   ├── map/             # Map components (to be expanded)
│   │   └── ...              # Other feature components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React Context providers
│   ├── services/            # API services
│   │   └── api/             # API integrations
│   ├── utils/               # Utility functions
│   └── styles/              # CSS files
├── public/                  # Static assets
└── dist/                    # Production build output
```

## Supported Regions

1. **Gulf of Mexico** (USA)
2. **North Sea** (UK/Norway)
3. **Southeast Asia** (Malaysia/Indonesia)
4. **Brazil Pre-salt**
5. **West Africa** (Nigeria/Angola/Ghana)
6. **Australia** (NWS/Bass Strait)
7. **Middle East** (Persian Gulf)

## Data Sources

- **Weather**: [Open-Meteo API](https://open-meteo.com/) (Free, no authentication)
- **Tropical Storms**: [NOAA NHC](https://www.nhc.noaa.gov/) (Free)
- **Earthquakes**: [USGS Earthquake API](https://earthquake.usgs.gov/) (Free)
- **Buoys**: [NOAA NDBC](https://www.ndbc.noaa.gov/) (Free)

## Key Features Implemented

### Phase 1 (Core Infrastructure)
- ✅ Project setup with Vite + React
- ✅ Tailwind CSS configuration
- ✅ HashRouter for GitHub Pages
- ✅ Context providers (App, Settings, Notification)
- ✅ Dexie.js caching service
- ✅ API services (Open-Meteo, USGS, NHC)
- ✅ Custom hooks for data fetching
- ✅ Common UI components
- ✅ Layout components (Header, Sidebar)
- ✅ All page components with placeholders
- ✅ Error boundaries and error handling

### Phase 2 (Expanded)
- 🔲 Interactive Leaflet maps
- 🔲 Weather charts and visualizations
- 🔲 Operations planning calculator
- 🔲 Advanced storm tracking
- 🔲 Buoy data integration
- 🔲 Report generation
- 🔲 Settings panel

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for detailed development context and guidelines.

See [PRD.md](./PRD.md) for complete product requirements.

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for step-by-step development instructions.

## Deployment

### GitHub Pages

1. Update the `base` path in `vite.config.js` to match your repository name
2. Push to your GitHub repository
3. Enable GitHub Pages in repository settings
4. The app will be available at `https://yourusername.github.io/your-repo-name/`

### Build

```bash
npm run build
```

The production build will be created in the `dist/` directory.

## License

This project is for educational and demonstration purposes.

## Acknowledgments

- Weather data from Open-Meteo
- Storm data from NOAA National Hurricane Center
- Seismic data from USGS
- Built with React and Vite
- Styled with Tailwind CSS
- Icons from Lucide React

---

**Version**: 1.1.0
**Last Updated**: January 2026
