// pcoId = serviceTypeId-planId
export function SplitPcoId (pcoId) {
  let serviceTypeId = ''
  let planId = ''
  if (pcoId) {
    const i = pcoId.search('-')
    if (i > 1 && pcoId.length > i) {
      serviceTypeId = pcoId.substring(0, i)
      if (pcoId.length > i) {
        planId = pcoId.substring(i + 1)
      }
    }
  }
  return { serviceTypeId, planId }
}

export function PcoLiveUrl (pcoId, split = false) {
  if (pcoId) {
    if (!split) return `https://services.planningcenteronline.com/live/${pcoId}`
    const service = SplitPcoId(pcoId)
    // live of plan
    if (service.planId) return `https://services.planningcenteronline.com/live/${service.planId}`
    // next comming plan of serviceType
    if (service.serviceTypeId) return `https://services.planningcenteronline.com/service_types/${service.serviceTypeId}/plans/after/today/live`
  }
  return ''
}
