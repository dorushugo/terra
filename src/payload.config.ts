// storage-adapter-import-placeholder
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Products } from './collections/Products'
import { TerraCollections } from './collections/TerraCollections'
import { Orders } from './collections/Orders'
import { Customers } from './collections/Customers'
import { Addresses } from './collections/Addresses'
import { StockMovements } from './collections/StockMovements'
import { StockAlerts } from './collections/StockAlerts'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import terraCompleteData from './endpoints/seed/terra-seed-complete'
import terraSimpleSeed from './endpoints/seed/terra-seed-simple'
import terraBasicSeed from './endpoints/seed/terra-basic'
import terraMinimalSeed from './endpoints/seed/terra-minimal'
import terraCollectionsSeed from './endpoints/seed/terra-collections-seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  endpoints: [
    terraCompleteData,
    terraSimpleSeed,
    terraBasicSeed,
    terraMinimalSeed,
    terraCollectionsSeed,
  ],
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    // Désactiver la live preview en développement pour réduire les rechargements
    livePreview:
      process.env.NODE_ENV === 'production'
        ? {
            breakpoints: [
              {
                label: 'Mobile',
                name: 'mobile',
                width: 375,
                height: 667,
              },
              {
                label: 'Tablet',
                name: 'tablet',
                width: 768,
                height: 1024,
              },
              {
                label: 'Desktop',
                name: 'desktop',
                width: 1440,
                height: 900,
              },
            ],
          }
        : undefined,
    // Optimisations pour le développement
    autoLogin: false,
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: './src/migrations',
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Products,
    TerraCollections,
    Orders,
    Customers,
    Addresses,
    StockMovements,
    StockAlerts,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    // vercelBlobStorage temporairement désactivé pour utiliser le stockage local
    // vercelBlobStorage({
    //   collections: {
    //     media: true, // Enable Vercel Blob storage for the 'media' collection
    //   },
    //   token: process.env.BLOB_READ_WRITE_TOKEN || '',
    // }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
