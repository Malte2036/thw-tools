'use client';

import LinkButton from '@/components/base/LinkButton';
import BoltIcon from '@/icons/BoltIcon';
import ChartSimpleIcon from '@/icons/ChartSimpleIcon';
import CircleRadiationIcon from '@/icons/CircleRadiationIcon';
import HammerIcon from '@/icons/HammerIcon';
import HearthPulseIcon from '@/icons/HearthPulseIcon';
import logo from '@/icons/thw-mzgw.webp';
import VehicleIcon from '@/icons/VehicleIcon';
import VestIcon from '@/icons/VestIcon';
import WalkieTalkieIcon from '@/icons/WalkieTalkieIcon';
import WarehouseIcon from '@/icons/WarehouseIcon';
import Image from 'next/image';

const description = {
  headline: 'Funkgeräte Verwaltung & OV Inventar:',
  subheadline: 'Digitale Tools für den internen Gebrauch im THW OV Düsseldorf.',
  keywords: 'THW, OV Düsseldorf, Funkgeräte, Inventar',
};

type ToolCategory = {
  title: string;
  description: string;
  external: boolean;
  tools: Tool[];
};

type Tool = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  url: string;
  event: string;
  external?: boolean;
};

const toolCategories: ToolCategory[] = [
  {
    title: 'THW OV Düsseldorf',
    description: 'Tools für den internen Gebrauch im THW OV Düsseldorf.',
    external: false,
    tools: [
      {
        name: 'Funkliste',
        icon: WalkieTalkieIcon,
        url: '/funk/',
        event: 'Open Funkliste',
      },
      {
        name: 'OV Inventar',
        icon: WarehouseIcon,
        url: '/inventar/',
        event: 'Open OV Inventar',
      },
      {
        name: 'Fahrzeugverwaltung',
        icon: VehicleIcon,
        url: '/fahrzeuge/',
        event: 'Open Fahrzeugverwaltung',
      },
    ],
  },
  {
    title: 'THW Tools',
    description: 'Teste und verbessere dein Wissen in verschiedenen THW-Bereichen.',
    external: true,
    tools: [
      {
        name: 'Grundausbildungs-Quiz',
        icon: HammerIcon,
        url: 'https://thw-tools.de/quiz/ga/listing/',
        event: 'Open GA Quiz',
        external: true,
      },
      {
        name: 'Sprechfunk-Quiz',

        icon: WalkieTalkieIcon,
        url: 'https://thw-tools.de/quiz/radio/listing/',
        event: 'Open Radio Quiz',
        external: true,
      },
      {
        name: 'Atemschutz-Quiz',
        icon: ChartSimpleIcon,
        url: 'https://thw-tools.de/quiz/agt/listing/',
        event: 'Open AGT Quiz',
        external: true,
      },
      {
        name: 'CBRN-Quiz',
        icon: CircleRadiationIcon,
        url: 'https://thw-tools.de/quiz/cbrn/listing/',
        event: 'Open CBRN Quiz',
        external: true,
      },
      {
        name: 'THW Bekleidungs Rechner',
        icon: VestIcon,
        url: 'https://thw-tools.de/clothing',
        event: 'Open THW Clothing',
        external: true,
      },
      {
        name: 'Finnentest',
        icon: HearthPulseIcon,
        url: 'https://finnentest.thw-tools.de',
        event: 'Open Finnentest',
        external: true,
      },
      {
        name: 'Elektro Spannungsfall',
        icon: BoltIcon,
        url: 'https://elektro.thw-tools.de',
        event: 'Open Elektro Spannungsfall',
        external: true,
      },
      {
        name: 'CBRN-Schutzanzug',
        icon: VestIcon,
        url: 'https://thw-tools.de/cbrn/protective-suite',
        event: 'Open CBRN Protective Suite',
        external: true,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-thw-50 font-calibri">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-16">
          <Image
            src={logo.src}
            className="w-96 max-md:w-64 aspect-auto mb-8"
            width={384}
            height={308}
            alt="THW MehrzweckGerätewagen"
          />
          <h1 className="text-5xl max-md:text-4xl font-bold text-thw-900 mb-4">
            THW OV Düsseldorf
          </h1>
          <h2 className="text-2xl max-md:text-lg max-w-3xl">
            <span className="font-bold text-thw-800">{description.headline}</span>
            <span className="text-gray-700">{description.subheadline}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {toolCategories.map((category) => (
            <div
              key={category.title}
              className="bg-white border-2 border-thw-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8"
            >
              <div className="flex flex-col gap-2">
                <div className="border-b-2 border-thw-100 flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-thw-800 flex gap-2 flex-row items-baseline">
                    <span className="text-nowrap">{category.title}</span>
                    {category.external && (
                      <div className="text-sm font-normal text-nowrap">(Externe Tools)</div>
                    )}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>

                <div className="flex flex-col gap-3 flex-grow">
                  {category.tools.map((tool) => (
                    <LinkButton
                      key={tool.name}
                      url={tool.url}
                      blank={tool.external}
                      dataUmamiEvent={tool.event}
                    >
                      <div className="w-6 group-hover:text-thw-600 transition-colors">
                        <tool.icon width={24} />
                      </div>
                      <div className="font-bold flex-grow text-left">{tool.name}</div>
                      {tool.external && <div className="text-sm text-thw-400">↗</div>}
                    </LinkButton>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">
            Diese inoffiziellen Tools wurden von THW-Helfern für THW-Helfer entwickelt, um die
            Ausbildung und den Einsatz zu unterstützen.
          </p>
        </div>
      </div>
    </div>
  );
}
