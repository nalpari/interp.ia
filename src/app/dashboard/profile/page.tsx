import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import General from '@/components/dashboard/General'
import Password from '@/components/dashboard/Password'
import Notifications from '@/components/dashboard/Notifications'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <General />
        <Password />
        <Notifications />
      </Tabs>
    </div>
  )
}
