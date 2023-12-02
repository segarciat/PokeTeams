import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

export const mockError = http.get('*', () => {
  return HttpResponse.error()
})
