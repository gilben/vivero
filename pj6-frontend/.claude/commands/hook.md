Generate a custom React hook.

Usage: /hook <name>

Rules: useQuery for reads (never useEffect+useState for fetching), useMutation for writes, all HTTP through apiClient.ts. Include loading, error, success states.