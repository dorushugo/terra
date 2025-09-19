import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from './CartProvider'
import { FavoritesProvider } from './FavoritesProvider'
import { AccountProvider } from './AccountProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AccountProvider>
          <FavoritesProvider>
            <CartProvider>{children}</CartProvider>
          </FavoritesProvider>
        </AccountProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
