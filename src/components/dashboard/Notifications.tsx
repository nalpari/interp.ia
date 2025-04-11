'use client'

import { useState } from 'react'
import { Bell, Mail, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { TabsContent } from '../ui/tabs'

export default function Notifications() {
  const [emailOnAssign, setEmailOnAssign] = useState(false)
  const [pushOnAssign, setPushOnAssign] = useState(true)
  const [emailOnChange, setEmailOnChange] = useState(false)

  return (
    <>
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>알림</CardTitle>
            <CardDescription>알림을 받는 방식을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor="email-assign" className="font-medium">
                    일감 할당시 이메일 받기
                  </Label>
                  <p className="text-sm text-muted-foreground">새로운 일감이 할당되면 이메일 알림을 받습니다.</p>
                </div>
              </div>
              <Switch id="email-assign" checked={emailOnAssign} onCheckedChange={setEmailOnAssign} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-4">
                <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor="push-assign" className="font-medium">
                    일감 할당시 푸시 받기
                  </Label>
                  <p className="text-sm text-muted-foreground">새로운 일감이 할당되면 푸시 알림을 받습니다.</p>
                </div>
              </div>
              <Switch id="push-assign" checked={pushOnAssign} onCheckedChange={setPushOnAssign} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-4">
                <Settings className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor="email-change" className="font-medium">
                    일감 내용 변경시 이메일 받기
                  </Label>
                  <p className="text-sm text-muted-foreground">할당된 일감의 내용이 변경되면 이메일 알림을 받습니다.</p>
                </div>
              </div>
              <Switch id="email-change" checked={emailOnChange} onCheckedChange={setEmailOnChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button>알림 설정 저장</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </>
  )
}
