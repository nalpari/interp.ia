'use client'

import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { TabsContent } from '../ui/tabs'

export default function Notifications() {
  return (
    <>
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch id="marketing" />
              <div className="space-y-1">
                <Label htmlFor="marketing">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new products, features, and more.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="social" />
              <div className="space-y-1">
                <Label htmlFor="social">Social notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when someone mentions you or replies to your messages.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="security" />
              <div className="space-y-1">
                <Label htmlFor="security">Security emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails about your account security and privacy.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save notification settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </>
  )
}
