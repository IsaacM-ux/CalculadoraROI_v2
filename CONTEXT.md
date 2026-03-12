# CONTEXT.md — Drone ROI Calculator

> Context file for AI agents. Max 600 lines. Covers architecture, data flow, formulas, and conventions.

---

## 1. Project Overview

**What:** A Spanish-language web calculator that compares agricultural application costs across three methods — Manual (backpack sprayer), Tractor, and Drone — to determine ROI for drone adoption.

**Target audience:** Latin American farmers and drone service providers.

**User flow:** Landing page (`/`) → 5-step wizard form (`/calculadora`) → Results dashboard with charts, table, and PDF export.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Charts | Recharts | 3.8.0 |
| Validation | Zod | 4.3.6 |
| PDF | jsPDF + html2canvas-pro | 4.2.0 / 2.0.2 |
| Icons | lucide-react | 0.577.0 |

**Build:** `npm run dev` / `npm run build` (standard Next.js)
**Path alias:** `@/*` → `./src/*` (configured in tsconfig.json)
**Locale:** `es-MX` for all number/currency formatting.

---

## 3. File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (lang="es", Geist fonts, metadata)
│   ├── page.tsx            # Landing page (hero + CTA → /calculadora)
│   ├── globals.css         # Tailwind imports
│   └── calculadora/
│       └── page.tsx        # Main calculator page (wizard ↔ results toggle)
├── components/
│   ├── calculator/
│   │   ├── StepWizard.tsx  # 5-step form with progress bar + navigation
│   │   ├── Step1Service.tsx  # Service type (fumigation/seeding) + crop preset
│   │   ├── Step2Area.tsx     # Hectares, applications/year, input costs
│   │   ├── Step3Manual.tsx   # Manual method params (toggleable)
│   │   ├── Step4Tractor.tsx  # Tractor method params (toggleable)
│   │   └── Step5Drone.tsx    # Drone config: Purchase vs DaaS model
│   ├── results/
│   │   ├── ResultsDashboard.tsx   # Orchestrator: cards + charts + table + PDF
│   │   ├── SavingsCards.tsx       # 3 KPI cards (savings, ROI%, payback)
│   │   ├── ComparisonChart.tsx    # Bar chart: cost breakdown per method
│   │   ├── ProjectionChart.tsx    # Line chart: 5-year cumulative cost
│   │   └── MethodComparisonTable.tsx # Detail table: all cost components
│   └── ui/                 # Reusable primitives (Button, Card, Input, Select, etc.)
├── hooks/
│   └── useCalculator.ts    # Central state + calculation trigger + validation
├── lib/
│   ├── utils.ts            # cn(), formatCurrency(), formatNumber()
│   ├── calculations/
│   │   ├── types.ts        # All TypeScript interfaces
│   │   ├── roi-engine.ts   # Main calculateROI() entry point
│   │   ├── manual.ts       # calculateManualCost()
│   │   ├── tractor.ts      # calculateTractorCost()
│   │   └── drone.ts        # calculateDroneCost() (purchase + DaaS)
│   ├── data/
│   │   ├── crops.ts        # 8 crop presets with full default values
│   │   └── defaults.ts     # defaultInputs (100ha soja farm), PROJECTION_YEARS=5
│   ├── pdf/
│   │   └── generate-pdf.ts # Captures [data-pdf-section] elements → A4 PDF
│   └── validation/
│       └── schemas.ts      # Zod schemas for all input sections
```

---

## 4. Data Flow

```
User Input (StepWizard) → useCalculator (state) → calculateROI(inputs) → CalculationResult → ResultsDashboard
                              ↑                         ↓
                         Zod validate()          manual/tractor/drone.ts
