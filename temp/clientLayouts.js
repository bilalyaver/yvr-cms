const clientLayouts = [
  {
    path: 'client/layout/DashboardLayout.js',
    content: `
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "yvr-core/client"

import { Bricolage_Grotesque } from 'next/font/google'
import { Space_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { CircleUserIcon, MenuIcon, Package2Icon } from "lucide-react"

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: '400',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: '400',
})

const dev = process.env.NODE_ENV !== 'production';

export default function DashboardLayout({ children, title, rightComponent }) {
  return (
    <div className={cn(
      'antialiased',
      fontHeading.variable,
      fontBody.variable
    )}>
      <div className="flex min-h-screen w-full flex-col"

      >
        <title>{title}</title>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base" prefetch={false}>
              <Package2Icon className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
              Dashboard
            </Link>
            {
              dev && (
                <Link href="/collections" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
                  Collections
                </Link>
              )
            }
            <Link href="/content-management" className="text-muted-foreground transition-colors hover:text-foreground w-40" prefetch={false}>
              Content Management
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                  <Package2Icon className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {
                  dev && (
                    <Link href="/collections" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                      Collections
                    </Link>
                  )
                }
                <Link href="/content-management" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Content Management
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">

            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUserIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => { logout() }}
                >Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full  gap-2">
            <div className="flex justify-between">
              <h1 className="text-3xl font-semibold">
                {title}
              </h1>
              {rightComponent}
            </div>
          </div>
          <div className="mx-auto grid w-full  items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}`
  },
  {
    path: 'client/layout/CardLayout.js',
    content: `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
const CardLayout = () => {
    return (
        <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Plugins Directory</CardTitle>
                <CardDescription>The directory within your project, in which your plugins are located.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Input placeholder="Project Name" defaultValue="/content/plugins" />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include" defaultChecked />
                    <label
                      htmlFor="include"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow administrators to change the directory.
                    </label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
    );
}

export default CardLayout;`
  },
  {
    path: 'client/layout/CollectionLayout.js',
    content: `import CollectionNavigate from "@/components/collection/CollectionNavigate";

const CollectionLayout = ({ children }) => {
    return (
        <>
            <CollectionNavigate />
            <div className="grid gap-6">
                {children}
            </div>
        </>
    );
}

export default CollectionLayout;
`
  },
  {
    path: 'client/layout/ContentManagementLayout.js',
    content: `import ContentManagementNavigate from "@/components/contentManagement/ContentManagementNavigate";

const ContentManagementLayout = ({ children }) => {
    return (
        <>
            <ContentManagementNavigate />
            <div className="grid gap-6">
                {children}
            </div>
        </>
    );
}

export default ContentManagementLayout;`
  }
];


export default clientLayouts;