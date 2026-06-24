import axios from 'axios'
import type { DynastyListDTO, DynastyDetail, Ruler, RoyalMember, RulerChild } from '../types'

const api = axios.create({ baseURL: '/api' })

export function getDynasties(): Promise<DynastyListDTO[]> {
  return api.get('/dynasties').then(res => res.data)
}

export function getDynastyDetail(id: number): Promise<DynastyDetail> {
  return api.get(`/dynasties/${id}`).then(res => res.data)
}

export function getRulers(dynastyId: number): Promise<Ruler[]> {
  return api.get(`/dynasties/${dynastyId}/rulers`).then(res => res.data)
}

export function getMembers(dynastyId: number): Promise<RoyalMember[]> {
  return api.get(`/dynasties/${dynastyId}/members`).then(res => res.data)
}

export function getChildren(rulerId: number): Promise<RulerChild[]> {
  return api.get(`/rulers/${rulerId}/children`).then(res => res.data)
}
