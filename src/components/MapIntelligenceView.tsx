import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Building2,
  Users,
  Clock,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Layers,
  Search,
  Filter,
  Info,
  Maximize2,
  X,
  FileText,
  DollarSign,
  Briefcase,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CityProfile, EvidenceItem } from '../types';
import { CITIES_DATA, EVIDENCE_LIBRARY } from '../data/defaultData';

interface MapIntelligenceViewProps {
  cities?: CityProfile[];
  evidenceList?: EvidenceItem[];
  selectedCityId?: string;
  hasActiveAssessment?: boolean;
  onTransferCityToBuilder: (cityId: string) => void;
  onNavigateToBuilder: () => void;
}

export const MapIntelligenceView: React.FC<MapIntelligenceViewProps> = ({
  cities = CITIES_DATA,
  evidenceList = EVIDENCE_LIBRARY,
  selectedCityId,
  hasActiveAssessment = false,
  onTransferCityToBuilder,
  onNavigateToBuilder,
}) => {
  // Selected city in Map Intelligence view (independent of active assessment)
  const [activeCityId, setActiveCityId] = useState<string>(
    selectedCityId || cities[0]?.id || 'bengaluru'
  );

  // Comparison selection set (user can choose 2 to 5 cities)
  const [comparisonCityIds, setComparisonCityIds] = useState<string[]>(['bengaluru', 'vizag']);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Filter state
  const [tierFilter, setTierFilter] = useState<'all' | 'Tier-1' | 'Tier-2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map view engine toggle: Leaflet Tile Map vs Vector Geographic Map
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'vector'>('leaflet');
  const [tileLoadError, setTileLoadError] = useState<boolean>(false);

  // Transfer feedback toast
  const [transferToast, setTransferToast] = useState<string | null>(null);

  // Refs for Leaflet map container
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Active inspected city object
  const activeCity = useMemo(
    () => cities.find((c) => c.id === activeCityId) || cities[0],
    [cities, activeCityId]
  );

  // Filtered cities list
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesTier = tierFilter === 'all' || city.tier === tierFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [cities, tierFilter, searchQuery]);

  // Evidence records specifically relevant to the active city
  const cityRelevantEvidence = useMemo(() => {
    if (!activeCity) return [];
    return evidenceList.filter((item) => {
      const geo = item.geography.toLowerCase();
      const cityName = activeCity.name.toLowerCase();
      return (
        geo.includes(cityName) ||
        (activeCity.id === 'vizag' && geo.includes('visakhapatnam')) ||
        (activeCity.tier === 'Tier-2' && geo.includes('tier-2')) ||
        geo.includes('pan-india') ||
        geo.includes('india tech')
      );
    });
  }, [evidenceList, activeCity]);

  // Handle explicit transfer of city to Plan Builder
  const handleTransferToPlanBuilder = (cityId: string) => {
    const target = cities.find((c) => c.id === cityId);
    if (!target) return;
    onTransferCityToBuilder(cityId);
    setTransferToast(`Location "${target.name}" transferred to Plan Builder.`);
    setTimeout(() => setTransferToast(null), 3500);
  };

  // Toggle city in comparison set
  const toggleComparisonCity = (cityId: string) => {
    setComparisonCityIds((prev) => {
      if (prev.includes(cityId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((id) => id !== cityId);
      } else {
        if (prev.length >= 5) return prev; // Maximum 5
        return [...prev, cityId];
      }
    });
  };

  // Initialize and update Leaflet map
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    if (!mapContainerRef.current) return;

    // If map does not exist, initialize it
    if (!leafletMapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [18.5, 80.5],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          zoomControl: true,
          attributionControl: true,
        });

        // OpenStreetMap public tile layer - requires zero API keys
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });

        tileLayer.on('tileerror', () => {
          setTileLoadError(true);
        });

        tileLayer.addTo(map);
        leafletMapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet initialization failed, falling back to Vector Map:', err);
        setMapEngine('vector');
        return;
      }
    }

    const map = leafletMapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Render city markers using custom HTML DivIcons
    cities.forEach((city) => {
      if (!city.coordinates) return;

      const isSelected = city.id === activeCityId;
      const isCompared = comparisonCityIds.includes(city.id);
      const isTier1 = city.tier === 'Tier-1';

      // Custom HTML Marker with Tailwind styling
      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'
        }">
          <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-md border-2 ${
            isSelected
              ? 'bg-slate-900 border-white ring-4 ring-slate-900/30'
              : isTier1
              ? 'bg-emerald-600 border-white'
              : 'bg-indigo-600 border-white'
          } text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-8-6.75-8-12a8 8 0 1 1 16 0c0 5.25-8 12-8 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          ${
            isCompared
              ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"></span>'
              : ''
          }
          <div class="absolute left-1/2 -translate-x-1/2 top-9 px-2 py-0.5 rounded shadow-sm text-[10px] font-bold whitespace-nowrap pointer-events-none ${
            isSelected
              ? 'bg-slate-900 text-white'
              : 'bg-white/95 text-slate-800 border border-slate-200'
          }">
            ${city.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'gcc-compass-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([city.coordinates.latitude, city.coordinates.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        setActiveCityId(city.id);
      });

      marker.addTo(map);
      markersRef.current[city.id] = marker;
    });

    // Invalidate size in case of container layout resizing
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [mapEngine, cities, activeCityId, comparisonCityIds]);

  // Center Leaflet map when active city changes
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    const map = leafletMapInstanceRef.current;
    if (!map || !activeCity || !activeCity.coordinates) return;

    map.panTo([activeCity.coordinates.latitude, activeCity.coordinates.longitude], {
      animate: true,
      duration: 0.5,
    });
  }, [activeCityId, mapEngine, activeCity]);

  // Cleanup Leaflet on unmount or engine switch
  useEffect(() => {
    return () => {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, [mapEngine]);

  // Coordinates projection helper for SVG Vector Geographic Map
  // Geographic bounds for India continental territory: Lat 7° to 36°, Lng 67° to 96°
  const projectGeoToSvg = (lat: number, lng: number, svgW = 600, svgH = 650) => {
    const minLat = 7.0;
    const maxLat = 36.0;
    const minLng = 67.0;
    const maxLng = 96.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * svgW;
    const y = ((maxLat - lat) / (maxLat - minLat)) * svgH;
    return { x, y };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Transfer Notification Toast */}
      {transferToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{transferToast}</span>
          <button
            onClick={() => onNavigateToBuilder()}
            className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-md font-semibold text-[11px] transition-colors"
          >
            Go to Plan Builder
          </button>
          <button
            onClick={() => setTransferToast(null)}
            className="text-slate-400 hover:text-white ml-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Context Description */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>GCC Compass · Geographic Location Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              India GCC Hub Map Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Explore verified geographic coordinates, talent availability, commercial Grade-A office rents, state GCC policies, and local service providers across India’s primary Tier-1 tech capitals and emerging Tier-2 hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isComparisonOpen
                  ? 'bg-amber-600 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isComparisonOpen ? 'Close City Comparison' : `Compare Cities (${comparisonCityIds.length})`}</span>
            </button>

            <button
              onClick={() => handleTransferToPlanBuilder(activeCity.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
              title="Use selected city in Plan Builder"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Use {activeCity.name} in Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Engine and Disclosures Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="font-semibold text-slate-700">Map Engine:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-medium">
              <button
                onClick={() => setMapEngine('leaflet')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  mapEngine === 'leaflet'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive Tile Map (Leaflet / OSM)
              </button>
              <button
                onClick={() => setMapEngine('vector')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  mapEngine === 'vector'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Precision Vector Map (Zero Network Dependency)
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden md:inline">
              {mapEngine === 'leaflet'
                ? 'Public OpenStreetMap tiles (no API key required).'
                : 'Deterministic SVG projection of verified coordinates.'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tier-1 Metro</span>
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 ml-2" />
            <span>Tier-2 Emerging Hub</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Selected City Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP COLUMN */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Map Filters & Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">Filter:</span>
              <button
                onClick={() => setTierFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  tierFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Cities ({cities.length})
              </button>
              <button
                onClick={() => setTierFilter('Tier-1')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  tierFilter === 'Tier-1'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Tier-1 Metros (2)
              </button>
              <button
                onClick={() => setTierFilter('Tier-2')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  tierFilter === 'Tier-2'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                Tier-2 Hubs (3)
              </button>
            </div>

            <div className="relative w-40 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hub or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Map Rendering Container */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden relative min-h-[480px] sm:min-h-[560px] flex items-center justify-center">
            {mapEngine === 'leaflet' && !tileLoadError ? (
              /* Leaflet Live Map View */
              <div
                ref={mapContainerRef}
                className="w-full h-full min-h-[480px] sm:min-h-[560px] z-10"
                style={{ background: '#0f172a' }}
              />
            ) : (
              /* Vector Geographic Fallback Map of India */
              <div className="relative w-full h-full p-4 flex flex-col items-center justify-center select-none bg-slate-950 text-white min-h-[480px] sm:min-h-[560px]">
                <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300">
                  <span className="font-semibold text-emerald-400">Precision Vector Map</span> · Equirectangular Geographic Projection
                </div>

                <svg
                  viewBox="0 0 600 650"
                  className="w-full max-w-[500px] h-auto drop-shadow-lg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Subtle Background Coordinate Grid */}
                  <g stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3">
                    <line x1="50" y1="150" x2="550" y2="150" />
                    <line x1="50" y1="300" x2="550" y2="300" />
                    <line x1="50" y1="450" x2="550" y2="450" />
                    <line x1="150" y1="50" x2="150" y2="600" />
                    <line x1="300" y1="50" x2="300" y2="600" />
                    <line x1="450" y1="50" x2="450" y2="600" />
                  </g>

                  {/* Stylized Geographic Outline of India */}
                  <path
                    d="M 220 50 L 260 40 L 300 60 L 340 70 L 390 120 L 410 180 L 480 200 L 530 220 L 520 260 L 460 280 L 420 280 L 400 320 L 420 380 L 380 430 L 330 500 L 290 580 L 260 550 L 240 470 L 210 430 L 190 380 L 160 350 L 150 280 L 170 230 L 180 180 L 180 120 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="2"
                    className="transition-colors hover:stroke-slate-500"
                  />

                  {/* Coastal water accents */}
                  <text x="80" y="440" fill="#475569" fontSize="10" fontStyle="italic">Arabian Sea</text>
                  <text x="440" y="440" fill="#475569" fontSize="10" fontStyle="italic">Bay of Bengal</text>
                  <text x="240" y="620" fill="#475569" fontSize="10" fontStyle="italic">Indian Ocean</text>

                  {/* City Coordinates Markers */}
                  {filteredCities.map((city) => {
                    if (!city.coordinates) return null;
                    const { x, y } = projectGeoToSvg(
                      city.coordinates.latitude,
                      city.coordinates.longitude,
                      600,
                      650
                    );
                    const isSelected = city.id === activeCityId;
                    const isCompared = comparisonCityIds.includes(city.id);
                    const isTier1 = city.tier === 'Tier-1';

                    return (
                      <g
                        key={city.id}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setActiveCityId(city.id)}
                        className="cursor-pointer group"
                      >
                        {/* Selected Radar Ring */}
                        {isSelected && (
                          <circle
                            r="22"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            className="animate-ping origin-center opacity-75"
                          />
                        )}

                        {/* Outer Glow */}
                        <circle
                          r={isSelected ? '14' : '10'}
                          fill={isSelected ? '#0f172a' : isTier1 ? '#047857' : '#4338ca'}
                          stroke={isSelected ? '#38bdf8' : '#ffffff'}
                          strokeWidth="2"
                          className="transition-all duration-200 group-hover:scale-125"
                        />

                        {/* Inner Pin Dot */}
                        <circle
                          r="4"
                          fill={isCompared ? '#f59e0b' : '#ffffff'}
                        />

                        {/* City Label Badge */}
                        <text
                          y={isSelected ? '-18' : '22'}
                          textAnchor="middle"
                          fill={isSelected ? '#38bdf8' : '#ffffff'}
                          fontSize={isSelected ? '12' : '11'}
                          fontWeight={isSelected ? 'bold' : '600'}
                          className="drop-shadow-md select-none"
                        >
                          {city.name}
                        </text>
                        <text
                          y={isSelected ? '-6' : '33'}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          className="select-none"
                        >
                          {city.tier}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>Click any marker to inspect verified labor & operating indicators</span>
                  <button
                    onClick={() => setMapEngine('leaflet')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    Switch to Leaflet tiles
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hub Cards Strip below Map */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {cities.map((city) => {
              const isSelected = city.id === activeCityId;
              const isCompared = comparisonCityIds.includes(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => setActiveCityId(city.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs truncate">{city.name}</span>
                    <span
                      className={`text-[9px] font-semibold px-1 rounded ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : city.tier === 'Tier-1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {city.tier}
                    </span>
                  </div>
                  <div className={`text-[10px] mt-1 truncate ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {city.state}
                  </div>
                  {isCompared && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-amber-500 font-semibold">
                      <span>In Comparison</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CITY INTELLIGENCE DETAIL PANEL (RIGHT) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Header & Quick Action */}
          <div className="border-b border-slate-100 pb-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">{activeCity.name}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      activeCity.tier === 'Tier-1'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {activeCity.tier}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{activeCity.state}, India</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {activeCity.coordinates?.latitude.toFixed(4)}°N, {activeCity.coordinates?.longitude.toFixed(4)}°E
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded border ${
                  activeCity.evidenceStatus === 'Benchmarked'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {activeCity.evidenceStatus}
              </span>
            </div>

            {/* Assessment Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTransferToPlanBuilder(activeCity.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select for Plan Builder</span>
              </button>

              <button
                onClick={() => toggleComparisonCity(activeCity.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  comparisonCityIds.includes(activeCity.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                }`}
              >
                {comparisonCityIds.includes(activeCity.id) ? '✓ Compared' : '+ Add to Compare'}
              </button>
            </div>
          </div>

          {/* Section 1: GCC Presence & Ecosystem */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span>GCC Presence & Tech Ecosystem</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {activeCity.techEcosystemSummary}
            </p>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-600">
                Established GCCs & Major Development Facilities:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeCity.knownGccPresence.map((gcc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[11px] px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-2xs font-medium"
                  >
                    {gcc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Talent Availability & Frictions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-700" />
              <span>Talent Availability & Attrition Benchmarks</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Total IT Workforce</span>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {activeCity.estimatedTechTalentPool}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Senior Tech (6+y)</span>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {activeCity.estimatedSeniorTechTalentPool}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Voluntary Attrition</span>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {activeCity.typicalOfferDropoutRate}% average
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Notice Period Lag</span>
                <div className="font-bold font-mono text-slate-900 mt-0.5">
                  {activeCity.averageNoticePeriodDays} Days standard
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Real Estate & Operating Costs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-700" />
              <span>Prime Grade-A Office Operating Costs</span>
            </h3>

            {activeCity.officeOperatingCost ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {activeCity.officeOperatingCost.primeGradeARent}
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                    {activeCity.officeOperatingCost.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-700">Source: </strong>
                  {activeCity.officeOperatingCost.sourceName} ({activeCity.officeOperatingCost.dateChecked})
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  <strong>Limitations: </strong>
                  {activeCity.officeOperatingCost.limitations}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                Data unavailable. Requires dedicated real estate survey.
              </div>
            )}
          </div>

          {/* Section 4: State IT & GCC Incentives */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>State Policy & GCC Incentives</span>
            </h3>

            {activeCity.stateIncentivesPolicy ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {activeCity.stateIncentivesPolicy.policyName}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[10px] font-semibold">
                    {activeCity.stateIncentivesPolicy.status}
                  </span>
                </div>

                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {activeCity.stateIncentivesPolicy.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                  <strong className="text-slate-700">Source: </strong>
                  {activeCity.stateIncentivesPolicy.sourceName} · {activeCity.stateIncentivesPolicy.limitations}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                Data unavailable for state incentive scheme.
              </div>
            )}
          </div>

          {/* Section 5: Local Service Providers */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              <span>Relevant Service Providers & Ecosystem</span>
            </h3>

            {activeCity.serviceProviders ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Identified Ecosystem Partners:</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-medium">
                    {activeCity.serviceProviders.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeCity.serviceProviders.identifiedProviders.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Notes: </strong>{activeCity.serviceProviders.limitations}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                Data unavailable.
              </div>
            )}
          </div>

          {/* Section 6: Epistemic Audit & Caveats */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Epistemic Audit & Sourcing Caveats:</span>
            </div>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              {activeCity.caveats}
            </p>
            {cityRelevantEvidence.length > 0 && (
              <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-900">
                <span>Backed by {cityRelevantEvidence.length} verified record(s) in Evidence Base.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CITY COMPARISON MODAL / EXPANDED SECTION */}
      {isComparisonOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Side-by-Side City Comparison
                </span>
                <span className="text-xs text-slate-500">· {comparisonCityIds.length} Hubs Selected</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Comparative Workforce & Operational Feasibility
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
                Compare verified metrics across locations without synthetic composite scores or ungrounded rankings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setComparisonCityIds(['bengaluru', 'vizag'])}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset Default Pair
              </button>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>

          {/* City Selector Pills for Comparison */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-600 mr-1">Include Hubs:</span>
            {cities.map((city) => {
              const active = comparisonCityIds.includes(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => toggleComparisonCity(city.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] opacity-75">({city.tier})</span>
                  {active && <span className="font-bold text-[10px]">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 w-48 font-bold">Metric / Indicator</th>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <th key={id} className="p-3.5 min-w-[220px]">
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {c.state} · <span className="font-semibold text-slate-700">{c.tier}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {/* Row: Coordinates */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Coordinates</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono text-[11px]">
                        {c?.coordinates?.latitude.toFixed(4)}°N, {c?.coordinates?.longitude.toFixed(4)}°E
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Tech Talent Pool */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Total IT Workforce</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono font-medium">
                        {c?.estimatedTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Senior Talent */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Senior Talent Pool (6+y)</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono">
                        {c?.estimatedSeniorTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Voluntary Attrition */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Voluntary Attrition</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono">
                        {c?.typicalOfferDropoutRate}% per annum
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Notice Period Standard */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Notice Period Assumption</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono">
                        {c?.averageNoticePeriodDays} Days standard
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Prime Office Rent */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Prime Grade-A Office Rent</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5">
                        <div className="font-bold text-slate-900 font-mono">
                          {c?.officeOperatingCost?.primeGradeARent || 'Data unavailable'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {c?.officeOperatingCost?.sourceName}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Row: State Policy */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">State Policy Framework</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5">
                        <div className="font-semibold text-slate-900">
                          {c?.stateIncentivesPolicy?.policyName || 'Data unavailable'}
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                          {c?.stateIncentivesPolicy?.highlights.slice(0, 2).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Service Providers */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Vendor & Provider Depth</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5">
                        <div className="text-[11px] text-slate-700">
                          {c?.serviceProviders?.identifiedProviders.slice(0, 2).join(', ') || 'Data unavailable'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 italic">
                          {c?.serviceProviders?.limitations}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Established GCC Campuses */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Verified GCC Hubs</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 text-[11px] text-slate-700">
                        {c?.knownGccPresence.slice(0, 4).join(', ')}...
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Action transfer */}
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-semibold text-slate-600">Transfer Action</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <td key={id} className="p-3.5">
                        <button
                          onClick={() => handleTransferToPlanBuilder(c.id)}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>Use {c.name} in Builder</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disclosures on comparison methodology */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <strong className="text-slate-700">Comparative Methodological Disclosure:</strong>
            <p className="leading-relaxed">
              Figures reflect data compiled from respective state IT policies, real estate IPC benchmarks (CBRE / Cushman & Wakefield 2024), and NASSCOM GCC council reports. Reporting dates and definitions may vary between state agencies. GCC Compass does not construct artificial composite index scores or algorithmic rankings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
