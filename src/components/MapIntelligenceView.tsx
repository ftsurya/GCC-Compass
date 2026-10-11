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
  ChevronDown,
  ChevronUp,
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

  // Sidebar Data Availability Filters (Preserved exactly for regression tests)
  const [filterVerifiedIncentives, setFilterVerifiedIncentives] = useState<boolean>(false);
  const [filterDirectGccWorkforce, setFilterDirectGccWorkforce] = useState<boolean>(false);
  const [filterOfficeCostBenchmarks, setFilterOfficeCostBenchmarks] = useState<boolean>(false);
  const [filterEmpiricalEvidence, setFilterEmpiricalEvidence] = useState<boolean>(false);

  // Map view engine toggle: Leaflet Tile Map vs Vector Geographic Map
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'vector'>('leaflet');
  const [tileLoadError, setTileLoadError] = useState<boolean>(false);

  // Transfer feedback toast
  const [transferToast, setTransferToast] = useState<string | null>(null);

  // Dedicated floating legend panel expanded / collapsed toggle
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

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

  // Real-time marker count breakdown for floating legend panel
  const verifiedPolicyCount = useMemo(
    () =>
      filteredCities.filter(
        (c) =>
          c.stateIncentivesPolicy?.status === 'verified_fact' ||
          c.stateIncentivesPolicy?.status === 'company_announcement'
      ).length,
    [filteredCities]
  );

  const requiresVerificationCount = useMemo(
    () =>
      filteredCities.filter(
        (c) =>
          !c.stateIncentivesPolicy ||
          (c.stateIncentivesPolicy.status !== 'verified_fact' &&
            c.stateIncentivesPolicy.status !== 'company_announcement')
      ).length,
    [filteredCities]
  );

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
    setTransferToast(`Selected ${target.name} for Plan Builder assessment`);
    setTimeout(() => {
      setTransferToast(null);
    }, 4500);
  };

  // Toggle city in comparison set
  const toggleComparisonCity = (cityId: string) => {
    if (comparisonCityIds.includes(cityId)) {
      if (comparisonCityIds.length > 1) {
        setComparisonCityIds(comparisonCityIds.filter((id) => id !== cityId));
      }
    } else {
      if (comparisonCityIds.length < 6) {
        setComparisonCityIds([...comparisonCityIds, cityId]);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Leaflet Map Initialization and Marker Management
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    if (!mapContainerRef.current) return;

    if (!leafletMapInstanceRef.current) {
      try {
        const initialCenter: [number, number] = [17.5, 78.5]; // Central India
        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 5,
          minZoom: 4,
          maxZoom: 12,
          zoomControl: false,
        });

        // NeoBrutalism custom zoom control in top right
        L.control.zoom({ position: 'topright' }).addTo(map);

        // OpenStreetMap public tile layer with fallback handler
        const tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
          }
        );

        tileLayer.on('tileerror', () => {
          setTileLoadError(true);
        });

        tileLayer.addTo(map);
        leafletMapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet initialization failed, falling back to Vector view', err);
        setMapEngine('vector');
        return;
      }
    }

    const map = leafletMapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Render city markers strictly from filteredCities
    filteredCities.forEach((city) => {
      if (!city.coordinates) return;

      const isSelected = city.id === activeCityId;
      const isCompared = comparisonCityIds.includes(city.id);
      const isTier1 = city.tier === 'Tier-1';
      const hasVerifiedPolicy =
        city.stateIncentivesPolicy &&
        (city.stateIncentivesPolicy.status === 'verified_fact' ||
          city.stateIncentivesPolicy.status === 'company_announcement');

      // NeoBrutalist badge marker with status indicator dot
      const bgCol = isSelected ? '#FFE500' : isTier1 ? '#00F0A8' : '#FFFFFF';
      const textCol = '#000000';
      const statusDotColor = hasVerifiedPolicy ? '#00F0A8' : '#F59E0B';
      const statusTitle = hasVerifiedPolicy ? 'Verified Policy' : 'Requires Verification';

      const markerHtml = `
        <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; user-select: none;">
          <div class="marker-discovery-cue" title="Click to inspect ${city.name} talent and companies" style="background: ${bgCol}; color: ${textCol}; border: 2.5px solid #000000; box-shadow: 3px 3px 0px 0px #000000; padding: 2px 7px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; text-transform: uppercase; white-space: nowrap; letter-spacing: 0.04em; display: flex; align-items: center; gap: 5px;">
            <span>${city.name}</span>
            ${isCompared ? '<span style="color:#000;">★</span>' : ''}
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${statusDotColor}; border:1.5px solid #000000; box-shadow: 1px 1px 0px 0px #000000;" title="${statusTitle}"></span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #000000; margin-top: -1px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'brutal-map-marker',
        html: markerHtml,
        iconSize: [96, 34],
        iconAnchor: [48, 32],
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
      {/* Toast Alert in NeoBrutalist style */}
      {transferToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFE500] text-black px-4 py-3 border-3 border-black shadow-[5px_5px_0px_0px_#000] flex items-center gap-3 font-mono text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5] text-black shrink-0" />
          <span>{transferToast}</span>
          <button
            onClick={() => onNavigateToBuilder()}
            className="ml-2 px-3 py-1 bg-black text-[#FFE500] hover:bg-neutral-800 font-black text-[11px] uppercase border border-black transition-colors"
          >
            Open Plan Builder
          </button>
          <button
            onClick={() => setTransferToast(null)}
            className="text-black hover:bg-black hover:text-white px-1.5 py-0.5 border border-black font-bold ml-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Streamlined Flagship Header in Retro NeoBrutalism */}
      <div className="bg-[#FFFDF5] border-3 border-black p-3.5 sm:p-4.5 shadow-[5px_5px_0px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-black text-[#FFE500] px-1.5 py-0.2 font-mono text-[10px] font-black uppercase tracking-wider">
                MODULE 01
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                // LOCATION INTELLIGENCE & GCC ECOSYSTEM ATLAS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black uppercase font-display leading-tight">
              India GCC Hub Map Intelligence
            </h1>
            <p className="text-xs text-neutral-800 max-w-3xl leading-snug font-medium">
              Explore verified coordinates, multinational capability centers, talent depth benchmarks, prime office rents, and state incentive frameworks across supported hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-mono font-black uppercase tracking-wider border-2 border-black transition-all ${
                isComparisonOpen
                  ? 'bg-black text-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white hover:bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isComparisonOpen ? 'Close Matrix' : `Compare Cities (${comparisonCityIds.length})`}</span>
            </button>

            <button
              onClick={() => handleTransferToPlanBuilder(activeCity.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs font-mono font-black uppercase tracking-wider bg-[#FFE500] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFD000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
              title="Use selected city in Plan Builder"
            >
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Use {activeCity.name} in Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Engine and Metros Disclosure Bar */}
        <div className="mt-3 pt-2.5 border-t-2 border-black flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-black uppercase text-black text-[11px]">MAP ENGINE:</span>
            <div className="inline-flex border-2 border-black bg-white p-0.5 text-xs font-bold">
              <button
                onClick={() => setMapEngine('leaflet')}
                className={`px-2.5 py-0.5 text-[11px] transition-colors uppercase ${
                  mapEngine === 'leaflet'
                    ? 'bg-black text-[#FFE500]'
                    : 'text-black hover:bg-neutral-100'
                }`}
              >
                Tile Map (Leaflet)
              </button>
              <button
                onClick={() => setMapEngine('vector')}
                className={`px-2.5 py-0.5 text-[11px] transition-colors uppercase ${
                  mapEngine === 'vector'
                    ? 'bg-black text-[#FFE500]'
                    : 'text-black hover:bg-neutral-100'
                }`}
              >
                Vector SVG Projection
              </button>
            </div>
            <span className="text-[11px] text-neutral-600 hidden sm:inline">
              {mapEngine === 'leaflet'
                ? '// Public OpenStreetMap tiles'
                : '// Vector geographic SVG coordinate projection'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#00F0A8] border border-black inline-block" />
              <span>Tier-1 Metros ({cities.filter((c) => c.tier === 'Tier-1').length})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white border border-black inline-block" />
              <span>Tier-2 Hubs ({cities.filter((c) => c.tier === 'Tier-2').length})</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#FFE500] px-2 py-0.5 border border-black">
              <span>SELECTED: <strong>{activeCity.name}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Flagship Spatial Research Workspace: 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR COLUMN (lg:col-span-3): Filters & Hub Directory */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#FFFDF5] border-3 border-black p-4 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 stroke-[2.5]" />
                <h3 className="font-black text-xs uppercase tracking-wider font-mono">
                  01 // HUB FILTERS
                </h3>
              </div>
              {hasActiveAvailabilityFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 transition-all"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-black absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hub or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none focus:bg-[#FFF9D2] shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            {/* Tier Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-black uppercase tracking-wider block font-mono">
                Metro Tier Classification
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black border border-black text-xs font-mono font-bold">
                <button
                  onClick={() => setTierFilter('all')}
                  className={`py-1 text-center transition-colors uppercase ${
                    tierFilter === 'all'
                      ? 'bg-[#FFE500] text-black font-black'
                      : 'text-white hover:text-[#FFE500]'
                  }`}
                >
                  All ({cities.length})
                </button>
                <button
                  onClick={() => setTierFilter('Tier-1')}
                  className={`py-1 text-center transition-colors uppercase ${
                    tierFilter === 'Tier-1'
                      ? 'bg-[#00F0A8] text-black font-black'
                      : 'text-white hover:text-[#00F0A8]'
                  }`}
                >
                  Tier-1
                </button>
                <button
                  onClick={() => setTierFilter('Tier-2')}
                  className={`py-1 text-center transition-colors uppercase ${
                    tierFilter === 'Tier-2'
                      ? 'bg-white text-black font-black'
                      : 'text-white hover:text-white'
                  }`}
                >
                  Tier-2
                </button>
              </div>
            </div>

            {/* Sidebar Data Availability Filter (User Request #3) */}
            <div className="space-y-2 pt-3 border-t-2 border-black">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider block font-mono">
                  Data Availability Toggles
                </span>
                <span className="text-[10px] font-bold bg-black text-white px-1 font-mono">FILTER</span>
              </div>
              <p className="text-[11px] text-neutral-700 leading-tight font-medium">
                Filter map markers to show only hubs with verified records:
              </p>

              <div className="space-y-2 text-xs font-mono">
                {/* 1. Verified Incentive Policies */}
                <label className="flex items-start gap-2.5 p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#FFF9D2] transition-colors">
                  <input
                    type="checkbox"
                    checked={filterVerifiedIncentives}
                    onChange={(e) => setFilterVerifiedIncentives(e.target.checked)}
                    className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-black flex items-center justify-between">
                      <span className="text-[11px]">Verified Policy Framework</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 bg-[#00F0A8] text-black border border-black">
                        {
                          cities.filter(
                            (c) =>
                              c.stateIncentivesPolicy?.status === 'verified_fact' ||
                              c.stateIncentivesPolicy?.status === 'company_announcement'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                      Gazetted state IT / GCC policy
                    </div>
                  </div>
                </label>

                {/* 2. Direct GCC Workforce Data */}
                <label className="flex items-start gap-2.5 p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#FFF9D2] transition-colors">
                  <input
                    type="checkbox"
                    checked={filterDirectGccWorkforce}
                    onChange={(e) => setFilterDirectGccWorkforce(e.target.checked)}
                    className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-black flex items-center justify-between">
                      <span className="text-[11px]">Direct GCC Workforce</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 bg-[#FFE500] text-black border border-black">
                        {
                          cities.filter(
                            (c) =>
                              c.workforceBreakdown?.directGccHeadcount &&
                              c.workforceBreakdown.directGccHeadcount !== 'Data unavailable'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                      Explicit GCC talent headcount
                    </div>
                  </div>
                </label>

                {/* 3. Office Operating Cost Benchmarks */}
                <label className="flex items-start gap-2.5 p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#FFF9D2] transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOfficeCostBenchmarks}
                    onChange={(e) => setFilterOfficeCostBenchmarks(e.target.checked)}
                    className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-black flex items-center justify-between">
                      <span className="text-[11px]">Prime Office Rent</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 bg-white text-black border border-black">
                        {
                          cities.filter(
                            (c) =>
                              c.officeOperatingCost?.primeGradeARent &&
                              c.officeOperatingCost.primeGradeARent !== 'Data unavailable'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                      Commercial Grade-A IPC rates
                    </div>
                  </div>
                </label>

                {/* 4. Empirical Evidence Base */}
                <label className="flex items-start gap-2.5 p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#FFF9D2] transition-colors">
                  <input
                    type="checkbox"
                    checked={filterEmpiricalEvidence}
                    onChange={(e) => setFilterEmpiricalEvidence(e.target.checked)}
                    className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-black flex items-center justify-between">
                      <span className="text-[11px]">Empirical Evidence</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 bg-[#00F0A8] text-black border border-black">
                        {cities.filter((c) => c.evidenceItemIds && c.evidenceItemIds.length > 0).length}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                      Linked audit citations
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Matching Hubs Counter */}
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono font-bold">
              <span>ACTIVE MARKERS:</span>
              <span className="bg-black text-[#FFE500] px-2 py-0.5">
                {filteredCities.length} / {cities.length} HUBS
              </span>
            </div>
          </div>

          {/* Quick Hub Navigator List */}
          <div className="bg-[#FFFDF5] border-3 border-black p-3.5 shadow-[5px_5px_0px_0px_#000] space-y-2">
            <div className="px-1 py-1 text-xs font-black uppercase tracking-wider font-mono">
              02 // HUBS DIRECTORY
            </div>
            {filteredCities.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono space-y-2 border-2 border-dashed border-black">
                <p className="font-bold">No hubs match criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1 bg-[#FFE500] text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const isSelected = city.id === activeCityId;
                  const isCompared = comparisonCityIds.includes(city.id);
                  const companyCount = GCC_COMPANIES.filter((c) => c.cityId === city.id).length;

                  return (
                    <div
                      key={city.id}
                      onClick={() => setActiveCityId(city.id)}
                      className={`p-2.5 border-2 border-black cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                        isSelected
                          ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                          : 'bg-white hover:bg-[#FFF9D2] text-black shadow-[2px_2px_0px_0px_#000]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs uppercase tracking-tight truncate font-display">
                            {city.name}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1 border border-black uppercase ${
                              city.tier === 'Tier-1' ? 'bg-[#00F0A8]' : 'bg-white'
                            }`}
                          >
                            {city.tier}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-neutral-700 truncate mt-0.5">
                          {city.state} · {companyCount} GCCs
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparisonCity(city.id);
                          }}
                          className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black transition-colors ${
                            isCompared
                              ? 'bg-black text-[#FFE500]'
                              : 'bg-white text-black hover:bg-neutral-100'
                          }`}
                          title="Toggle in comparison matrix"
                        >
                          {isCompared ? '✓ COMP' : '+ COMP'}
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
          <div className="bg-[#121212] border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
            {filteredCities.length === 0 ? (
              <div className="p-8 text-center text-white space-y-3 z-20 font-mono">
                <FilterX className="w-8 h-8 text-[#FFE500] mx-auto stroke-[2.5]" />
                <h4 className="text-base font-black uppercase">No Hubs Match Selected Criteria</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Uncheck one of the data availability toggles in the sidebar to reveal locations on the map.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#FFE500] text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_#fff]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : mapEngine === 'leaflet' && !tileLoadError ? (
              <div className="relative w-full h-full">
                <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-[#FAF7EE] text-black px-2.5 py-1 border-2 border-black font-mono text-[10px] sm:text-[11px] font-bold shadow-[2px_2px_0px_0px_#000]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00F0A8] border border-black motion-safe:animate-pulse shrink-0" />
                  <span>INTERACTIVE MAP // CLICK CITY PINS TO DRILL DOWN</span>
                </div>
                <div
                  ref={mapContainerRef}
                  className="w-full h-full min-h-[460px] sm:min-h-[500px] z-10"
                  style={{ background: '#0f172a' }}
                />
              </div>
            ) : (
              /* Vector Geographic SVG Projection Fallback */
              <div className="relative w-full h-full p-4 flex flex-col items-center justify-center select-none bg-[#0d131f] text-white min-h-[460px] sm:min-h-[500px] bg-blueprint-grid">
                <div className="absolute top-4 left-4 z-20 bg-black border-2 border-[#FFE500] px-3 py-1 text-xs font-mono font-bold text-[#FFE500] shadow-[3px_3px_0px_0px_#000]">
                  VECTOR GEOGRAPHIC PROJECTION // VERIFIED COORDINATES
                </div>

                <svg
                  viewBox="0 0 600 650"
                  className="w-full max-w-[480px] h-auto drop-shadow-2xl"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4">
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
                    fill="#1e293b"
                    stroke="#FFE500"
                    strokeWidth="2.5"
                  />

                  <text x="80" y="440" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">ARABIAN SEA</text>
                  <text x="440" y="440" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">BAY OF BENGAL</text>
                  <text x="240" y="620" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">INDIAN OCEAN</text>

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
                    const hasVerifiedPolicy =
                      city.stateIncentivesPolicy &&
                      (city.stateIncentivesPolicy.status === 'verified_fact' ||
                        city.stateIncentivesPolicy.status === 'company_announcement');

                    return (
                      <g
                        key={city.id}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setActiveCityId(city.id)}
                        className="cursor-pointer group"
                      >
                        {isSelected && (
                          <circle
                            r="22"
                            fill="none"
                            stroke="#FFE500"
                            strokeWidth="2"
                            className="animate-ping origin-center opacity-75"
                          />
                        )}

                        <circle
                          r={isSelected ? '14' : '10'}
                          fill={isSelected ? '#FFE500' : isTier1 ? '#00F0A8' : '#FFFFFF'}
                          stroke="#000000"
                          strokeWidth="2.5"
                          className="transition-all duration-150 group-hover:scale-125"
                        />

                        <circle
                          r="4"
                          fill="#000000"
                        />

                        {/* Status indicator pip */}
                        <circle
                          cx="9"
                          cy="-9"
                          r="4.5"
                          fill={hasVerifiedPolicy ? '#00F0A8' : '#F59E0B'}
                          stroke="#000000"
                          strokeWidth="1.5"
                        />

                        <title>{`${city.name} (${city.tier}) - ${hasVerifiedPolicy ? 'Verified Policy' : 'Requires Verification'}`}</title>

                        <text
                          y={isSelected ? '-20' : '22'}
                          textAnchor="middle"
                          fill={isSelected ? '#FFE500' : '#ffffff'}
                          fontSize={isSelected ? '12' : '11'}
                          fontFamily="JetBrains Mono"
                          fontWeight="bold"
                          stroke="#000000"
                          strokeWidth="2.5"
                          paintOrder="stroke"
                          className="select-none uppercase"
                        >
                          {city.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-3 text-[11px] font-mono text-neutral-300 bg-black/90 px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#FFE500]">
                  <span>CLICK PIN TO DRILL DOWN</span>
                  <button
                    onClick={() => setMapEngine('leaflet')}
                    className="text-[#FFE500] hover:underline font-bold"
                  >
                    OSM TILES →
                  </button>
                </div>
              </div>
            )}

            {/* DEDICATED FLOATING LEGEND PANEL (Retro NeoBrutalism Marker Status & Classification Key) */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-30 max-w-[calc(100%-24px)] sm:max-w-xs md:max-w-sm pointer-events-auto">
              {isLegendExpanded ? (
                <div className="bg-[#FFFDF5] border-3 border-black shadow-[5px_5px_0px_0px_#000] p-3 sm:p-3.5 space-y-3 font-mono text-xs text-black">
                  {/* Header with Title & Collapse Toggle */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-black">
                    <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] sm:text-xs">
                      <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>MARKER STATUS LEGEND</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-black text-[#FFE500] px-1.5 py-0.2 text-[10px] font-bold uppercase">
                        LIVE KEY
                      </span>
                      <button
                        onClick={() => setIsLegendExpanded(false)}
                        className="p-1 bg-white hover:bg-black hover:text-[#FFE500] border border-black shadow-[1px_1px_0px_0px_#000] transition-colors cursor-pointer"
                        title="Collapse Legend"
                        aria-label="Collapse Legend"
                      >
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Marker Status Section: Verified Policy vs Requires Verification */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-700 tracking-wider">
                      <span>// POLICY VERIFICATION PIN</span>
                      <span>MARKER DOT</span>
                    </div>

                    {/* Verified Policy Status Card */}
                    <div
                      onClick={() => setFilterVerifiedIncentives((prev) => !prev)}
                      className={`p-2 border-2 border-black transition-all cursor-pointer ${
                        filterVerifiedIncentives
                          ? 'bg-[#E6FFF7] ring-2 ring-black'
                          : 'bg-white hover:bg-[#F3FFF9]'
                      } shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5`}
                      title="Click to toggle Verified Policy filter"
                    >
                      <div className="mt-0.5 shrink-0 flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-[#00F0A8] border-1.5 border-black inline-block shadow-[1px_1px_0px_0px_#000]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between font-black text-[11px] leading-tight">
                          <span className="text-black uppercase flex items-center gap-1">
                            Verified Policy
                            {filterVerifiedIncentives && (
                              <span className="text-[9px] bg-black text-[#00F0A8] px-1 font-mono">
                                ACTIVE
                              </span>
                            )}
                          </span>
                          <span className="px-1.5 py-0.2 bg-[#00F0A8] text-black border border-black text-[9px] font-black">
                            {verifiedPolicyCount} HUBS
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-700 leading-tight mt-0.5 font-sans font-medium">
                          Gazetted state IT / GCC policy with enacted fiscal subsidies & capital incentive terms.
                        </p>
                      </div>
                    </div>

                    {/* Requires Verification Status Card */}
                    <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0 flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-[#F59E0B] border-1.5 border-black inline-block shadow-[1px_1px_0px_0px_#000]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between font-black text-[11px] leading-tight">
                          <span className="text-black uppercase">Requires Verification</span>
                          <span className="px-1.5 py-0.2 bg-[#F59E0B] text-black border border-black text-[9px] font-black">
                            {requiresVerificationCount} HUBS
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-700 leading-tight mt-0.5 font-sans font-medium">
                          Policy framework undergoing gazette notification or claims requiring primary validation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marker Classification & Selection Visuals */}
                  <div className="space-y-1.5 pt-2 border-t-2 border-black">
                    <div className="text-[10px] font-black uppercase text-neutral-700 tracking-wider">
                      // MARKER FILL & SELECTION
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="p-1.5 bg-white border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#00F0A8] border border-black shrink-0" />
                        <div className="truncate">
                          <strong className="block font-black uppercase text-[10px]">Tier-1 Metro</strong>
                          <span className="text-neutral-600 font-sans text-[9px]">Established mega-hub</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-white border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-white border border-black shrink-0" />
                        <div className="truncate">
                          <strong className="block font-black uppercase text-[10px]">Tier-2 Hub</strong>
                          <span className="text-neutral-600 font-sans text-[9px]">Emerging captive</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-white border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#FFE500] border border-black shrink-0" />
                        <div className="truncate">
                          <strong className="block font-black uppercase text-[10px]">Active Hub</strong>
                          <span className="text-neutral-600 font-sans text-[9px]">Under inspection</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-white border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1.5">
                        <span className="font-bold text-black shrink-0 text-xs">★</span>
                        <div className="truncate">
                          <strong className="block font-black uppercase text-[10px]">Compared Hub</strong>
                          <span className="text-neutral-600 font-sans text-[9px]">Side-by-side active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLegendExpanded(true)}
                  className="bg-[#FFE500] text-black border-2 border-black font-mono font-black text-xs px-3 py-1.5 shadow-[4px_4px_0px_0px_#000] flex items-center gap-2 hover:bg-white transition-all uppercase cursor-pointer"
                  title="Expand Marker Status Legend"
                >
                  <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Marker Status Legend</span>
                  <span className="w-2 h-2 rounded-full bg-[#00F0A8] border border-black inline-block" />
                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>

          {/* DETAILED CITY INTELLIGENCE PANEL IN RETRO NEOBRUTALISM */}
          <div className="bg-[#FFFDF5] border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            {/* Panel Top Banner */}
            <div className="p-5 sm:p-6 border-b-3 border-black bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-display">
                      {activeCity.name}
                    </h2>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 border-2 border-black uppercase ${
                        activeCity.tier === 'Tier-1'
                          ? 'bg-[#00F0A8] text-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-white text-black shadow-[2px_2px_0px_0px_#000]'
                      }`}
                    >
                      {activeCity.tier}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FFE500] text-black border border-black uppercase">
                      STATUS: {activeCity.evidenceStatus}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-neutral-800 mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="font-bold">{activeCity.state}, INDIA</span>
                    <span>//</span>
                    <span className="bg-black text-[#00F0A8] px-1.5 py-0.2 text-[11px]">
                      {activeCity.coordinates?.latitude.toFixed(4)}°N, {activeCity.coordinates?.longitude.toFixed(4)}°E
                    </span>
                    {activeCity.workforceBreakdown?.directGccHeadcount && (
                      <>
                        <span>//</span>
                        <span className="font-bold bg-[#FFE500] text-black px-1.5 py-0.2 border border-black">
                          {activeCity.workforceBreakdown.directGccHeadcount} DIRECT GCC TALENT
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => toggleComparisonCity(activeCity.id)}
                    className={`px-3 py-2 text-xs font-mono font-black uppercase border-2 border-black transition-all ${
                      comparisonCityIds.includes(activeCity.id)
                        ? 'bg-black text-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white hover:bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                    }`}
                  >
                    {comparisonCityIds.includes(activeCity.id) ? '✓ COMPARED' : '+ COMPARE HUB'}
                  </button>

                  <button
                    onClick={() => handleTransferToPlanBuilder(activeCity.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider bg-[#FFE500] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all"
                  >
                    <Sliders className="w-4 h-4 stroke-[2.5]" />
                    <span>Select for Plan Builder</span>
                  </button>
                </div>
              </div>

              {/* Tabbed Navigation */}
              <div className="flex items-center gap-2 pt-3 border-t-2 border-black overflow-x-auto">
                <button
                  onClick={() => {
                    setActiveTab('companies');
                    setSelectedCompanyId(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono font-black uppercase border-2 border-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'companies'
                      ? 'bg-black text-[#FFE500] shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Multinational Directory ({activeCityCompanies.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('workforce')}
                  className={`px-3.5 py-2 text-xs font-mono font-black uppercase border-2 border-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'workforce'
                      ? 'bg-black text-[#FFE500] shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Workforce & Talent Pool</span>
                </button>
                <button
                  onClick={() => setActiveTab('economics')}
                  className={`px-3.5 py-2 text-xs font-mono font-black uppercase border-2 border-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'economics'
                      ? 'bg-black text-[#FFE500] shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Rents & Incentives</span>
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-3.5 py-2 text-xs font-mono font-black uppercase border-2 border-black transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'evidence'
                      ? 'bg-black text-[#FFE500] shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
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
                      <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                        <button
                          onClick={() => setSelectedCompanyId(null)}
                          className="text-xs font-mono font-black uppercase text-black flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE500] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFD000] transition-all"
                        >
                          ← Back to {activeCity.name} Directory
                        </button>
                        <span className="text-xs font-mono font-bold bg-black text-[#00F0A8] px-2 py-0.5">
                          INSPECTING FACILITY RECORD
                        </span>
                      </div>

                      <div className="bg-white p-5 border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-black pb-3">
                          <div>
                            <h3 className="text-xl font-black text-black uppercase font-display">
                              {activeCompany.name}
                            </h3>
                            <div className="text-xs font-mono text-neutral-700 mt-1">
                              PARENT: <strong className="text-black">{activeCompany.parentCompany}</strong> // GLOBAL HQ: {activeCompany.headquarters}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 items-start sm:items-end">
                            <span className="px-3 py-1 bg-[#00F0A8] border-2 border-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                              {activeCompany.primarySector}
                            </span>
                            <span className="px-2 py-0.5 bg-black text-[#FFE500] border border-black font-mono text-[10px] font-bold uppercase">
                              {activeCompany.companyClassification}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                          <div className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            <span className="text-[10px] text-neutral-600 uppercase font-black block">Facility Campus</span>
                            <span className="font-bold text-black mt-0.5 block">{activeCompany.facilityLocation}</span>
                          </div>
                          <div className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            <span className="text-[10px] text-neutral-600 uppercase font-black block">Established In</span>
                            <span className="font-bold text-black mt-0.5 block">{activeCompany.establishedYear || 'Established'}</span>
                          </div>
                          <div className="p-3 bg-[#FFE500] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            <span className="text-[10px] text-black uppercase font-black block">Local Headcount</span>
                            <span className="font-black text-black text-base mt-0.5 block">
                              {activeCompany.workforce.localHeadcount}
                            </span>
                          </div>
                        </div>

                        {/* Company Workforce Scope & Caveat */}
                        <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-black font-black uppercase">Verification Source:</strong>
                            <span className="text-[10px] font-black px-2 py-0.5 bg-black text-[#FFE500] uppercase">
                              {activeCompany.workforce.headcountType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-neutral-800">
                            {activeCompany.workforce.sourceName} (Verified: {activeCompany.workforce.dateChecked})
                          </div>
                          <div className="text-neutral-700 italic text-[11px] pt-1 border-t border-neutral-300">
                            <strong>Reporting Scope: </strong>{activeCompany.workforce.limitations}
                          </div>
                        </div>

                        {/* Mandated Functions */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-black uppercase tracking-wider font-mono block">
                            Mandated Business Functions Delivered from Hub
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {activeCompany.businessFunctions.map((fn, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-mono px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold"
                              >
                                {fn}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stacks */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-black uppercase tracking-wider font-mono block">
                            Core Technology Stacks & Domains
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {activeCompany.specialisations.map((spec, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-mono px-3 py-1 bg-black text-[#FFE500] font-bold"
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border-2 border-black">
                        <p className="text-xs font-medium text-neutral-800 leading-relaxed max-w-xl">
                          {activeCity.techEcosystemSummary}
                        </p>

                        {/* Sector Filter within City */}
                        {citySectors.length > 1 && (
                          <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                            <span className="font-bold">SECTOR:</span>
                            <select
                              value={companySectorFilter}
                              onChange={(e) => setCompanySectorFilter(e.target.value)}
                              className="px-2.5 py-1 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                            >
                              <option value="all">ALL SECTORS ({activeCityCompanies.length})</option>
                              {citySectors.map((sec) => (
                                <option key={sec} value={sec}>{sec.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {filteredCityCompanies.map((comp) => (
                          <div
                            key={comp.id}
                            onClick={() => setSelectedCompanyId(comp.id)}
                            className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer transition-all flex flex-col justify-between gap-2.5 group"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-black text-sm text-black uppercase font-display group-hover:text-[#FF5A36] transition-colors">
                                    {comp.name}
                                  </div>
                                  <div className="text-[11px] font-mono text-neutral-600 mt-0.5 truncate">
                                    {comp.primarySector} · {comp.facilityLocation}
                                  </div>
                                  <div className="mt-1">
                                    <span className={`inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border border-black ${
                                      comp.companyClassification === 'Verified captive/global capability centre'
                                        ? 'bg-[#00F0A8] text-black'
                                        : comp.companyClassification === 'Software/product company'
                                        ? 'bg-[#FFE500] text-black'
                                        : 'bg-neutral-100 text-neutral-800'
                                    }`}>
                                      {comp.companyClassification}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-black bg-[#FFE500] px-2 py-0.5 border border-black shrink-0">
                                  {comp.workforce.localHeadcount}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {comp.specialisations.slice(0, 3).map((spec, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#FAF7EE] border border-black text-black"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs font-mono">
                              <span className="text-neutral-600 truncate max-w-[180px]">
                                {comp.parentCompany}
                              </span>
                              <span className="font-black text-black bg-[#00F0A8] px-2 py-0.5 border border-black group-hover:bg-[#FFE500] transition-colors flex items-center gap-1">
                                VIEW PROFILE →
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
                    <div className="p-4 bg-[#00F0A8] border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-[10px] text-black uppercase font-black block">
                        Direct GCC Workforce Headcount
                      </span>
                      <div className="font-black text-black mt-1 text-xl">
                        {activeCity.workforceBreakdown?.directGccHeadcount || 'Data unavailable'}
                      </div>
                      <div className="text-[11px] text-black mt-1 font-bold">
                        Source: {activeCity.workforceBreakdown?.directGccSource || 'Requires verification'}
                      </div>
                      <div className="text-[10px] text-neutral-800 mt-0.5 italic">
                        Scope: {activeCity.workforceBreakdown?.geographicScope}
                      </div>
                    </div>

                    <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-[10px] text-neutral-600 uppercase font-black block">
                        Total IT & Tech Services Sector
                      </span>
                      <div className="font-black text-black mt-1 text-xl">
                        {activeCity.workforceBreakdown?.totalTechSectorHeadcount || activeCity.estimatedTechTalentPool}
                      </div>
                      <div className="text-[11px] text-neutral-700 mt-1 font-bold">
                        Source: {activeCity.workforceBreakdown?.totalTechSectorSource || 'State IT Reports'}
                      </div>
                      <div className="text-[10px] text-neutral-600 mt-0.5">
                        Broader IT/BPM ecosystem headcount
                      </div>
                    </div>

                    <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-[10px] text-neutral-600 uppercase font-black block">
                        Senior Engineering Talent Pool (6+ Years)
                      </span>
                      <div className="font-black text-black mt-1 text-xl">
                        {activeCity.workforceBreakdown?.seniorTalentPool || activeCity.estimatedSeniorTechTalentPool}
                      </div>
                      <div className="text-[11px] text-neutral-700 mt-1">
                        Principal engineers, architects, tech leads
                      </div>
                    </div>

                    <div className="p-4 bg-[#FFE500] border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-[10px] text-black uppercase font-black block">
                        Voluntary Attrition & Notice Lag
                      </span>
                      <div className="font-black text-black mt-1 text-xl">
                        {activeCity.typicalOfferDropoutRate}% Attrition · {activeCity.averageNoticePeriodDays}d Notice
                      </div>
                      <div className="text-[11px] text-black mt-1 font-bold">
                        Standard recruitment friction assumptions
                      </div>
                    </div>
                  </div>

                  {activeCity.workforceBreakdown && (
                    <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-mono space-y-2">
                      <div>
                        <strong className="text-black uppercase">Geographic Reporting Scope: </strong>
                        <span className="text-neutral-800">{activeCity.workforceBreakdown.geographicScope} ({activeCity.workforceBreakdown.dateChecked})</span>
                      </div>
                      <div className="text-neutral-800 leading-relaxed">
                        <strong className="text-black uppercase">Methodological Notes: </strong>
                        {activeCity.workforceBreakdown.definitionNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: OPERATING ECONOMICS & INCENTIVES */}
              {activeTab === 'economics' && (
                <div className="space-y-4 text-xs font-mono">
                  {/* Prime Office Rents */}
                  <div className="space-y-2">
                    <h3 className="font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 stroke-[2.5]" />
                      <span>Prime Grade-A Commercial Office Rent</span>
                    </h3>

                    {activeCity.officeOperatingCost ? (
                      <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black text-xl">
                            {activeCity.officeOperatingCost.primeGradeARent}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#FFE500] border border-black text-[11px] font-black uppercase">
                            {activeCity.officeOperatingCost.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-800">
                          <strong className="text-black uppercase">Source: </strong>
                          {activeCity.officeOperatingCost.sourceName} (Verified: {activeCity.officeOperatingCost.dateChecked})
                        </div>
                        <div className="text-[11px] text-neutral-600 italic">
                          <strong>Limitations: </strong>
                          {activeCity.officeOperatingCost.limitations}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-black text-neutral-500 italic">Data unavailable.</div>
                    )}
                  </div>

                  {/* State Incentives Policy */}
                  <div className="space-y-2 pt-2 border-t-2 border-black">
                    <h3 className="font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>State IT & GCC Policy Framework</span>
                    </h3>

                    {activeCity.stateIncentivesPolicy ? (
                      <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black text-base uppercase">
                            {activeCity.stateIncentivesPolicy.policyName}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#00F0A8] border border-black text-black text-[10px] font-black uppercase">
                            {activeCity.stateIncentivesPolicy.status}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-neutral-800">
                          {activeCity.stateIncentivesPolicy.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                        <div className="pt-2 text-[11px] text-neutral-600 border-t border-neutral-300">
                          <strong className="text-black uppercase">Source: </strong>
                          {activeCity.stateIncentivesPolicy.sourceName}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-black text-neutral-500 italic">Data unavailable.</div>
                    )}
                  </div>

                  {/* Service Providers */}
                  <div className="space-y-2 pt-2 border-t-2 border-black">
                    <h3 className="font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 stroke-[2.5]" />
                      <span>Ecosystem Service Providers</span>
                    </h3>

                    {activeCity.serviceProviders ? (
                      <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {activeCity.serviceProviders.identifiedProviders.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#FAF7EE] border-2 border-black font-bold text-black"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-neutral-600 pt-1">
                          <strong>Notes: </strong>{activeCity.serviceProviders.limitations}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-black text-neutral-500 italic">Data unavailable.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: EVIDENCE & AUDIT */}
              {activeTab === 'evidence' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 bg-[#FFE500] border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-1.5 text-black">
                    <div className="flex items-center gap-2 font-black uppercase text-sm">
                      <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                      <span>Epistemic Audit & Caveats for {activeCity.name}:</span>
                    </div>
                    <p className="leading-relaxed font-bold">
                      {activeCity.caveats}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="font-black uppercase tracking-wider text-black text-xs">
                      Verified Empirical Citations for {activeCity.name} ({cityRelevantEvidence.length})
                    </div>

                    {cityRelevantEvidence.length > 0 ? (
                      <div className="space-y-3">
                        {cityRelevantEvidence.map((ev) => (
                          <div key={ev.id} className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                            <div className="font-bold text-black text-sm">{ev.claim}</div>
                            {ev.metricValue && (
                              <div className="text-xs font-black bg-[#00F0A8] px-2 py-0.5 border border-black inline-block">
                                BENCHMARK: {ev.metricValue}
                              </div>
                            )}
                            <div className="text-[11px] text-neutral-800">
                              <strong className="text-black uppercase">Source: </strong>{ev.sourceName} ({ev.publicationDate})
                            </div>
                            <div className="text-[11px] text-neutral-600 italic">
                              <strong>Reporting Limitations: </strong>{ev.limitations}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-white border-2 border-dashed border-black text-neutral-600 italic text-center font-bold">
                        No dedicated micro-study currently in the Evidence Base for {activeCity.name}. Requires localized talent mapping sprint.
                      </div>
                    )}
                  </div>

                  {/* Contextual Pan-India Citations */}
                  <div className="pt-3 border-t-2 border-black space-y-2">
                    <span className="font-black uppercase tracking-wider text-black text-xs block">
                      Pan-India Macro Context ({panIndiaEvidence.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {panIndiaEvidence.slice(0, 4).map((ev) => (
                        <div key={ev.id} className="p-3 bg-white border-2 border-black text-[11px] text-neutral-800 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                          <span className="font-bold text-black line-clamp-1">{ev.claim}</span>
                          <span className="text-neutral-600 text-[10px] block font-mono">{ev.sourceName} ({ev.publicationDate})</span>
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
        <div className="bg-[#FFFDF5] border-4 border-black p-6 sm:p-7 shadow-[8px_8px_0px_0px_#000] space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-5">
            <div>
              <div className="text-xs font-black uppercase tracking-wider bg-black text-[#FFE500] px-2 py-0.5 inline-block font-mono">
                SIDE-BY-SIDE MATRIX
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-display mt-2">
                Comparative Workforce & Operational Feasibility
              </h2>
              <p className="text-xs text-neutral-700 mt-1 max-w-3xl font-medium">
                Compare verified metrics across locations without synthetic composite scores or ungrounded rankings.
              </p>
            </div>

            <div className="flex items-center gap-2.5 font-mono">
              <button
                onClick={() => setComparisonCityIds(['bengaluru', 'vizag'])}
                className="px-3.5 py-2 text-xs font-bold uppercase text-black bg-white hover:bg-[#FFE500] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                Reset Default Pair
              </button>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="px-4 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>

          {/* City Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="text-xs font-black text-black mr-1 uppercase">INCLUDE HUBS:</span>
            {cities.map((city) => {
              const active = comparisonCityIds.includes(city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => toggleComparisonCity(city.id)}
                  className={`px-3 py-1 text-xs font-bold uppercase transition-all flex items-center gap-1.5 border-2 border-black ${
                    active
                      ? 'bg-black text-[#FFE500] shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FFE500]'
                  }`}
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] opacity-75">({city.tier})</span>
                  {active && <span className="font-black text-[10px]">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto border-3 border-black shadow-[4px_4px_0px_0px_#000]">
            <table className="w-full text-left text-xs font-mono bg-white">
              <thead className="bg-black text-[#FFE500] border-b-3 border-black uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-3.5 w-48 font-black border-r-2 border-black">METRIC / INDICATOR</th>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <th key={id} className="p-3.5 min-w-[200px] border-r-2 border-black last:border-r-0">
                        <div className="font-black text-base">{c.name}</div>
                        <div className="text-[10px] text-neutral-300 font-normal mt-0.5">
                          {c.state} · <span className="font-bold text-[#00F0A8]">{c.tier}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-black font-medium">
                {/* Coordinates */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Coordinates</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 text-[11px] border-r-2 border-black last:border-r-0">
                        {c?.coordinates?.latitude.toFixed(4)}°N, {c?.coordinates?.longitude.toFixed(4)}°E
                      </td>
                    );
                  })}
                </tr>

                {/* Direct GCC Workforce */}
                <tr className="hover:bg-[#FFF9D2] bg-[#00F0A8]/20">
                  <td className="p-3.5 font-black uppercase bg-[#00F0A8] text-black border-r-2 border-black">Direct GCC Workforce</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 font-black text-black text-sm border-r-2 border-black last:border-r-0">
                        {c?.workforceBreakdown?.directGccHeadcount || 'Data unavailable'}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Tech Sector */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Total IT / Tech Sector</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        {c?.workforceBreakdown?.totalTechSectorHeadcount || c?.estimatedTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* Senior Talent */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Senior Talent Pool (6+y)</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        {c?.workforceBreakdown?.seniorTalentPool || c?.estimatedSeniorTechTalentPool}
                      </td>
                    );
                  })}
                </tr>

                {/* GCC & Tech Facilities Cataloged */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Cataloged Facilities & GCCs</td>
                  {comparisonCityIds.map((id) => {
                    const comps = GCC_COMPANIES.filter((comp) => comp.cityId === id);
                    const gccCount = comps.filter((c) => c.companyClassification === 'Verified captive/global capability centre').length;
                    const otherCount = comps.length - gccCount;
                    return (
                      <td key={id} className="p-3.5 font-bold border-r-2 border-black last:border-r-0">
                        <div>{comps.length} facilities cataloged</div>
                        <div className="text-[10px] text-neutral-600 mt-0.5">({gccCount} verified GCCs · {otherCount} IT/Product)</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Voluntary Attrition */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Voluntary Attrition</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        {c?.typicalOfferDropoutRate}% per annum
                      </td>
                    );
                  })}
                </tr>

                {/* Notice Period */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Notice Period Lag</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        {c?.averageNoticePeriodDays} Days standard
                      </td>
                    );
                  })}
                </tr>

                {/* Prime Office Rent */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">Prime Grade-A Rent</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        <div className="font-black text-black">
                          {c?.officeOperatingCost?.primeGradeARent || 'Data unavailable'}
                        </div>
                        <div className="text-[10px] text-neutral-600 mt-0.5">
                          {c?.officeOperatingCost?.sourceName}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* State Policy */}
                <tr className="hover:bg-[#FFF9D2]">
                  <td className="p-3.5 font-bold uppercase bg-[#FAF7EE] border-r-2 border-black">State Policy Framework</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        <div className="font-bold text-black">
                          {c?.stateIncentivesPolicy?.policyName || 'Data unavailable'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Action Transfer */}
                <tr className="bg-[#FFE500]/30">
                  <td className="p-3.5 font-black uppercase bg-[#FFE500] text-black border-r-2 border-black">Transfer Action</td>
                  {comparisonCityIds.map((id) => {
                    const c = cities.find((item) => item.id === id);
                    if (!c) return null;
                    return (
                      <td key={id} className="p-3.5 border-r-2 border-black last:border-r-0">
                        <button
                          onClick={() => handleTransferToPlanBuilder(c.id)}
                          className="w-full px-3 py-2 text-xs font-black uppercase text-black bg-white hover:bg-[#FFE500] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Use in Builder</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-mono text-neutral-700">
            <strong className="text-black uppercase">Comparative Methodological Disclosure: </strong>
            Figures reflect data compiled from respective state IT policies, real estate IPC benchmarks (CBRE / Cushman & Wakefield 2024), and NASSCOM GCC council reports. Reporting dates and definitions may vary between state agencies. GCC Compass does not construct artificial composite index scores or algorithmic rankings.
          </div>
        </div>
      )}
    </div>
  );
};
