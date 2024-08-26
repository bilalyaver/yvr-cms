const clientFiles = [
    {
        path: 'client/pages/_app.js',
        content: `import '../globals.css'
import { Toaster } from "@/components/ui/toaster";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  )
}

export default App;`
    },
    {
        path: 'client/middleware.js',
        content: `import { NextResponse } from 'next/server';
import axios from 'axios';
import { getCookie } from 'cookies-next';

export async function middleware(request) {
    const res = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    const publicUrl = process.env.NEXT_PUBLIC_APP_ORIGIN;
    const token = getCookie('token', { res, req: request });
    const dev = process.env.NODE_ENV !== 'production';

    // Public paths that should not require authentication
    const isPublicPath = pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/favicon.ico");

    if (isPublicPath) {
        return NextResponse.next();
    }

    if (!dev && pathname.startsWith("/collections")) {
        return NextResponse.redirect(\`\${publicUrl}\`);
    }

    // Fetch users to check if there are any registered users
    let userCount = 0;
    try {
        const { data } = await axios.get(\`\${publicUrl}/api/user:getAll\`);
        userCount = data.length;
    } catch (error) {
        // Handle error appropriately, possibly allow request to continue
        return NextResponse.next();
    }

    // If no token and no registered users, redirect to register page
    if (!token && userCount === 0 && !pathname.startsWith("/register")) {
        return NextResponse.redirect(\`\${publicUrl}/register\`);
    }

    // If no token but there are registered users, redirect to login page
    if (!token && userCount > 0 && pathname.startsWith("/register")) {
        return NextResponse.redirect(\`\${publicUrl}/login\`);
    }

    // If token is present, allow access
    if (token) {
        return NextResponse.next();
    }

    // If trying to access /login or /register with no token, but users exist
    if (!token && userCount > 0 && !pathname.startsWith("/login")) {
        return NextResponse.redirect(\`\${publicUrl}/login\`);
    }

    return NextResponse.next();
}`
    },
    {
        path: 'client/globals.css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 100% 6%;
    --foreground: 180 100% 90%;
    --primary: 200 100% 28%;
    --primary-foreground: 180 100% 90%;
    --secondary: 203 23% 30%;
    --secondary-foreground: 180 100% 90%;
    --accent: 198 70% 50%;
    --accent-foreground: 185 10% 13%;
    --destructive: 0 98% 44%;
    --destructive-foreground: 0 0% 100%;
    --muted: 200 50% 30%;
    --muted-foreground: 180 100% 90%;
    --card: 210 100% 12%;
    --card-foreground: 180 100% 90%;
    --popover: 210 100% 15%;
    --popover-foreground: 180 100% 90%;
    --border: 210 50% 40%;
    --input: 210 50% 40%;
    --ring: 180 100% 90%;
    --radius: 0rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}`
    },
    {
        path: 'tailwind.config.mjs',
        content: `
/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
  darkMode: ["class"],
  content: [
    './client/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', ...fontFamily.sans],
        body: ['var(--font-body)', ...fontFamily.mono]
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        xl: \`calc(var(--radius) + 4px)\`,
        lg: \`var(--radius)\`,
        md: \`calc(var(--radius) - 2px)\`,
        sm: \`calc(var(--radius) - 4px)\`
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`
    },
    {
        path: 'postcss.config.mjs',
        content: `
       /** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

         `
    },
    {
        path: 'next.config.mjs',
        content: `/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: 'http://localhost:8080/api',
    API_KEY: 'n7rT14C6DlyYQdJPknwVfZWGkU5m1nYC',
  }
}

export default nextConfig;`
    },
    {
        path: 'client/jsconfig.json',
        content: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "*"
      ],
      "client/*": [
        "*"
      ],
    }
  }
}`
    },
    {
        path: 'jsconfig.json',
        content: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  }
}`
    },
    {
        path:'components.json',
        content:`
       {
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "client/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "client/components",
    "utils": "lib/utils"
  }
}
        
        `
    },
    {
        path:'client/pages/_document.js',
        content:`
        import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <script src="https://cdn.tailwindcss.com"></script>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
        `
    },
    {
        path: 'client/lib/utils.js',
        content: `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`
    }
];



export default clientFiles;