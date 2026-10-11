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
  Building,
  Target,
  Code2,
  CheckCircle,
  FileSpreadsheet,
  ChevronRight,
  BookOpen,
  FilterX,
  Sparkles,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CityProfile, EvidenceItem, GccCompany } from '../types';
import { CITIES_DATA, EVIDENCE_LIBRARY, GCC_COMPANIES } from '../data/defaultData';

interface MapIntelligenceViewProps {
  cities?: CityProfile[];
  evidenceList?: EvidenceItem[];
  selectedCityId?: string;
  hasActiveAssessment?: boolean;
  onTransferCityToBuilder: (cityId: string) => void;
  onNavigateToBuilder: () => void;
}

type DetailTab = 'companies' | 'workforce' | 'economics' | 'evidence';

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

  // Active detail panel tab for focused navigation
  const [activeTab, setActiveTab] = useState<DetailTab>('companies');

  // Selected company drill-down inside the active city (null = directory list)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Sector filter inside company directory
  const [companySectorFilter, setCompanySectorFilter] = useState<string>('all');

  // Comparison selection set (user can choose 2 to 6 cities)
  const [comparisonCityIds, setComparisonCityIds] = useState<string[]>(['bengaluru', 'vizag']);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Filter state
  const [tierFilter, setTierFilter] = useState<'all' | 'Tier-1' | 'Tier-2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sidebar Data Availability Filters
  const [filterVerifiedIncentives, setFilterVerifiedIncentives] = useState<boolean>(false);
  const [filterDirectGccWorkforce, setFilterDirectGccWorkforce] = useState<boolean>(false);
  const [filterOfficeCostBenchmarks, setFilterOfficeCostBenchmarks] = useState<boolean>(false);
  const [filterEmpiricalEvidence, setFilterEmpiricalEvidence] = useState<boolean>(false);

  // Map view engine toggle: Leaflet Tile Map vs Vector Geographic Map
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'vector'>('leaflet');
  const [tileLoadError, setTileLoadError] = useState<boolean>(false);

  // Transfer feedback toast
  const [transferToast, setTransferToast] = useState<string | null>(null);

  // Refs for Leaflet map container
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Active inspected city object (guaranteed fresh reference based on activeCityId)
  const activeCity = useMemo(
    () => cities.find((c) => c.id === activeCityId) || cities[0],
    [cities, activeCityId]
  );

  // Reset selected company when active city changes to prevent stale data
  useEffect(() => {
    setSelectedCompanyId(null);
    setCompanySectorFilter('all');
  }, [activeCityId]);

  // Companies strictly associated with the active city (City -> GCC Companies association)
  const activeCityCompanies: GccCompany[] = useMemo(() => {
    if (!activeCity) return [];
    if (activeCity.companies && activeCity.companies.length > 0) {
      return activeCity.companies;
    }
    return GCC_COMPANIES.filter((comp) => comp.cityId === activeCity.id);
  }, [activeCity]);

  // Selected company profile object (if inspecting a single company)
  const activeCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return activeCityCompanies.find((c) => c.id === selectedCompanyId) || null;
  }, [activeCityCompanies, selectedCompanyId]);

  // Unique industry sectors in active city for directory filter
  const citySectors = useMemo(() => {
    const sectors = new Set<string>();
    activeCityCompanies.forEach((comp) => {
      if (comp.primarySector) sectors.add(comp.primarySector);
    });
    return Array.from(sectors);
  }, [activeCityCompanies]);

  // Filtered companies within active city
  const filteredCityCompanies = useMemo(() => {
    return activeCityCompanies.filter((comp) => {
      if (companySectorFilter !== 'all' && comp.primarySector !== companySectorFilter) {
        return false;
      }
      return true;
    });
  }, [activeCityCompanies, companySectorFilter]);

  // Filtered cities list for map markers & selection based on tier, search, and data availability
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesTier = tierFilter === 'all' || city.tier === tierFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        city.name.toLowerCase().includes(query) ||
        city.state.toLowerCase().includes(query);

      if (!matchesTier || !matchesSearch) return false;

      // Data Availability Filter 1: Verified Incentive Policy
      if (filterVerifiedIncentives) {
        const hasVerified =
          city.stateIncentivesPolicy &&
          (city.stateIncentivesPolicy.status === 'verified_fact' ||
            city.stateIncentivesPolicy.status === 'company_announcement');
        if (!hasVerified) return false;
      }

      // Data Availability Filter 2: Direct GCC Workforce Data
      if (filterDirectGccWorkforce) {
        const hasWorkforce =
          city.workforceBreakdown?.directGccHeadcount &&
          city.workforceBreakdown.directGccHeadcount !== 'Data unavailable' &&
          city.workforceBreakdown.directGccHeadcount !== 'Requires verification';
        if (!hasWorkforce) return false;
      }

      // Data Availability Filter 3: Commercial Office Cost Benchmarks
      if (filterOfficeCostBenchmarks) {
        const hasRent =
          city.officeOperatingCost?.primeGradeARent &&
          city.officeOperatingCost.primeGradeARent !== 'Data unavailable';
        if (!hasRent) return false;
      }

      // Data Availability Filter 4: Linked Empirical Evidence Records
      if (filterEmpiricalEvidence) {
        const hasEvidence = city.evidenceItemIds && city.evidenceItemIds.length > 0;
        if (!hasEvidence) return false;
      }

      return true;
    });
  }, [
    cities,
    tierFilter,
    searchQuery,
    filterVerifiedIncentives,
    filterDirectGccWorkforce,
    filterOfficeCostBenchmarks,
    filterEmpiricalEvidence,
  ]);

  const hasActiveAvailabilityFilters =
    filterVerifiedIncentives ||
    filterDirectGccWorkforce ||
    filterOfficeCostBenchmarks ||
    filterEmpiricalEvidence ||
    tierFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setTierFilter('all');
    setSearchQuery('');
    setFilterVerifiedIncentives(false);
    setFilterDirectGccWorkforce(false);
    setFilterOfficeCostBenchmarks(false);
    setFilterEmpiricalEvidence(false);
  };

  // Verified evidence records strictly associated with the active city (No Tier-2 generic leakage)
  const cityRelevantEvidence = useMemo(() => {
    if (!activeCity) return [];
    return evidenceList.filter((item) => {
      // 1. Direct ID match from city profile
      if (activeCity.evidenceItemIds && activeCity.evidenceItemIds.includes(item.id)) {
        return true;
      }
      // 2. Direct ID match from any company of this city
      const isCompanyEvidence = activeCityCompanies.some(
        (c) => c.evidenceItemIds && c.evidenceItemIds.includes(item.id)
      );
      if (isCompanyEvidence) {
        return true;
      }
      // 3. Exact city geography match
      const geo = item.geography.toLowerCase();
      const cityName = activeCity.name.toLowerCase();
      if (geo.includes(cityName)) {
        return true;
      }
      if (activeCity.id === 'vizag' && geo.includes('visakhapatnam')) {
        return true;
      }
      return false;
    });
  }, [evidenceList, activeCity, activeCityCompanies]);

  // Macro Pan-India evidence (contextual only)
  const panIndiaEvidence = useMemo(() => {
    return evidenceList.filter(
      (item) => item.geography === 'India' || item.geography.toLowerCase().includes('pan-india')
    );
  }, [evidenceList]);

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
        if (prev.length >= 6) return prev; // Maximum 6
        return [...prev, cityId];
      }
    });
  };

  // Initialize and update Leaflet map
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    if (!mapContainerRef.current) return;

    if (!leafletMapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [18.5, 78.5],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          zoomControl: true,
          attributionControl: true,
        });

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

    // Render city markers ONLY for matching filteredCities
    filteredCities.forEach((city) => {
      if (!city.coordinates) return;

      const isSelected = city.id === activeCityId;
      const isCompared = comparisonCityIds.includes(city.id);
      const isTier1 = city.tier === 'Tier-1';

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-110 z-50' : 'hover:scale-105 z-20'
        }">
          <div class="flex items-center justify-center w-7 h-7 rounded-full shadow-md border-2 ${
            isSelected
              ? 'bg-slate-900 border-emerald-400 ring-2 ring-slate-900/40 text-white'
              : isTier1
              ? 'bg-emerald-700 border-white text-white'
              : 'bg-indigo-700 border-white text-white'
          }">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-8-6.75-8-12a8 8 0 1 1 16 0c0 5.25-8 12-8 12z" />
              <circle cx="12" cy="9" r="2" />
            </svg>
          </div>
          ${
            isCompared
              ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full"></span>'
              : ''
          }
          <div class="absolute left-1/2 -translate-x-1/2 top-8 px-2 py-0.5 rounded shadow-sm text-[10px] font-semibold whitespace-nowrap pointer-events-none ${
            isSelected
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-800 border border-slate-200'
          }">
            ${city.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'gcc-compass-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
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

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [mapEngine, filteredCities, activeCityId, comparisonCityIds]);

  // Pan Leaflet map when active city changes
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
    <div className="space-y-6">
      {/* Toast Alert */}
      {transferToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{transferToast}</span>
          <button
            onClick={() => onNavigateToBuilder()}
            className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded font-semibold text-[11px] transition-colors"
          >
            Open Plan Builder
          </button>
          <button
            onClick={() => setTransferToast(null)}
            className="text-slate-400 hover:text-white ml-1 font-bold"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Flagship Header */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-700" />
              <span>Location Intelligence & GCC Ecosystem Atlas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              India GCC Hub Map Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Explore verified coordinates, structured multinational capability center directories, talent depth benchmarks, commercial office rents, state incentive frameworks, and localized empirical evidence across supported hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                isComparisonOpen
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isComparisonOpen ? 'Close Comparison' : `Compare Cities (${comparisonCityIds.length})`}</span>
            </button>

            <button
              onClick={() => handleTransferToPlanBuilder(activeCity.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
              title="Use selected city in Plan Builder"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Use {activeCity.name} in Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Engine and Metros Disclosure Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700">Map Engine:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-medium">
              <button
                onClick={() => setMapEngine('leaflet')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  mapEngine === 'leaflet'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive Tile Map (Leaflet / OSM)
              </button>
              <button
                onClick={() => setMapEngine('vector')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  mapEngine === 'vector'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vector Geographic Map
              </button>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {mapEngine === 'leaflet'
                ? 'Public OpenStreetMap tiles (zero key dependency).'
                : 'Deterministic SVG projection of verified coordinates.'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              <span>Tier-1 Metros ({cities.filter((c) => c.tier === 'Tier-1').length})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-700" />
              <span>Tier-2 Hubs ({cities.filter((c) => c.tier === 'Tier-2').length})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-emerald-400" />
              <span>Active Selection: <strong>{activeCity.name}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Flagship Spatial Research Workspace: 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR COLUMN (lg:col-span-3): Filters & Hub Directory */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Hub Filters
                </h3>
              </div>
              {hasActiveAvailabilityFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hub or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Tier Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Metro Tier
              </span>
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setTierFilter('all')}
                  className={`py-1 text-center font-medium rounded-md transition-colors ${
                    tierFilter === 'all'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({cities.length})
                </button>
                <button
                  onClick={() => setTierFilter('Tier-1')}
                  className={`py-1 text-center font-medium rounded-md transition-colors ${
                    tierFilter === 'Tier-1'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tier-1
                </button>
                <button
                  onClick={() => setTierFilter('Tier-2')}
                  className={`py-1 text-center font-medium rounded-md transition-colors ${
                    tierFilter === 'Tier-2'
                      ? 'bg-indigo-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tier-2
                </button>
              </div>
            </div>

            {/* Sidebar Data Availability Filter (User Request #3) */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Data Availability Toggles
                </span>
                <span className="text-[10px] text-slate-400">Map Filter</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Filter map markers to show only hubs with verified records:
              </p>

              <div className="space-y-1.5 text-xs">
                {/* 1. Verified Incentive Policies */}
                <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterVerifiedIncentives}
                    onChange={(e) => setFilterVerifiedIncentives(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800 flex items-center justify-between">
                      <span>Verified Policy Framework</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {
                          cities.filter(
                            (c) =>
                              c.stateIncentivesPolicy?.status === 'verified_fact' ||
                              c.stateIncentivesPolicy?.status === 'company_announcement'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Gazetted state IT / GCC policy status
                    </div>
                  </div>
                </label>

                {/* 2. Direct GCC Workforce Data */}
                <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterDirectGccWorkforce}
                    onChange={(e) => setFilterDirectGccWorkforce(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800 flex items-center justify-between">
                      <span>Direct GCC Workforce</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {
                          cities.filter(
                            (c) =>
                              c.workforceBreakdown?.directGccHeadcount &&
                              c.workforceBreakdown.directGccHeadcount !== 'Data unavailable'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Explicit GCC employee headcount
                    </div>
                  </div>
                </label>

                {/* 3. Office Operating Cost Benchmarks */}
                <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOfficeCostBenchmarks}
                    onChange={(e) => setFilterOfficeCostBenchmarks(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800 flex items-center justify-between">
                      <span>Prime Office Rent</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {
                          cities.filter(
                            (c) =>
                              c.officeOperatingCost?.primeGradeARent &&
                              c.officeOperatingCost.primeGradeARent !== 'Data unavailable'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Commercial Grade-A IPC rates
                    </div>
                  </div>
                </label>

                {/* 4. Empirical Evidence Base */}
                <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterEmpiricalEvidence}
                    onChange={(e) => setFilterEmpiricalEvidence(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800 flex items-center justify-between">
                      <span>Empirical Evidence Base</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {cities.filter((c) => c.evidenceItemIds && c.evidenceItemIds.length > 0).length}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Direct linked audit citations
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Matching Hubs Counter */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing:</span>
              <strong className="text-slate-900 font-semibold">
                {filteredCities.length} of {cities.length} Hubs
              </strong>
            </div>
          </div>

          {/* Quick Hub Navigator List */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs space-y-2">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Hubs on Map
            </div>
            {filteredCities.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 space-y-2">
                <p>No hubs match all active filter criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const isSelected = city.id === activeCityId;
                  const isCompared = comparisonCityIds.includes(city.id);
                  const companyCount = GCC_COMPANIES.filter((c) => c.cityId === city.id).length;

                  return (
                    <div
                      key={city.id}
                      onClick={() => setActiveCityId(city.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/70'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate">{city.name}</span>
                          <span
                            className={`text-[9px] font-semibold px-1 rounded ${
                              isSelected
                                ? 'bg-slate-800 text-slate-300'
                                : city.tier === 'Tier-1'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-indigo-50 text-indigo-800'
                            }`}
                          >
                            {city.tier}
                          </span>
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {city.state} · {companyCount} GCCs
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparisonCity(city.id);
                          }}
                          className={`px-1.5 py-0.5 text-[9px] font-semibold rounded border transition-colors ${
                            isCompared
                              ? 'bg-amber-400 text-slate-900 border-amber-400'
                              : isSelected
                              ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                          }`}
                          title="Toggle in comparison matrix"
                        >
                          {isCompared ? '✓ Comp' : '+ Comp'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MAP & DETAIL COLUMN (lg:col-span-9): Map Viewport + Detailed Hub Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* MAP VIEWPORT CONTAINER */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-sm overflow-hidden relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
            {filteredCities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-3 z-20">
                <FilterX className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Hubs Match Selected Criteria</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try unchecking one of the data availability toggles in the sidebar to reveal more locations on the map.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : mapEngine === 'leaflet' && !tileLoadError ? (
              <div
                ref={mapContainerRef}
                className="w-full h-full min-h-[460px] sm:min-h-[500px] z-10"
                style={{ background: '#0b1120' }}
              />
            ) : (
              /* Vector Geographic SVG Projection Fallback */
              <div className="relative w-full h-full p-4 flex flex-col items-center justify-center select-none bg-slate-950 text-white min-h-[460px] sm:min-h-[500px]">
                <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-semibold text-emerald-400">Vector Geographic Projection</span> · Verified Coordinates
                </div>

                <svg
                  viewBox="0 0 600 650"
                  className="w-full max-w-[480px] h-auto drop-shadow-lg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3">
                    <line x1="50" y1="150" x2="550" y2="150" />
                    <line x1="50" y1="300" x2="550" y2="300" />
                    <line x1="50" y1="450" x2="550" y2="450" />
                    <line x1="150" y1="50" x2="150" y2="600" />
                    <line x1="300" y1="50" x2="300" y2="600" />
                    <line x1="450" y1="50" x2="450" y2="600" />
                  </g>

                  {/* Outline Representation */}
                  <path
                    d="M 220 50 L 260 40 L 300 60 L 340 70 L 390 120 L 410 180 L 480 200 L 530 220 L 520 260 L 460 280 L 420 280 L 400 320 L 420 380 L 380 430 L 330 500 L 290 580 L 260 550 L 240 470 L 210 430 L 190 380 L 160 350 L 150 280 L 170 230 L 180 180 L 180 120 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />

                  <text x="80" y="440" fill="#475569" fontSize="10" fontStyle="italic">Arabian Sea</text>
                  <text x="440" y="440" fill="#475569" fontSize="10" fontStyle="italic">Bay of Bengal</text>
                  <text x="240" y="620" fill="#475569" fontSize="10" fontStyle="italic">Indian Ocean</text>

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
                        {isSelected && (
                          <circle
                            r="20"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            className="animate-ping origin-center opacity-75"
                          />
                        )}

                        <circle
                          r={isSelected ? '12' : '9'}
                          fill={isSelected ? '#0f172a' : isTier1 ? '#047857' : '#4338ca'}
                          stroke={isSelected ? '#38bdf8' : '#ffffff'}
                          strokeWidth="2"
                          className="transition-all duration-200 group-hover:scale-125"
                        />

                        <circle
                          r="3"
                          fill={isCompared ? '#f59e0b' : '#ffffff'}
                        />

                        <text
                          y={isSelected ? '-16' : '18'}
                          textAnchor="middle"
                          fill={isSelected ? '#38bdf8' : '#ffffff'}
                          fontSize={isSelected ? '11' : '10'}
                          fontWeight={isSelected ? 'bold' : '600'}
                          className="drop-shadow-md select-none"
                        >
                          {city.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800">
                  <span>Click any city marker to inspect data</span>
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

          {/* DETAILED CITY INTELLIGENCE PANEL */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            {/* Panel Top Banner */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{activeCity.name}</h2>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        activeCity.tier === 'Tier-1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {activeCity.tier}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        activeCity.evidenceStatus === 'Benchmarked'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {activeCity.evidenceStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>{activeCity.state}, India</span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-slate-600">
                      {activeCity.coordinates?.latitude.toFixed(4)}°N, {activeCity.coordinates?.longitude.toFixed(4)}°E
                    </span>
                    {activeCity.workforceBreakdown?.directGccHeadcount && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-emerald-800">
                          {activeCity.workforceBreakdown.directGccHeadcount} GCC Tech Talent
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleComparisonCity(activeCity.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      comparisonCityIds.includes(activeCity.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    {comparisonCityIds.includes(activeCity.id) ? '✓ Compared' : '+ Compare Hub'}
                  </button>

                  <button
                    onClick={() => handleTransferToPlanBuilder(activeCity.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select for Plan Builder</span>
                  </button>
                </div>
              </div>

              {/* Tabbed Navigation */}
              <div className="flex items-center gap-1 pt-2 border-t border-slate-200/60 overflow-x-auto">
                <button
                  onClick={() => {
                    setActiveTab('companies');
                    setSelectedCompanyId(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'companies'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Multinational Directory ({activeCityCompanies.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('workforce')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'workforce'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Workforce & Talent Pool</span>
                </button>
                <button
                  onClick={() => setActiveTab('economics')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'economics'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Rents & Incentives</span>
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'evidence'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Empirical Citations ({cityRelevantEvidence.length})</span>
                </button>
              </div>
            </div>

            {/* Panel Tab Content Area */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* TAB 1: COMPANIES DIRECTORY & DRILLDOWN */}
              {activeTab === 'companies' && (
                <div className="space-y-4">
                  {activeCompany ? (
                    /* Focused Company Profile Drilldown */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <button
                          onClick={() => setSelectedCompanyId(null)}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          ← Back to {activeCity.name} Directory
                        </button>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Inspecting Facility Record
                        </span>
                      </div>

                      <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{activeCompany.name}</h3>
                            <div className="text-xs text-slate-600 mt-0.5">
                              Parent Company: <strong className="text-slate-800">{activeCompany.parentCompany}</strong> · Global HQ: {activeCompany.headquarters}
                            </div>
                          </div>
                          <span className="self-start px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700">
                            {activeCompany.primarySector}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Facility Campus</span>
                            <span className="font-semibold text-slate-900 mt-0.5 block">{activeCompany.facilityLocation}</span>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Established In</span>
                            <span className="font-semibold text-slate-900 mt-0.5 block">{activeCompany.establishedYear || 'Established'}</span>
                          </div>
                          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100">
                            <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Local Headcount</span>
                            <span className="font-bold font-mono text-emerald-950 text-sm mt-0.5 block">
                              {activeCompany.workforce.localHeadcount}
                            </span>
                          </div>
                        </div>

                        {/* Company Workforce Scope & Caveat */}
                        <div className="p-3 bg-white rounded-lg border border-slate-200/70 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-800">Verification Source: </strong>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                              {activeCompany.workforce.headcountType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            {activeCompany.workforce.sourceName} (Verified: {activeCompany.workforce.dateChecked})
                          </div>
                          <div className="text-slate-500 italic text-[11px] pt-1 border-t border-slate-100">
                            <strong>Reporting Scope: </strong>{activeCompany.workforce.limitations}
                          </div>
                        </div>

                        {/* Mandated Functions */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                            Mandated Business Functions Delivered from Hub
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeCompany.businessFunctions.map((fn, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded font-medium shadow-2xs"
                              >
                                {fn}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stacks */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                            Core Technology Stacks & Domains
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeCompany.specialisations.map((spec, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-1 bg-slate-900 text-white rounded font-medium"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Directory List */
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                          {activeCity.techEcosystemSummary}
                        </p>

                        {/* Sector Filter within City */}
                        {citySectors.length > 1 && (
                          <div className="flex items-center gap-1.5 shrink-0 text-xs">
                            <span className="text-slate-500 font-medium">Sector:</span>
                            <select
                              value={companySectorFilter}
                              onChange={(e) => setCompanySectorFilter(e.target.value)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden"
                            >
                              <option value="all">All Sectors ({activeCityCompanies.length})</option>
                              {citySectors.map((sec) => (
                                <option key={sec} value={sec}>{sec}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredCityCompanies.map((comp) => (
                          <div
                            key={comp.id}
                            onClick={() => setSelectedCompanyId(comp.id)}
                            className="p-3.5 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2 group"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {comp.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                                    {comp.primarySector} · {comp.facilityLocation}
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                                  {comp.workforce.localHeadcount}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-2">
                                {comp.specialisations.slice(0, 3).map((spec, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">
                                {comp.parentCompany}
                              </span>
                              <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                View Profile →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WORKFORCE & TALENT POOL */}
              {activeTab === 'workforce' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 uppercase font-semibold block">
                        Direct GCC Workforce Headcount
                      </span>
                      <div className="font-bold font-mono text-emerald-950 mt-1 text-base">
                        {activeCity.workforceBreakdown?.directGccHeadcount || 'Data unavailable'}
                      </div>
                      <div className="text-[11px] text-emerald-800 mt-1">
                        Source: {activeCity.workforceBreakdown?.directGccSource || 'Requires verification'}
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5 italic">
                        Scope: {activeCity.workforceBreakdown?.geographicScope}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Total IT & Tech Services Sector
                      </span>
                      <div className="font-bold font-mono text-slate-900 mt-1 text-base">
                        {activeCity.workforceBreakdown?.totalTechSectorHeadcount || activeCity.estimatedTechTalentPool}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Source: {activeCity.workforceBreakdown?.totalTechSectorSource || 'State IT Reports'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Broader IT/BPM ecosystem headcount
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Senior Engineering Talent Pool (6+ Years)
                      </span>
                      <div className="font-bold font-mono text-slate-900 mt-1 text-base">
                        {activeCity.workforceBreakdown?.seniorTalentPool || activeCity.estimatedSeniorTechTalentPool}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Principal engineers, architects, tech leads
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Voluntary Attrition & Notice Lag
                      </span>
                      <div className="font-bold font-mono text-slate-900 mt-1 text-base">
                        {activeCity.typicalOfferDropoutRate}% Attrition · {activeCity.averageNoticePeriodDays}d Notice
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Standard recruitment friction assumptions
                      </div>
                    </div>
                  </div>

                  {activeCity.workforceBreakdown && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
                      <div>
                        <strong className="text-slate-800">Geographic Reporting Scope: </strong>
                        <span className="text-slate-600">{activeCity.workforceBreakdown.geographicScope} ({activeCity.workforceBreakdown.dateChecked})</span>
                      </div>
                      <div className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Methodological Notes: </strong>
                        {activeCity.workforceBreakdown.definitionNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: OPERATING ECONOMICS & INCENTIVES */}
              {activeTab === 'economics' && (
                <div className="space-y-4 text-xs">
                  {/* Prime Office Rents */}
                  <div className="space-y-2">
                    <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-700" />
                      <span>Prime Grade-A Commercial Office Rent</span>
                    </h3>

                    {activeCity.officeOperatingCost ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-base font-mono">
                            {activeCity.officeOperatingCost.primeGradeARent}
                          </span>
                          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
                            {activeCity.officeOperatingCost.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <strong className="text-slate-700">Source: </strong>
                          {activeCity.officeOperatingCost.sourceName} (Verified: {activeCity.officeOperatingCost.dateChecked})
                        </div>
                        <div className="text-[11px] text-slate-500 italic">
                          <strong>Limitations: </strong>
                          {activeCity.officeOperatingCost.limitations}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-500 italic">Data unavailable.</div>
                    )}
                  </div>

                  {/* State Incentives Policy */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                      <span>State IT & GCC Policy Framework</span>
                    </h3>

                    {activeCity.stateIncentivesPolicy ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {activeCity.stateIncentivesPolicy.policyName}
                          </span>
                          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[10px] font-semibold">
                            {activeCity.stateIncentivesPolicy.status}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {activeCity.stateIncentivesPolicy.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60">
                          <strong className="text-slate-700">Source: </strong>
                          {activeCity.stateIncentivesPolicy.sourceName}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-500 italic">Data unavailable.</div>
                    )}
                  </div>

                  {/* Service Providers */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-700" />
                      <span>Ecosystem Service Providers</span>
                    </h3>

                    {activeCity.serviceProviders ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {activeCity.serviceProviders.identifiedProviders.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-800 font-medium"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <strong>Notes: </strong>{activeCity.serviceProviders.limitations}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-500 italic">Data unavailable.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: EVIDENCE & AUDIT */}
              {activeTab === 'evidence' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Epistemic Audit & Caveats for {activeCity.name}:</span>
                    </div>
                    <p className="text-amber-950 leading-relaxed">
                      {activeCity.caveats}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                      Verified Empirical Citations for {activeCity.name} ({cityRelevantEvidence.length})
                    </div>

                    {cityRelevantEvidence.length > 0 ? (
                      <div className="space-y-2.5">
                        {cityRelevantEvidence.map((ev) => (
                          <div key={ev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                            <div className="font-semibold text-slate-900">{ev.claim}</div>
                            {ev.metricValue && (
                              <div className="text-xs font-mono font-bold text-emerald-800">
                                Benchmark: {ev.metricValue}
                              </div>
                            )}
                            <div className="text-[11px] text-slate-600">
                              <strong className="text-slate-700">Source: </strong>{ev.sourceName} ({ev.publicationDate})
                            </div>
                            <div className="text-[11px] text-slate-500 italic">
                              <strong>Reporting Limitations: </strong>{ev.limitations}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl text-slate-500 italic text-center">
                        No dedicated micro-study currently in the Evidence Base for {activeCity.name}. Requires localized talent mapping sprint.
                      </div>
                    )}
                  </div>

                  {/* Contextual Pan-India Citations */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                      Pan-India Macro Context ({panIndiaEvidence.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {panIndiaEvidence.slice(0, 4).map((ev) => (
                        <div key={ev.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-0.5">
                          <span className="font-semibold text-slate-900 line-clamp-1">{ev.claim}</span>
                          <span className="text-slate-500 text-[10px] block">{ev.sourceName} ({ev.publicationDate})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON MODAL / EXPANDED SECTION */}
      {isComparisonOpen && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 shadow-md space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Side-by-Side City Comparison Matrix
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
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Reset Default Pair
              </button>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>

          {/* City Selection Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-1">Include Hubs:</span>
            {cities.map((city) => {
              const active = comparisonCityIds.includes(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => toggleComparisonCity(city.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 w-48 font-bold">Metric / Indicator</th>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <th key={id} className="p-3.5 min-w-[200px]">
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
                {/* Coordinates */}
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

                {/* Direct GCC Workforce */}
                <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
                  <td className="p-3.5 font-semibold text-emerald-800 bg-emerald-50/30">Direct GCC Workforce</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono font-bold text-emerald-950">
                        {c?.workforceBreakdown?.directGccHeadcount || 'Data unavailable'}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Tech Sector */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Total IT / Tech Sector</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono font-medium">
                        {c?.workforceBreakdown?.totalTechSectorHeadcount || c?.estimatedTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* Senior Talent */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Senior Talent Pool (6+y)</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-mono">
                        {c?.workforceBreakdown?.seniorTalentPool || c?.estimatedSeniorTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* GCC Companies Cataloged */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">Cataloged GCC Companies</td>
                  {comparisonCityIds.map((id) => {
                    const count = GCC_COMPANIES.filter((comp) => comp.cityId === id).length;
                    return (
                      <td key={id} className="p-3.5 font-mono">
                        {count} facilities cataloged
                      </td>
                    );
                  })}
                </tr>

                {/* Voluntary Attrition */}
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

                {/* Notice Period */}
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

                {/* Prime Office Rent */}
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

                {/* State Policy */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/30">State Policy Framework</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5">
                        <div className="font-semibold text-slate-900">
                          {c?.stateIncentivesPolicy?.policyName || 'Data unavailable'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Action Transfer */}
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-semibold text-slate-600">Transfer Action</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <td key={id} className="p-3.5">
                        <button
                          onClick={() => handleTransferToPlanBuilder(c.id)}
                          className="w-full px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Use in Builder</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <strong className="text-slate-700">Comparative Methodological Disclosure: </strong>
            Figures reflect data compiled from respective state IT policies, real estate IPC benchmarks (CBRE / Cushman & Wakefield 2024), and NASSCOM GCC council reports. Reporting dates and definitions may vary between state agencies. GCC Compass does not construct artificial composite index scores or algorithmic rankings.
          </div>
        </div>
      )}
    </div>
  );
};
