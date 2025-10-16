'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, TrendingUp, Globe, FileText, Settings, BarChart3, Users, Zap, Calculator, Download, RefreshCw } from 'lucide-react'

interface SEOService {
  id: string
  name: string
  description: string
  basePrice: number
  unit: string
  icon: React.ReactNode
  category: string
}

interface CalculatorState {
  services: Record<string, number>
  projectDuration: number
  competitionLevel: 'low' | 'medium' | 'high'
  businessSize: 'small' | 'medium' | 'enterprise'
  targetGeographies: number
  monthlyRetainer: boolean
}

const seoServices: SEOService[] = [
  {
    id: 'on-page-seo',
    name: 'On-Page SEO',
    description: 'Meta tags, content optimization, internal linking',
    basePrice: 500,
    unit: 'page',
    icon: <FileText className="w-5 h-5" />,
    category: 'optimization'
  },
  {
    id: 'technical-seo',
    name: 'Technical SEO',
    description: 'Site speed, schema markup, crawl optimization',
    basePrice: 800,
    unit: 'audit',
    icon: <Settings className="w-5 h-5" />,
    category: 'optimization'
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Blog posts, articles, landing pages',
    basePrice: 150,
    unit: 'piece',
    icon: <FileText className="w-5 h-5" />,
    category: 'content'
  },
  {
    id: 'link-building',
    name: 'Link Building',
    description: 'Backlink acquisition and outreach',
    basePrice: 200,
    unit: 'link',
    icon: <Globe className="w-5 h-5" />,
    category: 'off-page'
  },
  {
    id: 'local-seo',
    name: 'Local SEO',
    description: 'Google Business Profile, local citations',
    basePrice: 300,
    unit: 'month',
    icon: <Users className="w-5 h-5" />,
    category: 'local'
  },
  {
    id: 'analytics-reporting',
    name: 'Analytics & Reporting',
    description: 'Performance tracking and monthly reports',
    basePrice: 400,
    unit: 'month',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics'
  }
]

const competitionMultipliers = {
  low: 1.0,
  medium: 1.3,
  high: 1.6
}

const businessSizeMultipliers = {
  small: 1.0,
  medium: 1.4,
  enterprise: 2.0
}

