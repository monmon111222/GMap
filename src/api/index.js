import { get } from './http'

export const getLocation = () => get('/location/soil')
