// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <NextUIProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster position='top-right' />
            </QueryClientProvider>

        </NextUIProvider>
    )
}