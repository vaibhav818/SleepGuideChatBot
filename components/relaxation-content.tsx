import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Headphones, Heart, PlayCircle, Search, Star, Timer, Waves } from "lucide-react"

export default function RelaxationContent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relaxation Techniques</h1>
          <p className="text-muted-foreground">Guided exercises to help you sleep better</p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search techniques..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="recommended">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="sounds">Sleep Sounds</TabsTrigger>
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=180&width=320"
                  alt="Deep Sleep Meditation"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
                <Badge className="absolute top-2 right-2 bg-purple-600">AI Recommended</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Deep Sleep Meditation</CardTitle>
                <CardDescription>Guided meditation for restful sleep</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>15 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-amber-400" />
                    <span>4.8 (245)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">Start Session</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=180&width=320"
                  alt="Rainfall Ambience"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rainfall Ambience</CardTitle>
                <CardDescription>Gentle rain sounds for sleep</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>8 hours</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-amber-400" />
                    <span>4.9 (412)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">Start Session</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=180&width=320"
                  alt="4-7-8 Breathing Technique"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">4-7-8 Breathing Technique</CardTitle>
                <CardDescription>Calming breath work for sleep</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>5 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-amber-400" />
                    <span>4.7 (189)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">Start Session</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="rounded-md overflow-hidden h-12 w-12 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=48&width=48"
                      alt="Ocean Waves"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Ocean Waves</h3>
                    <p className="text-sm text-muted-foreground">Played yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <PlayCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="rounded-md overflow-hidden h-12 w-12 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=48&width=48"
                      alt="Body Scan Meditation"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Body Scan Meditation</h3>
                    <p className="text-sm text-muted-foreground">Played 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <PlayCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meditation" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src="/placeholder.svg?height=180&width=320"
                    alt={`Meditation ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{`Meditation ${i + 1}`}</CardTitle>
                  <CardDescription>Guided meditation for better sleep</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{`${5 + i * 5} minutes`}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-amber-400" />
                      <span>{`${4 + (i % 10) / 10} (${100 + i * 20})`}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full">Start Session</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sounds" className="mt-6">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { name: "Rainfall", icon: Waves, duration: "8 hours" },
              { name: "Ocean Waves", icon: Waves, duration: "10 hours" },
              { name: "White Noise", icon: Headphones, duration: "12 hours" },
              { name: "Forest Night", icon: Headphones, duration: "8 hours" },
              { name: "Fireplace", icon: Headphones, duration: "6 hours" },
              { name: "Fan Sound", icon: Headphones, duration: "10 hours" },
              { name: "City Rain", icon: Waves, duration: "8 hours" },
              { name: "Thunderstorm", icon: Waves, duration: "6 hours" },
            ].map((sound, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <sound.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-1">{sound.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sound.duration}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    <span>Play</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breathing" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>4-7-8 Breathing</CardTitle>
                <CardDescription>A technique to help you fall asleep faster</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">4</div>
                    <p className="text-sm text-muted-foreground">Inhale</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This breathing pattern aims to reduce anxiety and help you sleep. Inhale through your nose for 4
                  seconds, hold your breath for 7 seconds, and exhale through your mouth for 8 seconds.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>2 minutes</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>5 minutes</span>
                    </Button>
                  </div>
                  <Button>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    <span>Start</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Box Breathing</CardTitle>
                <CardDescription>Equal duration breathing for relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-4">
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 h-32 w-32">
                    <div className="bg-purple-200 rounded flex items-center justify-center text-purple-800 text-sm">
                      Inhale
                    </div>
                    <div className="bg-purple-200 rounded flex items-center justify-center text-purple-800 text-sm">
                      Hold
                    </div>
                    <div className="bg-purple-200 rounded flex items-center justify-center text-purple-800 text-sm">
                      Exhale
                    </div>
                    <div className="bg-purple-200 rounded flex items-center justify-center text-purple-800 text-sm">
                      Hold
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Box breathing involves inhaling, holding your breath, exhaling, and holding again, all for equal
                  counts. This technique helps calm your nervous system and prepare for sleep.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>2 minutes</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>5 minutes</span>
                    </Button>
                  </div>
                  <Button>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    <span>Start</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progressive Relaxation</CardTitle>
                <CardDescription>Systematically relax your entire body</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-purple-600" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Progressive muscle relaxation involves tensing and then releasing each muscle group in your body. This
                  technique helps reduce physical tension and prepare your body for sleep.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>10 minutes</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>15 minutes</span>
                    </Button>
                  </div>
                  <Button>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    <span>Start</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guided Visualization</CardTitle>
                <CardDescription>Mental imagery for relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-purple-600" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Guided visualization involves imagining peaceful scenes to help calm your mind and body. This
                  technique can help reduce anxiety and prepare you for sleep.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>10 minutes</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>20 minutes</span>
                    </Button>
                  </div>
                  <Button>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    <span>Start</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

