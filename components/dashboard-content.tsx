import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Zap, Clock, Calendar, TrendingUp, ArrowRight, PlayCircle, Headphones } from "lucide-react"
import SleepQualityChart from "@/components/sleep-quality-chart"
import SleepStagesChart from "@/components/sleep-stages-chart"

export default function DashboardContent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, Jane</h1>
          <p className="text-muted-foreground">Here's your sleep summary for today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>AI Insights Available</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold">7h 42m</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +12%
              </Badge>
            </div>
            <Progress value={85} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">85% of your 9-hour goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="mr-2 h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold">85%</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +5%
              </Badge>
            </div>
            <Progress value={85} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">Excellent sleep quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Moon className="mr-2 h-4 w-4 text-indigo-400" />
                  <span className="text-sm">11:30 PM</span>
                </div>
                <div className="flex items-center mt-1">
                  <Sun className="mr-2 h-4 w-4 text-amber-400" />
                  <span className="text-sm">7:12 AM</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Consistent
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Recommended: 10:30 PM - 6:30 AM</span>
              <Calendar className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold">+8%</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Improving
              </Badge>
            </div>
            <div className="flex justify-between mt-4 space-x-1">
              {[65, 70, 60, 80, 75, 68, 85].map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-6 bg-purple-200 rounded-t-sm" style={{ height: `${value * 0.6}px` }}>
                    <div
                      className="w-full bg-purple-600 rounded-t-sm"
                      style={{ height: `${value * 0.6 * (value / 100)}px` }}
                    />
                  </div>
                  <span className="text-xs mt-1">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sleep Quality Analysis</CardTitle>
            <CardDescription>Your sleep quality over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <SleepQualityChart />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sleep Stages</CardTitle>
            <CardDescription>Distribution of your sleep stages last night</CardDescription>
          </CardHeader>
          <CardContent>
            <SleepStagesChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Personalized insights based on your sleep patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="schedule">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="habits">Habits</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule" className="space-y-4 pt-4">
                <div className="flex items-start space-x-4 rounded-lg border p-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Optimize your bedtime</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your sleep patterns, going to bed 30 minutes earlier (around 11:00 PM) could improve your
                      deep sleep by up to 15%.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-purple-600">
                      <span>Adjust sleep schedule</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-start space-x-4 rounded-lg border p-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Consistent wake-up time</h4>
                    <p className="text-sm text-muted-foreground">
                      Your wake-up time varies by up to 90 minutes on weekends. Maintaining a consistent wake-up time
                      could improve your circadian rhythm.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-purple-600">
                      <span>Learn more</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="habits" className="pt-4">
                <div className="flex items-start space-x-4 rounded-lg border p-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Moon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Reduce screen time before bed</h4>
                    <p className="text-sm text-muted-foreground">
                      Our analysis shows you typically use your phone within 30 minutes of bedtime. Try reducing screen
                      exposure 1 hour before sleep to improve sleep quality.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-purple-600">
                      <span>Set a screen time reminder</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="environment" className="pt-4">
                <div className="flex items-start space-x-4 rounded-lg border p-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Moon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Optimize bedroom temperature</h4>
                    <p className="text-sm text-muted-foreground">
                      Your sleep quality improves when your bedroom is between 65-68°F (18-20°C). Consider adjusting
                      your thermostat to this range.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-purple-600">
                      <span>Connect smart thermostat</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Relaxation</CardTitle>
            <CardDescription>Based on your current sleep patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <img
                src="/placeholder.svg?height=180&width=320"
                alt="Guided meditation"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-white font-medium">Deep Sleep Meditation</h4>
                <p className="text-white/80 text-sm">15 minutes</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Sleep Sound Library</span>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-600">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start h-auto py-2">
                <span>Rain Sounds</span>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-2">
                <span>White Noise</span>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-2">
                <span>Ocean Waves</span>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-2">
                <span>Forest Night</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