export default function SEOCostCalculator() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    services: {},
    projectDuration: 6,
    competitionLevel: 'medium',
    businessSize: 'small',
    targetGeographies: 1,
    monthlyRetainer: false
  })

  const [totalCost, setTotalCost] = useState(0)
  const [breakdown, setBreakdown] = useState<Record<string, number>>({})

  useEffect(() => {
    calculateTotal()
  }, [calculatorState])

  const calculateTotal = () => {
    let subtotal = 0
    const newBreakdown: Record<string, number> = {}

    // Calculate service costs
    Object.entries(calculatorState.services).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = seoServices.find(s => s.id === serviceId)
        if (service) {
          let serviceCost = service.basePrice * quantity
          
          // Apply competition multiplier
          serviceCost *= competitionMultipliers[calculatorState.competitionLevel]
          
          // Apply business size multiplier
          serviceCost *= businessSizeMultipliers[calculatorState.businessSize]
          
          // Apply geography multiplier
          serviceCost *= (1 + (calculatorState.targetGeographies - 1) * 0.2)
          
          // Apply duration multiplier for one-time services
          if (!['analytics-reporting', 'local-seo'].includes(serviceId)) {
            serviceCost = serviceCost * Math.min(calculatorState.projectDuration / 6, 2)
          }
          
          subtotal += serviceCost
          newBreakdown[service.name] = serviceCost
        }
      }
    })

    // Add monthly retainer fee if selected
    if (calculatorState.monthlyRetainer) {
      const retainerFee = 2000 * competitionMultipliers[calculatorState.competitionLevel] * 
                         businessSizeMultipliers[calculatorState.businessSize]
      subtotal += retainerFee * calculatorState.projectDuration
      newBreakdown['Monthly Retainer'] = retainerFee * calculatorState.projectDuration
    }

    setTotalCost(subtotal)
    setBreakdown(newBreakdown)
  }

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    setCalculatorState(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: quantity
      }
    }))
  }

  const resetCalculator = () => {
    setCalculatorState({
      services: {},
      projectDuration: 6,
      competitionLevel: 'medium',
      businessSize: 'small',
      targetGeographies: 1,
      monthlyRetainer: false
    })
  }

  const exportResults = () => {
    const results = {
      totalCost,
      breakdown,
      settings: calculatorState,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'seo-cost-calculator-results.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            SEO Cost Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get accurate pricing estimates for your SEO strategy with our comprehensive calculator
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Settings */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  Project Settings
                </CardTitle>
                <CardDescription>
                  Configure your project parameters for accurate pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="competition">Competition Level</Label>
                    <Select
                      value={calculatorState.competitionLevel}
                      onValueChange={(value: 'low' | 'medium' | 'high') =>
                        setCalculatorState(prev => ({ ...prev, competitionLevel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Competition</SelectItem>
                        <SelectItem value="medium">Medium Competition</SelectItem>
                        <SelectItem value="high">High Competition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-size">Business Size</Label>
                    <Select
                      value={calculatorState.businessSize}
                      onValueChange={(value: 'small' | 'medium' | 'enterprise') =>
                        setCalculatorState(prev => ({ ...prev, businessSize: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small Business</SelectItem>
                        <SelectItem value="medium">Medium Business</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Project Duration: {calculatorState.projectDuration} months</Label>
                  <Slider
                    value={[calculatorState.projectDuration]}
                    onValueChange={([value]) =>
                      setCalculatorState(prev => ({ ...prev, projectDuration: value }))
                    }
                    max={24}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>3 months</span>
                    <span>24 months</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Target Geographies: {calculatorState.targetGeographies}</Label>
                  <Slider
                    value={[calculatorState.targetGeographies]}
                    onValueChange={([value]) =>
                      setCalculatorState(prev => ({ ...prev, targetGeographies: value }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Local</span>
                    <span>Global</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="retainer">Monthly Retainer</Label>
                    <p className="text-sm text-muted-foreground">
                      Ongoing SEO management and support
                    </p>
                  </div>
                  <Switch
                    id="retainer"
                    checked={calculatorState.monthlyRetainer}
                    onCheckedChange={(checked) =>
                      setCalculatorState(prev => ({ ...prev, monthlyRetainer: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services Selection */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  SEO Services
                </CardTitle>
                <CardDescription>
                  Select the services you need for your SEO strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="off-page">Off-Page</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-6">
                    {seoServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        quantity={calculatorState.services[service.id] || 0}
                        onQuantityChange={(quantity) => updateServiceQuantity(service.id, quantity)}
                      />
                    ))}
                  </TabsContent>
                  
                  {['optimization', 'content', 'off-page', 'local', 'analytics'].map((category) => (
                    <TabsContent key={category} value={category} className="space-y-4 mt-6">
                      {seoServices
                        .filter(service => service.category === category)
                        .map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            quantity={calculatorState.services[service.id] || 0}
                            onQuantityChange={(quantity) => updateServiceQuantity(service.id, quantity)}
                          />
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  Total Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  {formatCurrency(totalCost)}
                </div>
                <p className="text-emerald-100 text-sm">
                  Estimated total cost for {calculatorState.projectDuration} months
                </p>
                
                <Separator className="bg-emerald-400" />
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Cost Breakdown</h4>
                  {Object.entries(breakdown).length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(breakdown).map(([item, cost]) => (
                        <div key={item} className="flex justify-between text-sm">
                          <span className="text-emerald-100">{item}</span>
                          <span className="font-medium">{formatCurrency(cost)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-100 text-sm">Select services to see breakdown</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={exportResults}
                    disabled={totalCost === 0}
                    className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex-1 border-white text-white hover:bg-white hover:text-emerald-600"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Services Selected</span>
                  <Badge variant="secondary">
                    {Object.values(calculatorState.services).filter(q => q > 0).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Average</span>
                  <span className="font-semibold">
                    {formatCurrency(totalCost / calculatorState.projectDuration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Competition</span>
                  <Badge 
                    variant={calculatorState.competitionLevel === 'high' ? 'destructive' : 
                            calculatorState.competitionLevel === 'medium' ? 'default' : 'secondary'}
                  >
                    {calculatorState.competitionLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: SEOService
  quantity: number
  onQuantityChange: (quantity: number) => void
}

function ServiceCard({ service, quantity, onQuantityChange }: ServiceCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50 hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
          {service.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{service.name}</h4>
          <p className="text-sm text-muted-foreground">{service.description}</p>
          <p className="text-sm font-medium text-emerald-600 mt-1">
            ${service.basePrice}/{service.unit}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          disabled={quantity === 0}
        >
          -
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-16 text-center"
          min="0"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>
    </div>
  )
}