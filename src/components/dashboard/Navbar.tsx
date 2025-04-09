'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import Notifications from '@/components/Notifications'
import { Search, ChevronDown, User, Settings, LogOut, GalleryVerticalEnd } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/useUserStore'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

interface NavProps {
  email: string
}

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
        isActive ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
      )}
    >
      {children}
    </Link>
  )
}

interface UserInfo {
  id: string
  name: string
  email: string
  image: string | null
  position: string | null
  department: string | null
  job: string | null
  phone: string | null
  isActive: boolean
  createDate: string | null
  updateDate: string | null
}

export default function Navbar(props: NavProps) {
  const { setUser } = useUserStore()
  const {
    data: loginUser,
    error,
    isPending,
  } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => userApi.getUser(props.email),
    staleTime: 60 * 60 * 1000,
    retry: false,
  })

  useEffect(() => {
    if (loginUser) {
      console.log('🚀 ~ onSuccess: ~ data:', loginUser)
      setUser({ loginedUserInfo: loginUser.data })
    }
  }, [loginUser])

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex gap-2 flex-shrink-0 items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <Link href="/" className="flex text-2xl font-bold text-bold">
                  <span className="flex">INTERP.IA</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/dashboard/projects">Projects</NavLink>
                <NavLink href="/dashboard/analytics">Analytics</NavLink>
                <NavLink href="/dashboard/targets">Targets</NavLink>
                <NavLink href="/dashboard/sample">Sample</NavLink>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
              <Notifications />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 flex items-center">
                    <span className="sr-only">Open user menu</span>
                    <Avatar>
                      <AvatarImage src={loginUser?.data.image} alt="@user1" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden text-sm font-medium text-gray-700 lg:block">{loginUser?.data.name}</span>
                    <ChevronDown className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      signOut()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
