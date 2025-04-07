import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, ArrowRight, Clock, Download, Moon, Plus, Share2, Smartphone } from "lucide-react"
import SleepQualityChart from "@/components/sleep-quality-chart"
import SleepStagesChart from "@/components/sleep-stages-chart"

export default function SleepTrackingContent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sleep Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze your sleep patterns</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Sleep Data</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">April 6, 2025</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="daily" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sleep Timeline</CardTitle>
                <CardDescription>Your sleep stages throughout the night</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-slate-100 dark:bg-slate-800 rounded-md relative">
                  {/* Sleep timeline visualization would go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Sleep timeline visualization</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2 text-xs text-muted-foreground">
                    <span>11:30 PM</span>
                    <span>1:00 AM</span>
                    <span>2:30 AM</span>
                    <span>4:00 AM</span>
                    <span>5:30 AM</span>
                    <span>7:00 AM</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-600 mr-2" />
                    <span className="text-sm">Deep Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600 mr-2" />
                    <span className="text-sm">REM Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-300 mr-2" />
                    <span className="text-sm">Light Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-300 mr-2" />
                    <span className="text-sm">Awake</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep Calendar</CardTitle>
                <CardDescription>View your sleep history</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="rounded-md border" />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Sleep Score</span>
                    <span className="font-medium">85/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Time in Bed</span>
                    <span className="font-medium">8h 12m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Actual Sleep</span>
                    <span className="font-medium">7h 42m</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Sleep Efficiency</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Stages</CardTitle>
                <CardDescription>Distribution of your sleep stages</CardDescription>
              </CardHeader>
              <CardContent>
                <SleepStagesChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep Factors</CardTitle>
                <CardDescription>Elements affecting your sleep quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Moon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Bedroom Temperature</h4>
                      <p className="text-xs text-muted-foreground">68°F (Optimal)</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Screen Time Before Bed</h4>
                      <p className="text-xs text-muted-foreground">45 minutes (Reduce)</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Physical Activity</h4>
                      <p className="text-xs text-muted-foreground">8,500 steps (Good)</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Moon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Noise Levels</h4>
                      <p className="text-xs text-muted-foreground">Low (Optimal)</p>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sleep Analysis</CardTitle>
              <CardDescription>Your sleep patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <SleepQualityChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sleep Trends</CardTitle>
              <CardDescription>Your sleep patterns over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Monthly sleep trend visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Sleep Overview</CardTitle>
              <CardDescription>Your sleep patterns over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Yearly sleep overview visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

