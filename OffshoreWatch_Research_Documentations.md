# Comprehensive Technical Reference for Offshore Weather & Safety Planning Platforms

Building a global offshore operations weather platform requires integrating data from **7 major producing regions**, accessing **30+ free and freemium APIs**, and implementing safety thresholds that govern $500,000/day drilling operations. This reference consolidates the authoritative sources, exact API endpoints, and operational limits needed to design such a system. The economic stakes are substantial: weather-related downtime costs the offshore industry **$38-149 million per site annually**, while accurate forecasting and digital monitoring can reduce unplanned downtime by 30-50%.

---

## Global offshore regions span 20 million barrels daily

The world's offshore oil and gas production concentrates in seven major regions, each with distinct weather challenges and infrastructure requirements. The **Persian Gulf** dominates with 20 million b/d flowing through the Strait of Hormuz, while the **Gulf of Mexico** contributes 1.8-1.9 million b/d from approximately **2,227 active leases**. Brazil's pre-salt basins now produce 3.4-4.0 million boe/d from **30+ FPSOs**, with Petrobras operating 89-98% of production.

**Gulf of Mexico (USA)** spans 26°N-29°N, 87°W-97°W with deepwater operations exceeding 5,000 ft. The Loop Current—200-300 km wide and 800m deep—provides warm water that fuels rapid hurricane intensification, as demonstrated when Hurricane Milton (2024) became the fastest-intensifying storm on record. Major operators include Chevron, Shell, BP, and ExxonMobil operating fields like Mars-Ursa, Thunder Horse, and Whale.

**North Sea (UK/Norway)** extends from 56°N-71°N, covering the Norwegian Continental Shelf's 97 producing fields. Norway's Johan Sverdrup field alone produces 712,000-755,000 b/d (40% of Norwegian crude). Winter storms routinely generate **4+ meter waves**, with operations frequently halted. Equinor operates approximately 70% of Norwegian production.

**Southeast Asia** produces ~4.86 million boe/d across the Malay Basin (5°N-8°N, 100°E-105°E), Kutai Basin (Indonesia), and Nam Con Son Basin (Vietnam). The region faces dual monsoon seasons and a May-December typhoon window. Over **$100 billion in offshore gas investments** are planned for 2024-2028.

**Brazil's pre-salt fields** in the Santos Basin (23°S-28°S) operate at depths of 5,000-11,500 ft beneath 1.6 km of salt. The Búzios field targets 1.5 million b/d by 2030 using FPSOs like Almirante Tamandaré (225,000 b/d capacity). South Atlantic swells affect operations, though conditions are generally more favorable than the hurricane-prone Gulf of Mexico.

**West Africa (Nigeria, Angola, Ghana)** produces approximately 2.5 million b/d with relatively calm Gulf of Guinea conditions. Ghana's Jubilee and TEN fields produced 24.86 million barrels in H1 2024. Long-period swells from the South Atlantic affect FPSO mooring and offloading operations.

**Australia's Northwest Shelf** (19°S-22°S, 114°E-117°E) faces Category 4-5 cyclones from November through April. The Bass Strait region supplies 40% of Australia's east coast domestic gas demand. Woodside operates the major Northwest Shelf facilities including Goodwyn A and North Rankin A.

**The Middle East Persian Gulf** (24°N-30°N, 48°E-56°E) contains the world's largest offshore fields: Safaniya (1.3 million b/d capacity), Upper Zakum (~50 billion barrels in place), and the shared North Field/South Pars gas complex. **Shamal winds** reaching 50+ knots and extreme heat (45-50°C) pose the primary weather challenges. Saudi Aramco, ADNOC, and QatarEnergy dominate operations.

| Region | Daily Production | Platform Count | Primary Weather Challenge |
|--------|-----------------|----------------|--------------------------|
| Gulf of Mexico | 1.8-1.9M b/d | ~2,227 leases | Hurricanes, Loop Current |
| North Sea | ~3M boe/d | 97+ fields (Norway) | Winter storms, 4m+ waves |
| Southeast Asia | ~4.86M boe/d | Major expansion underway | Monsoons, typhoons |
| Brazil Pre-salt | 3.4-4.0M boe/d | 30+ FPSOs | South Atlantic swells |
| West Africa | ~2.5M b/d | 47+ offshore rigs | Generally calm; swells |
| Australia | Major LNG exports | 23+ (Bass Strait) | Cyclones (NWS region) |
| Middle East | 20M b/d (Hormuz) | ~2,000 installations | Shamal winds, extreme heat |

