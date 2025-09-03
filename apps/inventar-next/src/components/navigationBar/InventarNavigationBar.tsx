'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '../base/NavigationBar';

import logo from '@/icons/thw-mzgw.webp';

const navItems = [
  {
    title: 'THW OV Düsseldorf',
    items: [
      { name: 'Funkliste', href: '/funk/' },
      { name: 'OV Inventar', href: '/inventar/' },
      { name: 'Fahrzeugverwaltung', href: '/fahrzeuge/' },
      { name: 'Organisation', href: '/organisation/' },
    ],
  },
  {
    title: 'THW Tools',
    external: true,
    items: [
      {
        name: 'Grundausbildungs-Quiz',
        href: 'https://thw-tools.de/quiz/ga/listing/',
        external: true,
      },
      {
        name: 'Sprechfunk-Quiz',
        href: 'https://thw-tools.de/quiz/radio/listing/',
        external: true,
      },
      { name: 'Atemschutz-Quiz', href: 'https://thw-tools.de/quiz/agt/listing/', external: true },
      { name: 'CBRN-Quiz', href: 'https://thw-tools.de/quiz/cbrn/listing/', external: true },
      {
        name: 'CBRN-Schutzanzug',
        href: 'https://thw-tools.de/cbrn/protective-suite',
        external: true,
      },
      { name: 'Finnentest', href: 'https://finnentest.thw-tools.de', external: true },
      { name: 'Elektro Spannungsfall', href: 'https://elektro.thw-tools.de', external: true },
      { name: 'THW Bekleidungs Rechner', href: 'https://thw-tools.de/clothing', external: true },
    ],
  },
];

export default function InventarNavigationBar() {
  const currentPath = usePathname();

  const getCurrentTitleByPath = (path: string): string | undefined => {
    const normalizedPath = path.replace(/\/$/, '');
    let bestMatch = { name: 'THW OV Düsseldorf', slashCount: -1 };

    for (const section of navItems) {
      for (const item of section.items) {
        const normalizedHref = item.href.replace(/\/$/, '');
        if (normalizedPath.startsWith(normalizedHref)) {
          const slashCount = (normalizedHref.match(/\//g) || []).length;
          if (slashCount > bestMatch.slashCount) {
            bestMatch = { name: item.name, slashCount };
          }
        }
      }
    }

    return bestMatch.name;
  };

  return (
    <NavigationBar
      logoUrl={logo.src}
      title={getCurrentTitleByPath(currentPath)}
      navItems={navItems}
      currentPath={currentPath}
    />
  );
}
