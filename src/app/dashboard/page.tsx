import React from 'react';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  CreditCard, 
  ChevronRight,
  Download,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg italic">A</span>
              </div>
              <span className="text-xl font-headline font-bold text-primary tracking-tight">AllianceHub</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Dashboard">
                  <LayoutDashboard /> <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                  <User /> <span>My Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Documents">
                  <FileText /> <span>Member Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Events">
                  <Calendar /> <span>My Events</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Membership">
                  <CreditCard /> <span>Subscription</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Announcements">
                  <Bell /> <span>Announcements</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="mt-8 border-t pt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings /> <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout" className="text-destructive">
                    <LogOut /> <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-background flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
              <h1 className="text-lg font-bold font-headline hidden sm:block">Welcome back, John Doe</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              <Avatar className="w-10 h-10 border-2 border-accent shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/user1/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Membership Status', value: 'Gold Tier', sub: 'Expires Oct 2024', icon: CreditCard, color: 'text-secondary' },
                { label: 'Documents Accessed', value: '42', sub: '6 this month', icon: FileText, color: 'text-primary' },
                { label: 'Upcoming Events', value: '3', sub: 'Next: Nov 15', icon: Calendar, color: 'text-green-600' },
                { label: 'Reward Points', value: '1,250', sub: '+150 recently', icon: LayoutDashboard, color: 'text-orange-500' },
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                      <h4 className="text-2xl font-bold">{item.value}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                    </div>
                    <div className={`${item.color} bg-background p-3 rounded-xl`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Documents */}
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline font-bold">Recommended Documents</CardTitle>
                    <CardDescription>Recently updated policy frameworks and guides</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-accent transition-colors cursor-pointer group px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Q4 Strategic Industrial Review_{i}.pdf</p>
                            <p className="text-xs text-muted-foreground">Updated 2 days ago • 2.4 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:text-primary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline font-bold">Latest Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== 3 && <div className="absolute left-2.5 top-8 bottom-0 w-px bg-border"></div>}
                      <div className="w-5 h-5 rounded-full bg-primary flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-primary">Announcement • 1{i}h ago</p>
                        <p className="text-sm font-medium leading-tight">Board meeting summary for the new fiscal quarter now available.</p>
                        <Link href="#" className="text-xs text-primary font-bold hover:underline">Read update</Link>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4" variant="outline">View All Alerts</Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Calendar Widget */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline font-bold">My Event Calendar</CardTitle>
                <Button size="sm" className="rounded-full">Register for Event</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Global Ethics Seminar', time: '10:00 AM - 12:00 PM', date: 'Nov 12', type: 'Virtual' },
                    { title: 'Annual Gala Night', time: '07:00 PM - 11:00 PM', date: 'Dec 05', type: 'In-person' },
                  ].map((event, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-accent rounded-xl border border-primary/10">
                      <div className="flex items-center gap-6">
                        <div className="bg-white px-3 py-2 rounded-lg text-center shadow-sm min-w-[60px]">
                          <p className="text-xs font-bold text-primary uppercase">{event.date.split(' ')[0]}</p>
                          <p className="text-xl font-bold">{event.date.split(' ')[1]}</p>
                        </div>
                        <div>
                          <h5 className="font-bold">{event.title}</h5>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {event.time}</span>
                            <Badge variant="secondary" className="bg-white">{event.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4 sm:mt-0 font-bold group">
                        Event Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
