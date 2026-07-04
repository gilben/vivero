import { useQuery } from '@tanstack/react-query'
import { fetchProductById } from '../api'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  })
}