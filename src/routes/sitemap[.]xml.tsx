import { getSitemap } from '@/lib/sitemap'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(await getSitemap(), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=604800',
          },
        })
      },
    },
  },
})
