'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
});

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        revalidateOnFocus: false, // Don't refetch automatically on window focus for dashboards
      }}
    >
      {children}
    </SWRConfig>
  );
}
