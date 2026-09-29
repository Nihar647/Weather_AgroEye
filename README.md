# 🌱 AgroEye • Precision Weather & Farm Calamity Radar

An independent, production-ready, deployable agricultural weather web application built to pair with the [AgroEye Precision Smart Farming Platform](https://agroeye-app.vercel.app).

---

## 🌟 Key Features

1. **🗺️ Interactive Google Maps Location Engine**:
   - High-resolution Google Maps **Satellite (Hybrid)** and **Google Map (Street View)** base layers.
   - **Iconic Red Teardrop Pin**: Draggable pin allows farmers to drag and position their exact farm plot.
   - **Click-to-Pin**: Tap or click anywhere on the map to set and update the farm location instantly.
   - **GPS "Locate My Farm"**: Instantly flies to the device's current GPS coordinates.
   - **Village/City Search**: Geocoding search supporting villages, tehsils, districts, and pin codes with auto-suggestions.
   - Farm boundary overlay with a **1 km threat radar perimeter**.

2. **🌾 Hyperlocal Agronomic Telemetry (100% Genuine Open-Meteo Feed)**:
   - Live ambient temperature & feels-like temperature.
   - Relative humidity and **Vapor Pressure Deficit (VPD in kPa)**.
   - Wind velocity (`km/h`), wind gusts, and compass heading (`N`, `SSW`, `ENE`).
   - Real-time Open-Meteo 7-day forecast with daily precipitation chance and temperature highs/lows.
   - **Chemical Spray Window Advisory**: Daily recommendations (Optimal / Caution / Do Not Spray) based on wind, rain, and temperature thresholds.

3. **🛡️ Reassuring Safe Status & Calamity Alerts**:
   - **No Threats State**: If no imminent disaster thresholds are breached, displays a prominent reassurance card: *"🛡️ No threats, farm is safe" / "🛡️ कोई खतरा नहीं, खेत सुरक्षित है"*.
   - **Severe Weather Calamity Alerts**: Detects flash floods, extreme squalls, cloudbursts, heatwaves, and foliar fungal pathogen conditions.
   - **⚡ Demo Farm**: One-click preview of severe calamity alerts and extreme weather conditions beside the Add Farm button.

4. **🧪 7-Day Chemical Spray Window Advisory**:
   - 🟢 **Optimal Window**: Wind < 15 km/h, Rain chance < 20%, Temp 18–30°C.
   - 🟡 **Caution**: Moderate wind or rain chance 20–40%.
   - 🔴 **Do Not Spray**: High rain (>40%), heavy winds (>25 km/h), or extreme heat.

5. **🌐 Full Bilingual Support (English & Hindi / हिंदी)**:
   - One-tap language toggle in the header with complete translations for all agricultural terms, precautions, alerts, and metrics.

6. **📱 100% AgroEye Theme Match**:
   - Emerald green (`#059669`) branding, `#f8faf8` background, `#0c141f` dark GIS radar styling, and mobile bottom navigation bar.

---

## 🛠️ Tech Stack & APIs Used

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons + Google Fonts (Inter, Manrope, Space Grotesk)
- **Mapping**: Leaflet + Esri World Imagery + OpenStreetMap
- **Weather API**: Open-Meteo API (High-precision, free, no API key required)
- **Geocoding**: OpenStreetMap Nominatim (Free, no API key required)
- **State & Storage**: React Hooks + LocalStorage persistence for offline resilience

---

## 🚀 Running Locally

```bash
# 1. Navigate to the project directory
cd agroeye-weather

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Building for Production

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

---

## ☁️ Deployment

### Deploy to Vercel (1-Click)
This project includes pre-configured `vercel.json`:
```bash
npx vercel
```
Or connect your GitHub repository directly to [Vercel](https://vercel.com) and it will detect Vite automatically.

### Deploy to Netlify
This project includes pre-configured `netlify.toml`:
```bash
npx netlify deploy --prod
```
Or drag and drop the `dist/` folder into Netlify Drop.
