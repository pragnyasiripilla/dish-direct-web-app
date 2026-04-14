import { Router } from "express"
import { RESTAURANTS } from "../../data/restaurants.js"

const router = Router()

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

router.get("/", (req, res) => {
  const lat = Number(req.query.lat)
  const lng = Number(req.query.lng)
  const radiusKm = Number(req.query.radiusKm || 10)

  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    const filtered = RESTAURANTS.map((r) => ({
      ...r,
      distance: distanceKm(lat, lng, r.lat, r.lng),
    }))
      .filter((r) => r.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
    return res.json({ restaurants: filtered })
  }

  return res.json({ restaurants: RESTAURANTS })
})

export default router
