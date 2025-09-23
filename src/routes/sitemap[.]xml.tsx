import { getSitemap } from '@/lib/sitemap'
import { createServerFileRoute } from '@tanstack/react-start/server'

export const ServerRoute = createServerFileRoute('/sitemap.xml').methods({
  GET: async () => {
    return new Response(await getSitemap(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=604800',
      },
    })
  },
})