---

## Free public APIs provide marine weather without authentication

Several government and open-source APIs deliver marine weather, earthquake, and ocean data without requiring API keys or authentication.

### Open-Meteo Marine API delivers global wave forecasts

The most comprehensive free marine weather source, **Open-Meteo** (https://open-meteo.com/en/docs/marine-weather-api), provides wave height, swell data, sea surface temperature, and ocean currents with **10,000 requests/day** for non-commercial use.

**Base URL:** `https://marine-api.open-meteo.com/v1/marine`

**Example request:**
```
https://marine-api.open-meteo.com/v1/marine?latitude=27.5&longitude=-90.5&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,wind_wave_height,sea_surface_temperature,ocean_current_velocity,ocean_current_direction
```

**Response structure:**
```json
{
  "latitude": 27.5,
  "longitude": -90.5,
  "hourly": {
    "time": ["2026-02-01T00:00", "2026-02-01T01:00"],
    "wave_height": [1.5, 1.7],
    "swell_wave_height": [1.2, 1.3],
    "sea_surface_temperature": [22.5, 22.4]
  },
  "hourly_units": {"wave_height": "m", "sea_surface_temperature": "°C"}
}
```

Data sources include MeteoFrance MFWAM (~8 km resolution, 12-hour updates), ECMWF WAM (9 km, 6-hour updates), and NCEP GFS Wave (~25 km, 6-hour updates). Forecasts extend to **16 days**.

### NOAA CO-OPS provides US tides and currents

The **NOAA Center for Operational Oceanographic Products and Services** (https://tidesandcurrents.noaa.gov/web_services_info.html) offers comprehensive tide predictions, water levels, and current measurements for US coastal waters.

**Base URL:** `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`

**Tide predictions:**
```
https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20260201&end_date=20260202&station=8775870&product=predictions&datum=MLLW&units=metric&time_zone=gmt&format=json
```

**Current measurements:**
```
https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20260201&end_date=20260202&station=cb1401&product=currents&bin=1&units=metric&time_zone=gmt&format=json
```

Available products include water_level, hourly_height, high_low, predictions, currents, currents_predictions, air_temperature, water_temperature, wind, air_pressure, visibility, and salinity. Data length limits vary: 4 days for 1-minute intervals, 1 month for 6-minute intervals, 1 year for hourly data.

### NOAA NDBC provides buoy observations globally

The **National Data Buoy Center** (https://www.ndbc.noaa.gov/) maintains 1,300+ stations providing real-time and historical marine observations.

**Realtime data (last 45 days):**
```
https://www.ndbc.noaa.gov/data/realtime2/{STATION_ID}.txt
https://www.ndbc.noaa.gov/data/realtime2/{STATION_ID}.spec
https://www.ndbc.noaa.gov/data/realtime2/{STATION_ID}.ocean
```

**Historical archives:**
```
https://www.ndbc.noaa.gov/data/historical/stdmet/{STATION_ID}h{YEAR}.txt.gz
```

Standard meteorological files include wind direction/speed/gusts (WDIR, WSPD, GST), wave height/period (WVHT, DPD, APD), pressure (PRES), air/water temperature (ATMP, WTMP), and visibility. Station metadata available at: `https://www.ndbc.noaa.gov/data/stations/station_table.txt`

### USGS Earthquake API monitors seismic activity

The **USGS Earthquake Hazards Program** (https://earthquake.usgs.gov/fdsnws/event/1/) provides real-time global earthquake data updated every minute.

**GeoJSON feeds (no authentication):**
```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
```

**Custom queries:**
```
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-01-01&minmagnitude=4.5&latitude=27.5&longitude=-90.5&maxradiuskm=500
```

Response includes magnitude, location, depth, time, tsunami flag, and alert level. Maximum 20,000 results per query.

---

## Hurricane tracking APIs cover all ocean basins

Tropical cyclone tracking requires basin-specific data sources with varying formats and update frequencies.

### NOAA NHC provides Atlantic and Eastern Pacific data

The **National Hurricane Center** (https://www.nhc.noaa.gov/gis/) offers the most comprehensive hurricane tracking API via ArcGIS REST services.

**MapServer base URL:**
```
https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer
```

**Key layers for querying:**
- Layer 6: Forecast Points (position + 120hr forecast)
- Layer 7: Forecast Track (line geometry)
- Layer 8: Forecast Cone (uncertainty polygon)
- Layer 9: Watch/Warning zones
- Layers 11-14: Past Track, Wind Swath, Wind Radii
- Layer 16: Forecast Wind Radii (34, 50, 64kt)

**Example forecast track query:**
```
https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/7/query?where=1%3D1&outFields=*&f=geojson
```

**ATCF data files** (Automated Tropical Cyclone Forecasting):
- Forecasts: `ftp://ftp.nhc.noaa.gov/atcf/aid_public/`
- Best track: `ftp://ftp.nhc.noaa.gov/atcf/btk/`

ATCF format includes wind radii for 34kt, 50kt, and 64kt winds in four quadrants (NE, SE, SW, NW in nautical miles). Updates occur every 6 hours (00, 06, 12, 18 UTC), increasing to every 3 hours when systems threaten land.

### Western Pacific and South China Sea sources

**Japan Meteorological Agency** (https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/RSMC_HP.htm) provides official typhoon best track data from 1951-present. Real-time tracking: https://www.data.jma.go.jp/multi/cyclone/index.html

**Joint Typhoon Warning Center** (https://www.metoc.navy.mil/jtwc/jtwc.html) covers Western North Pacific, North Indian Ocean, and Southern Hemisphere. JTWC uses 1-minute sustained winds (unlike WMO's 10-minute standard), requiring conversion factor of approximately 1.14.

### Indian Ocean and Australian cyclone data

**India Meteorological Department RSMC New Delhi** (https://rsmcnewdelhi.imd.gov.in/) provides North Indian Ocean coverage. API access available through APISetu: https://directory.apisetu.gov.in/api-collection/mausam

**Bureau of Meteorology Australia** (https://www.bom.gov.au/cyclone/) covers the Australian region with FTP access at `ftp://ftp.bom.gov.au/anon/gen/`. Historical database available at https://www.bom.gov.au/cyclone/tropical-cyclone-knowledge-centre/databases/

### IBTrACS provides unified global historical data

The **International Best Track Archive** (https://www.ncei.noaa.gov/products/international-best-track-archive) unifies data from all agencies in standardized formats.

**Data access:**
```
https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/
https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/shapefile/
```

Updates occur 3x weekly (Sunday, Tuesday, Thursday). Available subsets include ALL, since1980, last3years, active (last 7 days), and basin-specific (NA, EP, WP, NI, SI, SP).

---

## Authenticated APIs offer enhanced capabilities with free tiers

Several commercial services provide free tiers suitable for development and moderate-scale production use.

### Mapping providers with generous free tiers

**Mapbox** (https://www.mapbox.com/pricing) offers **50,000 map loads/month free**, 200,000 vector tile requests, and 100,000 geocoding requests. Authentication via access token (API key). Best developer experience with custom styling capabilities.

**Google Maps Platform** (https://mapsplatform.google.com/pricing/) provides approximately **28,500 dynamic map loads/month free** (varies by SKU), plus 10,000 geocoding requests. Requires billing account even for free tier.

**ArcGIS/Esri** (https://developers.arcgis.com/pricing/) Essentials Plan includes **2M basemap tiles/month** (or 15K sessions), 20,000 geocoding requests, and 20,000 routing requests free. Strong GIS capabilities for spatial analysis.

**MapLibre GL JS** (https://maplibre.org/) is fully open-source (BSD license) with unlimited use. Requires separate tile source—can use free OpenStreetMap tiles or paid providers.

### Premium weather APIs with free access

**Open-Meteo** (https://open-meteo.com/en/pricing) is free for non-commercial use with no API key required. Commercial plans start at €29/month for millions of calls. Marine API includes wave forecasts, swell data, SST, and ocean currents.

**OpenWeatherMap** (https://openweathermap.org/api) provides **1,000,000 calls/month** with 60 calls/minute rate limit. Includes current weather and 5-day/3-hour forecasts. Professional features require paid plans from $40/month.

**Tomorrow.io** (https://docs.tomorrow.io/reference/welcome) offers **500 API calls/day** (25/hour, 3/second) with access to 80+ weather parameters including maritime data.

**Visual Crossing** (https://www.visualcrossing.com/weather-data-editions/) allows **1,000 records/day** with commercial use permitted (attribution required). Includes 50+ years historical data and 15-day forecasts.

**Stormglass** (https://stormglass.io/) provides specialized marine weather with **10 requests/day** on free tier—useful for development but limited for production.

### Marine traffic and infrastructure data

**MarineTraffic** (https://www.marinetraffic.com/en/online-services/plans/comparison-list) has no free API tier—basic web access is free, but API requires commercial licensing. Credit-based pricing for vessel positions, historical tracks, and port calls.

**OGIM Database** (https://developers.google.com/earth-engine/datasets/catalog/EDF_OGIM_current) provides free global infrastructure data via Google Earth Engine with **6.7 million features** including 4.5 million wells, 1.2 million km pipelines, and offshore platforms. Creative Commons Attribution 4.0 license.

---

## Regional infrastructure databases provide platform locations

Government agencies maintain authoritative databases of offshore installations, wells, and production data.

### BOEM provides comprehensive US Gulf of Mexico data

The **Bureau of Ocean Energy Management** (https://www.data.boem.gov/) offers free access to platform locations, well data, lease blocks, pipelines, and production statistics.

**Key data URLs:**
- Platforms: https://www.data.boem.gov/Main/Platform.aspx
- Wells: https://www.data.boem.gov/Main/Well.aspx
- Production: https://www.data.boem.gov/Main/Production.aspx
- GIS/Mapping: https://www.data.boem.gov/main/mapping.aspx

Formats include ASCII (CSV/text), Access databases (.mdb), Excel, and Shapefiles. Coordinates use NAD 27 datum. Production data updates monthly; structure data updates continuously.

### Norwegian Petroleum Directorate offers API access

**FactPages** (https://factpages.sodir.no/) and **FactMaps** (https://factmaps.sodir.no/map) provide Norway's offshore data with daily synchronization.

**Direct shapefile downloads:**
```
https://factpages.sodir.no/downloads/shape/wlbPoint.zip (wellbores)
https://factpages.sodir.no/downloads/shape/fldArea.zip (fields)
https://factpages.sodir.no/downloads/shape/fclPoint.zip (facilities)
https://factpages.sodir.no/downloads/shape/pipLine.zip (pipelines)
```

**REST API:**
```
https://factmaps.sodir.no/api/rest/services/Factmaps/
```

**WFS services:**
```
https://factmaps.sodir.no/api/services/Factmaps/FactMapsWGS84/MapServer/WFSServer
```

Licensed under Norwegian Licence for Open Government Data (NLOD) 2.0.

### UK NSTA provides open data portal

**North Sea Transition Authority** (https://open-data-ukcs-transition.hub.arcgis.com/) offers shapefiles, CSV, and GeoJSON via ArcGIS services. Well data released 4 years in arrears. Licensed under Open Government Licence (OGL).

### Brazil ANP requires registration for detailed data

**Agência Nacional do Petróleo** (https://www.gov.br/anp/) provides monthly production bulletins and well data subject to confidentiality periods. REATE program offers free onshore data; PROMAR provides partial offshore access. Technical data access: https://www.gov.br/anp/pt-br/assuntos/exploracao-e-producao-de-oleo-e-gas/dados-tecnicos/acesso-aos-dados-tecnicos

### Australia NOPTA manages offshore data release

**NOPIMS** (https://public.neats.nopta.gov.au/nopims) provides well completion reports, logs, and spatial data. As of November 2025, new seismic and geophysical data requires Commonwealth Minister approval before release.

---

## Operational weather thresholds govern offshore activities

Weather limits vary by operation type, with helicopter operations, crane lifts, diving, and personnel transfer each having specific thresholds.

### Helicopter operations require visibility and wind limits

**General operational limits:**
- Planned shutdown/startup: **35 knots** maximum wind
- Rotorcraft Flight Manual limit: **55 knots** (±45° of nose)
- VFR visibility: **3 miles minimum (day)**, 5 miles (night)
- Cloud ceiling: **1,000+ feet** (varies by procedure)

**CAP 437** (UK CAA, Edition 9, February 2023) establishes international helideck standards requiring meteorological monitoring including wind speed/direction, temperature, pressure, visibility, and cloud base. Moving helidecks require Helideck Monitoring Systems (HMS) with pitch, roll, inclination, and heave rate data.

### Crane operations halt at moderate wind speeds

**Standard thresholds:**
- General operational limit: **17-20 knots** (20 mph)
- Tower crane warning: **33 knots** (38 mph)
- Tower crane stop operations: **39 knots** (45 mph)
- ISO 4302:2016 maximum: **39 knots** (20 m/s)

Wind is the second most common cause of crane accidents globally. Anemometers must be positioned at crane level—ground measurements are inadequate. Side winds pose greater risk than head-on winds.

### Diving operations depend on sea state

**IMCA D014 Rev 3.1** (International Marine Contractors Association, August 2023) provides the primary international standard.

**Typical limits:**
- Sea state: Douglas Scale 3-4 (0.5-2.5m significant wave height)
- Current speed: typically <1.5 knots for surface-oriented diving
- Wind: Beaufort 4-5 maximum (11-21 knots)

Project-specific weather limits must be defined in diving project plans. Dive supervisors have authority to terminate operations for deteriorating weather.

### Rig moves require weather windows

**Typical thresholds:**
- Wind speed: **15 knots** maximum for field tows
- Wave height: **1.2m (4 ft)** maximum
- Weather window: **12-72 hours** favorable forecast required

IMO Guidelines for Safe Ocean Towing require weather forecasts at least every 24 hours during towage. Route and site-specific forecasting is essential, with contingency plans addressing worsening conditions.

### Personnel transfer limits vary by method

| Transfer Method | Wave Height Limit | Wind Limit |
|----------------|-------------------|------------|
| CTV boat landing | 1.5-2.0m Hs | 20-25 knots |
| W2W gangway (standard) | up to 3.0m Hs | 35-40 knots |
| W2W gangway (Arctic) | up to 4.0m Hs | 38 knots |

Walk-to-work gangways use motion compensation and DP2 vessel capability. Automatic fail-safe functions including alarms, auto-disconnect, and emergency stop are required.

---

## Technical implementation requires specialized libraries

Building an offshore weather platform requires mapping libraries, weather visualization tools, offline caching, and real-time data handling.

### Mapping libraries for marine visualization

**MapLibre GL JS** (https://github.com/maplibre/maplibre-gl-js) provides WebGL-powered vector tile rendering with smooth animations and 3D terrain. Bundle size approximately 250 KB. Open-source fork of Mapbox GL JS.

**Leaflet** (https://github.com/Leaflet/Leaflet) offers a lightweight alternative (~42 KB) with extensive plugin ecosystem. Simpler API suited for standard 2D mapping.

**deck.gl** (https://github.com/visgl/deck.gl) enables GPU-powered visualization of large datasets with 64-bit precision. Integrates with MapLibre/Mapbox for overlaying complex data layers.

**CesiumJS** (https://github.com/CesiumGS/cesium) provides 3D globe visualization with time-dynamic simulation capabilities. Bundle size 3+ MB but supports CZML for time-series data and includes ocean water effects.

### Weather visualization for wind and currents

**leaflet-velocity** (https://github.com/onaci/leaflet-velocity) renders animated particle flows for wind and ocean currents. Accepts grib2json output format. Configurable for knots, m/s, or km/h display.

```javascript
const velocityLayer = L.velocityLayer({
  displayValues: true,
  displayOptions: {
    velocityType: 'Ocean Current',
    speedUnit: 'kt'
  },
  data: currentData,
  maxVelocity: 5,
  velocityScale: 0.005
});
```

**Turf.js** (https://github.com/Turfjs/turf) provides geospatial analysis including distance calculations, buffer zones, point-in-polygon checks, and bearing calculations—essential for safety zone computations.

### Offline caching with Service Workers and IndexedDB

**Workbox** (https://developer.chrome.com/docs/workbox/) provides service worker strategies optimized for different data types:

```javascript
// Cache map tiles with CacheFirst strategy
registerRoute(
  ({url}) => url.origin.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 })]
  })
);

// Weather data with StaleWhileRevalidate
registerRoute(
  ({url}) => url.pathname.includes('/api/weather'),
  new StaleWhileRevalidate({
    cacheName: 'weather-data',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 15 * 60 })]
  })
);
```

**Dexie.js** (https://github.com/dexie/Dexie.js) wraps IndexedDB with a Promise-based API for storing weather data, vessel positions, and cached forecasts locally.

### Real-time polling intervals for weather data

Optimal polling frequencies balance data freshness against rate limits:
- **Forecasts:** 15-60 minutes (aligned with model update cycles)
- **Current conditions:** 5-15 minutes
- **Severe weather alerts:** 1-5 minutes
- **Vessel tracking:** 30 seconds - 2 minutes

Implement exponential backoff for error handling and cache responses aggressively with stale-while-revalidate patterns.

---

## Weather-related downtime costs $38-149 million annually per site

Industry statistics quantify the economic and safety impacts driving investment in weather monitoring systems.

### Economic losses from weather disruptions

**Unplanned downtime** costs the average offshore organization **$38 million annually** based on 27 days of downtime (GE/Kimberlite Study). When oil prices spiked to $120/barrel in 2021-22, these costs surged 76% to **$149 million per site** (Innovapptive, 2024).

**Daily rig rates** for ultra-deepwater drillships reached **$500,000/day** in 2024, with 15% ROI requirements pushing newbuild dayrates toward $650,000-700,000/day. Even modest weather delays cascade into significant costs.

**Hurricane production impacts** demonstrate weather vulnerability:
- Hurricanes Katrina & Rita (2005): 162 million bbl oil lost, 115 platforms destroyed
- Hurricane Ida (2021): 96% crude and 94% gas production shut-in
- Hurricane Laura (2020): 14.4 million barrels lost over 15 days

### Safety incidents highlight weather risks

**IOGP global statistics (2024)** report 32 fatalities and a Fatal Accident Rate of 0.77 per 100 million work hours. Of 946 lost work day cases, 46% occurred offshore. Slips and trips—often exacerbated by wet conditions—account for 22% of incidents.

**UK North Sea** achieved 5 consecutive years without a work-related fatality, with 64 reportable injuries in 2021. Lost Time Injury frequency of 0.79 per million hours outperformed Norway's 0.91.

**Transportation accidents** account for 51% of offshore oil operation fatalities (CDC), with many caused by adverse weather affecting helicopter and vessel operations.

### ROI of digital weather monitoring

**McKinsey research** finds improving production efficiency by 10 percentage points yields **$220-260 million bottom-line impact** on a single brownfield asset. Companies using advanced analytics captured additional value of **$5 per barrel of oil equivalent**.

**Predictive maintenance** reduces unplanned downtime by **30-50%** and extends equipment life by 20-40%. Repsol achieved **$200 million in annual savings** through predictive maintenance implementation.

**Digital transformation** could generate **$250 billion in value by 2030** across the oil and gas industry. However, 70% of companies have not moved digital initiatives beyond pilot phase, indicating significant opportunity.

---

## Conclusion: Integrating authoritative data creates operational value

A comprehensive offshore weather platform must unify data from government regulators (BOEM, NSTA, NPD), meteorological services (NHC, Open-Meteo, NOAA), and industry standards (IMO, IMCA, CAP 437). The **Open-Meteo Marine API** stands out as the most accessible free source for global wave forecasts, while **NHC's ArcGIS services** provide authoritative hurricane tracking with forecast cones and wind radii.

The operational weather thresholds documented here—**35 knots for helicopter operations**, **17-20 knots for crane lifts**, **Douglas Sea State 3-4 for diving**—represent hard constraints that directly impact daily operations. Implementing these thresholds into decision-support systems, combined with accurate forecasting, can capture the documented **$220-260 million** efficiency gains while reducing the **$38-149 million** annual downtime costs that plague offshore operations.

Technical implementation should prioritize **MapLibre GL JS** for mapping, **Workbox** for offline caching, and **Dexie.js** for local data storage. Real-time data polling should respect the 15-60 minute update cycles of weather models while implementing aggressive caching to maintain functionality during connectivity interruptions common in offshore environments.