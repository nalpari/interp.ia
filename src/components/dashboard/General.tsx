'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { TabsContent } from '../ui/tabs'
import { UserState } from '@/store/useUserStore'
import { userApi } from '@/api/user'

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  // bio: z.string().max(160).min(4),
  position: z.string(),
  department: z.string(),
  job: z.string(),
  phone: z.string(),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: 'Please enter a valid URL.' }),
  //     }),
  //   )
  //   .optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  // bio: "I'm a software developer...",
  // urls: [{ value: 'https://example.com' }, { value: 'https://example2.com' }],
}

type UserInfo = {
  data: UserState
}

export default function General() {
  const cache = useQueryClient()
  const userInfo = cache.getQueryData(['user', 'info']) as UserInfo

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // defaultValues,
    defaultValues: {
      username: userInfo?.data.name,
      email: userInfo?.data.email,
      position: userInfo?.data.position,
      department: userInfo?.data.department,
      job: userInfo?.data.job,
      phone: userInfo?.data.phone,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: ProfileFormValues) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    const { username, email } = data
    updateUser(data)
  }

  const queryClient = useQueryClient()

  const {
    mutate: updateUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'info'] })
    },
  })

  return (
    <>
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Update your photo and personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo?.data.image} alt="Avatar" />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" className="mb-2">
                  Change Avatar
                </Button>
                <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name. It can be your real name or a pseudonym.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormDescription>You can manage verified email addresses in your email settings.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="position" {...field} />
                      </FormControl>
                      <FormDescription>Your position in the company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormDescription>Your department in the company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job</FormLabel>
                      <FormControl>
                        <Input placeholder="job" {...field} />
                      </FormControl>
                      <FormDescription>Your job in the company.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="phone" {...field} />
                      </FormControl>
                      <FormDescription>Your phone number.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  Update profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  )
}
