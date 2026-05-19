import { RouterProvider } from 'react-router'
import { router } from '@/app/routes'
import { AppProviders } from '@/app/providers'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProviders>
  )
}
