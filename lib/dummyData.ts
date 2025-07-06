export interface VehicleData {
  id: string
  chassisNumber: string
  vehicleNumber: string
  modelName: string
  year: number
  fuel: string
  vin: string
  buyerName: string
  contractDate: string
  exportCountry: string
  fobPrice: number
  currency: string
  containerType: string
  departureDate: string
  shoringCompany: string
  status: "purchased" | "cancelled" | "customs_completed" | "shoring_completed" | "shipped" | "arrived"
  currentStep: number
  documents: {
    registration: boolean
    cancellation: boolean
    invoice: boolean
    packingList: boolean
    bl: boolean
  }
  assignedCompanies: {
    customs?: string
    shoring?: string
    shipping?: string
  }
  eta?: string
  progress?: number
}

export interface Company {
  id: string
  name: string
  type: "customs" | "shoring" | "shipping"
  contact: string
  email: string
}

export const dummyVehicles: VehicleData[] = [
  {
    id: "V001",
    chassisNumber: "KMHD141GPMA123456",
    vehicleNumber: "12가3456",
    modelName: "현대 소나타",
    year: 2020,
    fuel: "가솔린",
    vin: "KMHD141GPMA123456",
    buyerName: "Ahmed Hassan",
    contractDate: "2024-01-15",
    exportCountry: "이집트",
    fobPrice: 15000,
    currency: "USD",
    containerType: "20ft",
    departureDate: "2024-02-01",
    shoringCompany: "㈜디오로지스",
    status: "purchased",
    currentStep: 1,
    documents: {
      registration: true,
      cancellation: false,
      invoice: false,
      packingList: false,
      bl: false,
    },
    assignedCompanies: {},
  },
  {
    id: "V002",
    chassisNumber: "KNDJF3A59H7123789",
    vehicleNumber: "34나5678",
    modelName: "기아 스포티지",
    year: 2019,
    fuel: "디젤",
    vin: "KNDJF3A59H7123789",
    buyerName: "Vladimir Petrov",
    contractDate: "2024-01-10",
    exportCountry: "러시아",
    fobPrice: 18000,
    currency: "USD",
    containerType: "40ft",
    departureDate: "2024-01-25",
    shoringCompany: "㈜디오로지스",
    status: "cancelled",
    currentStep: 2,
    documents: {
      registration: true,
      cancellation: true,
      invoice: false,
      packingList: false,
      bl: false,
    },
    assignedCompanies: {},
    eta: "2024-02-15",
    progress: 25,
  },
]

export const dummyCompanies: Company[] = [
  {
    id: "C001",
    name: "㈜스피드관세법인",
    type: "customs",
    contact: "김관세",
    email: "customs@speed.co.kr",
  },
  {
    id: "C002",
    name: "인천관세사무소",
    type: "customs",
    contact: "이통관",
    email: "lee@incheon-customs.co.kr",
  },
  {
    id: "S001",
    name: "㈜디오로지스",
    type: "shoring",
    contact: "박쇼링",
    email: "shoring@deo.co.kr",
  },
  {
    id: "S002",
    name: "인천항만쇼링",
    type: "shoring",
    contact: "최적재",
    email: "choi@incheon-shoring.co.kr",
  },
  {
    id: "H001",
    name: "MSC Korea",
    type: "shipping",
    contact: "정선박",
    email: "jung@msc.co.kr",
  },
  {
    id: "H002",
    name: "MAERSK 대리점",
    type: "shipping",
    contact: "한바다",
    email: "han@maersk.co.kr",
  },
]

export const statusSteps = [
  { key: "purchased", label: "매입완료", step: 1, color: "blue" },
  { key: "cancelled", label: "말소완료", step: 2, color: "orange" },
  { key: "customs_completed", label: "면장완료", step: 3, color: "green" },
  { key: "shoring_completed", label: "쇼링완료", step: 4, color: "purple" },
  { key: "shipped", label: "선적완료", step: 5, color: "indigo" },
  { key: "arrived", label: "도착완료", step: 6, color: "emerald" },
]
