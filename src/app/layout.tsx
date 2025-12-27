
import type { Metadata } from "next"
import {
  DarkModePreferenceFacilitator,
  DarkModeNoFoucScript,
} from "@/lib/theme-preference-facilitator/dark-mode"
import {
  MyVisualStylePreferenceFacilitator,
  MyVisualStyleNoFoucScript,
} from "../features/theming/my-visual-style-preference-facilitator"
import { ThemeStyleElements } from "../features/theming/theme-style-elements"
// import { ThemeColorMetaTagMutator } from "../features/theming/theme-color-meta-tag-mutator"
import '../fonts'

import "./globals.css"

export const metadata: Metadata = {
  title: "Orcas Stopwatch Utility",
  applicationName: "Orcas Stopwatch Tool",
  description: "A grid of stopwatches",
  robots: "none",
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overscroll-y-none">
      <DarkModePreferenceFacilitator preventTransitions>
        <MyVisualStylePreferenceFacilitator storageKey="theme" preventTransitions>
          <head>
            <DarkModeNoFoucScript />
            <ThemeStyleElements />
            <MyVisualStyleNoFoucScript />
            {/* <ThemeColorMetaTagMutator /> */}

            <script
              id="register-service-worker"
              dangerouslySetInnerHTML={{ __html: `\
const NODE_ENV = ${JSON.stringify(process.env.NODE_ENV)}
const standalone = matchMedia('(display-mode: standalone)').matches
if (NODE_ENV === 'production' || standalone) {
  navigator.serviceWorker.register('service-worker.js')
}
` }}
            />
          </head>
          <body>
            {children}
          </body>
        </MyVisualStylePreferenceFacilitator>
      </DarkModePreferenceFacilitator>
    </html>
  )
}
