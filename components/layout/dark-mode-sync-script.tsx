"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * SSR-only script that syncs Fumadocs' .dark class with MUI's color scheme
 * before hydration to prevent a flash of wrong theme.
 *
 * This is the pre-hydration companion to DarkModeSync in
 * components/docs/dark-mode-sync.tsx, which handles runtime toggles after
 * hydration. Both exist because Fumadocs and MUI use different dark-mode
 * mechanisms that need bridging.
 */
export function DocsDarkModeSyncScript() {
  const isServerRender = useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  );

  if (!isServerRender) {
    return null;
  }

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){
          try{
            var s=document.documentElement.getAttribute('data-mui-color-scheme');
            var dark = s==='dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if(dark){document.documentElement.classList.add('dark')}
          }catch(e){}
        })()`,
      }}
    />
  );
}