```

1. `useCalculator` holds `UserInputs` state and exposes field updaters.
2. `results` is a `useMemo` of `calculateROI(inputs)` — recalculates on every input change.
3. On "Ver Resultados", `validate()` runs Zod schema; if errors, shows alert.
4. `ResultsDashboard` renders the `CalculationResult` with charts/table/PDF.

---

## 5. TypeScript Interfaces (key types)

### UserInputs
```ts
interface UserInputs {
  common: CommonInputs;      // serviceType, hectareas, aplicacionesAnio, dosis, precios
  manual: ManualCostInputs;  // costoJornal, rendimientoHaDia, porcentajeDesperdicio
  tractor: TractorCostInputs; // operador, combustible, equipo, daño, desperdicio
  drone: {
    model: 'purchase' | 'daas';
    purchase: DronePurchaseInputs; // precioDrone, vidaUtil, mantenimiento, baterias, operador, rendimiento, reduccionInsumos
    daas: DroneDaaSInputs;         // costoPorHa, reduccionInsumos
  };
  includeManual: boolean;
  includeTractor: boolean;
}
```

### MethodCostBreakdown (returned per method)
```ts
interface MethodCostBreakdown {
  manoDeObra: number;
  insumos: number;
  equipo: number;
  combustible: number;
  dañoCultivo: number;
  desperdicio: number;
  total: number;
  costoPorHectarea: number;
  tiempoDias: number;
}
```

### CalculationResult
```ts
interface CalculationResult {
  manual: MethodCostBreakdown | null;  // null if not included
  tractor: MethodCostBreakdown | null; // null if not included
  drone: MethodCostBreakdown;          // always calculated
  savings: SavingsResult;
  payback: PaybackResult | null;       // null for DaaS (no upfront investment)
  roiPorcentaje: number | null;        // null for DaaS
  projection: ProjectionYear[];        // 5-year array
}
```

---

## 6. Calculation Formulas

### Manual (`manual.ts`)
```
diasPorAplicacion = hectareas / rendimientoHaDia
totalDias = diasPorAplicacion × aplicacionesAnio
manoDeObra = totalDias × costoJornal
insumosBase = hectareas × dosisLHa × precioLitro × aplicaciones
insumos = insumosBase × (1 + desperdicio%)
total = manoDeObra + insumos
```

### Tractor (`tractor.ts`)
```
manoDeObra = totalDias × costoOperadorDia
combustible = hectareas × consumoHa × precioCombustible × aplicaciones
equipo = (amortización o renta) + mantenimientoAnual
insumos = insumosBase × (1 + desperdicio%)
dañoCultivo = (hectareas × rendimientoTon × precioTon) × dañoCultivo%
total = manoDeObra + insumos + equipo + combustible + dañoCultivo
```

### Drone Purchase (`drone.ts`)
```
manoDeObra = totalDias × costoOperadorDia (piloto)
equipo = (precioDrone / vidaUtil) + mantenimiento + baterias
insumos = insumosBase × (1 - reduccionInsumos%)   ← SAVES inputs
total = manoDeObra + insumos + equipo
```

### Drone DaaS (`drone.ts`)
```
serviceCost = hectareas × costoPorHa × aplicaciones
insumos = insumosBase × (1 - reduccionInsumos%)
total = serviceCost + insumos
```
Note: DaaS groups `serviceCost` under `equipo` in the breakdown.

### ROI Engine (`roi-engine.ts`)
```
savings = {manualTotal − droneTotal, tractorTotal − droneTotal}
payback (purchase only) = precioDrone / (ahorroMensual)  → months
ROI% (purchase only) = ((highestTraditional − droneTotal) / precioDrone) × 100
projection = 5-year cumulative costs (purchase: year 1 includes full drone price)
```

---

## 7. Crop Presets

8 crops in `lib/data/crops.ts`:

| ID | Nombre | Region | Apps/año | Dosis L/Ha | $/L | Manual Ha/día | Tractor Ha/día | Drone Ha/día | Reducción % |
|---|---|---|---|---|---|---|---|---|---|
| soja | Soja | Pampa/Cerrado | 4 | 2.5 | 12 | 1.5 | 25 | 50 | 25 |
| maiz | Maíz | Pampa/Bajío | 3 | 3.0 | 10 | 1.5 | 25 | 55 | 25 |
| trigo | Trigo | Pampa/Altiplano | 3 | 2.0 | 11 | 1.5 | 28 | 55 | 25 |
| arroz | Arroz | Trópico/Litoral | 5 | 3.5 | 9 | 1.0 | 20 | 45 | 30 |
| vid | Vid | Cuyo/Valle Central | 8 | 4.0 | 15 | 0.8 | 12 | 30 | 20 |
| cafe | Café | Eje Cafetero/Chiapas | 6 | 3.0 | 14 | 0.8 | 10 | 25 | 20 |
| aguacate | Aguacate | Michoacán/Antioquia | 5 | 3.5 | 16 | 0.8 | 10 | 25 | 20 |
| algodon | Algodón | Chaco/Sonora | 5 | 3.0 | 11 | 1.2 | 22 | 45 | 25 |

Selecting a crop calls `selectCrop(cropId)` → `applyFromCrop()` which fills common, manual, tractor, and drone inputs. Custom crop (`cropId === 'custom'`) keeps current values.

---

## 8. Default Inputs

Initialized to a **100 ha soja farm** in `lib/data/defaults.ts`:
- Common: fumigation, 100 ha, 4 apps/year, 2.5 L/ha @ $12/L
- Manual: $20/day, 1.5 ha/day, 20% waste
- Tractor: $40/day operator, 4 L/ha fuel @ $1.2/L, $25k equipment/10yr, 3% crop damage, 10% waste
- Drone purchase: $20k drone/5yr, $1k maint, $500 batteries, $60/day pilot, 50 ha/day, 25% less inputs
- Drone DaaS: $12/ha, 25% less inputs
- Both manual and tractor included by default

---

## 9. Validation (Zod)

`lib/validation/schemas.ts` defines schemas for each section:
- `positiveNumber`: `z.number().positive()`
- `percentage`: `z.number().min(0).max(100)`
- `commonSchema`, `manualSchema`, `tractorSchema`, `dronePurchaseSchema`, `droneDaaSSchema`
- `userInputsSchema`: composite of all above

Called in `useCalculator.validate()` → returns `string[]` of error messages.
Triggered on "Ver Resultados" button in StepWizard before showing results.

---

## 10. PDF Generation

`lib/pdf/generate-pdf.ts`:
- Uses `html2canvas-pro` to capture each `[data-pdf-section]` element independently
- Creates A4 jsPDF document with header ("Calculadora ROI — Drones Agrícolas")
- Sections never split across pages; scaled down if taller than a full page
- Disclaimer footer on last page
- Called from `ResultsDashboard.handleDownloadPdf()` with try-catch + user alert on error

---

## 11. UI Components

### StepWizard (`components/calculator/StepWizard.tsx`)
- 5 steps: Servicio → Superficie → Manual → Tractor → Drone
- Progress bar with clickable step indicators
- Navigation: Anterior/Siguiente + "Ver Resultados" on final step
- Validation gate on results button

### ResultsDashboard (`components/results/ResultsDashboard.tsx`)
- Ref-based PDF capture via `dashboardRef`
- Title: "Comparación Manual / Tractor vs Drone (Compra|Servicio DaaS)"
- Children wrapped in `data-pdf-section` divs
- Components: SavingsCards, ComparisonChart, ProjectionChart, MethodComparisonTable, savings detail cards

### SavingsCards (`components/results/SavingsCards.tsx`)
- 3 KPI cards: Annual Savings, ROI% (or Cost Savings% for DaaS), Payback Period
- ROI% shown only for purchase model; DaaS shows `porcentajeAhorroMax` instead
- Payback shows "N/A" + note for DaaS

### UI Primitives (`components/ui/`)
- `button.tsx`, `card.tsx`, `checkbox.tsx`, `input.tsx`, `select.tsx`, `toggle-group.tsx`
- Input and Select use `React.useId()` for unique HTML IDs (avoids duplicates across wizard steps)

---

## 12. State Management

All state lives in `useCalculator()` hook:
- `inputs: UserInputs` — single source of truth
- `step: number` — current wizard step (0-4)
- `selectedCropId: string` — current crop preset
- `results: CalculationResult` — memoized from `calculateROI(inputs)`
- Field updaters: `updateCommon`, `updateManual`, `updateTractor`, `updateDronePurchase`, `updateDroneDaaS`
- Toggles: `setIncludeManual`, `setIncludeTractor`, `setDroneModel`
- `selectCrop(id)` — applies preset values
- `validate()` — Zod validation returning error string array

`calculadora/page.tsx` holds `showResults` boolean to toggle between wizard and dashboard.

---

## 13. Key Design Decisions

1. **DaaS vs Purchase distinction**: DaaS has no capital investment → `payback` and `roiPorcentaje` are `null`. SavingsCards shows "Ahorro en Costos %" instead of "ROI%".
2. **Drone input savings**: Drones use *reduction* factor (`1 - %`), while manual/tractor use *waste* factor (`1 + %`). This is the main cost advantage.
3. **Crop damage**: Only tractor has `dañoCultivo` (trampling). Manual and drone have zero.
4. **Projection**: Purchase model year 1 includes full drone price (cash-flow view, not amortized). DaaS is simply `annual × years`.
5. **PDF sections**: Each dashboard section is wrapped in `[data-pdf-section]` for independent capture. No section is split across pages.
6. **Service types**: `fumigation` and `seeding` are supported (selected in Step 1). Both use the same calculation formulas; the preset values differ.
7. **Locale**: All formatting uses `es-MX` locale (Mexican Spanish number format).
8. **Validation**: Zod validation only runs on "Ver Resultados" click, not on each field change.

---

## 14. Common Patterns

- **Field updaters**: All use callback pattern `(field: string, value: T) => setInputs(prev => ({...prev, section: {...prev.section, [field]: value}}))`
- **Conditional rendering**: Methods can be excluded via `includeManual`/`includeTractor` toggles. Results handle `null` breakdowns.
- **Cost components**: All methods return a `MethodCostBreakdown` with the same shape for uniform chart/table rendering.
- **Currency**: Always formatted via `formatCurrency()` from `lib/utils.ts` → `$X,XXX` format (es-MX).

---

## 15. Known Constraints

- **Single currency**: All values in USD (no currency selector).
- **No persistence**: No database, localStorage, or URL state. Refreshing loses all inputs.
- **No i18n framework**: All strings are hardcoded in Spanish. No translation system.
- **Client-only calculations**: No API routes. All math runs client-side in the browser.
- **Static crop data**: The 8 crop presets are hardcoded arrays, not fetched from an API.
