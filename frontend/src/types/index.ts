export interface DynastyListDTO {
  id: number
  name: string
  surname: string
  period: string
  founder: string
  lastRuler: string
  yearStart: number
  yearEnd: number
  summary: string
  imageGradient: string
}

export interface DynastyDetail extends DynastyListDTO {
  capital: string
  duration: string
  description: string
  familyTree: string
  imageGradient: string
  rulers: Ruler[]
  members: RoyalMember[]
}

export interface Ruler {
  id: number
  dynastyId: number
  title: string
  name: string
  reignStart: string
  reignEnd: string
  relation: string
  achievements: string
}

export interface RoyalMember {
  id: number
  dynastyId: number
  name: string
  title: string
  lifespan: string
  role: string
  description: string
}

export interface RulerChild {
  id: number
  rulerId: number
  name: string
  title: string
  mother: string
  deeds: string
  fate: string
  sortOrder: number
}

export interface DynastySections {
  origins: string
  founding: string
  zenith: string
  decline: string
}
