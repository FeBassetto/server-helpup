import { AppError } from '@/shared/errors/AppError'
import axios from 'axios'

interface GetGeoLocationProps {
  street: string
  neighborhood: string
  city: string
  number: number
}

export async function getGeoLocation({
  city,
  neighborhood,
  number,
  street,
}: GetGeoLocationProps) {
  const encodedStreet = encodeURIComponent(street)
  const encodedNeighborhood = encodeURIComponent(neighborhood)
  const encodedCity = encodeURIComponent(city)
  const encodedNumber = encodeURIComponent(number)

  const geoUrl = `https://nominatim.openstreetmap.org/search.php?q=${encodedStreet}+${encodedNeighborhood}+${encodedCity}+${encodedNumber}&format=jsonv2`

  const { data } = await axios.get(geoUrl)

  if (data.length === 0) {
    throw new AppError({ code: 400, message: 'Endereço inválido' })
  }

  const { lat, lon } = data[0]

  return { lat, lon }
}
