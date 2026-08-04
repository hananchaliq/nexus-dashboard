src/
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── textures/
│   │   ├── earth/
│   │   ├── sky/
│   │   └── hdr/
│   └── models/
│
├── components/
│   ├── common/
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Loading.jsx
│   │   └── GlassPanel.jsx
│   │
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SidebarItem.jsx
│   │   ├── Topbar.jsx
│   │   └── BottomBar.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardGrid.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── CenterPanel.jsx
│   │   └── RightPanel.jsx
│   │
│   ├── widgets/
│   │   ├── Weather/
│   │   ├── Prayer/
│   │   ├── Finance/
│   │   ├── Calendar/
│   │   ├── Notes/
│   │   └── QuickLinks/
│   │
│   ├── globe/
│   │   ├── GlobeCanvas.jsx
│   │   ├── GlobeScene.jsx
│   │   ├── Earth.jsx
│   │   ├── Clouds.jsx
│   │   ├── Atmosphere.jsx
│   │   ├── Stars.jsx
│   │   ├── Moon.jsx
│   │   ├── Sun.jsx
│   │   ├── Marker.jsx
│   │   ├── ProvinceBorder.jsx
│   │   ├── OrbitController.jsx
│   │   └── Effects.jsx
│   │
│   └── settings/
│       ├── SettingsPanel.jsx
│       └── ThemeSelector.jsx
│
├── hooks/
│   ├── useEarth.js
│   ├── useWeather.js
│   ├── usePrayer.js
│   └── useAnimation.js
│
├── services/
│   ├── weather.js
│   ├── prayer.js
│   ├── finance.js
│   ├── geocode.js
│   └── location.js
│
├── shaders/
│   ├── atmosphere/
│   ├── earth/
│   ├── stars/
│   └── glow/
│
├── store/
│   ├── appStore.js
│   ├── globeStore.js
│   └── settingsStore.js
│
├── utils/
│   ├── latLonToVector3.js
│   ├── lerp.js
│   ├── constants.js
│   └── helpers.js
│
├── styles/
│   ├── globals.css
│   ├── dashboard.css
│   ├── glass.css
│   ├── sidebar.css
│   ├── widgets.css
│   └── globe.css
│
├── pages/
│   ├── Home.jsx
│   ├── Settings.jsx
│   └── About.jsx
│
├── App.jsx
└── main.jsx