import { provincesWithCities } from './constants'

/**
 * @typedef {Object} Province
 * @property {string} value
 * @property {string} name
 */

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {Array}
 */
export function getNearestProvinces(lat, lon) {
  const provinceDistanceMap = provincesWithCities
    .map((p) => {
      const distance = getDistanceFromLatLonInKm(
        lat,
        lon,
        parseFloat(p.province.lat),
        parseFloat(p.province.lon)
      )
      return {
        distance: !p.province.lat ? Infinity : distance,
        value: p.province.value,
        name: p.province.name,
      }
      // map first so we don't mutate original array
    })
    .sort((a, b) => {
      // getDistance returns string so we need to compare its float
      return a.distance > b.distance ? 1 : -1
    })

  return provinceDistanceMap
}

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {Province}
 */
export function getNearestProvince(lat, lon) {
  const nearestProvinces = getNearestProvinces(lat, lon)
  return nearestProvinces[0]
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

/**
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lon2
 * @param {number} lat2
 * @returns {number}
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}
