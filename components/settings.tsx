"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { 
  Settings, 
  Key, 
  GitBranch, 
  Plug, 
  AlertTriangle, 
  Save, 
  Copy, 
  Eye, 
  EyeOff,
  ExternalLink,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Trash2
} from "lucide-react"

interface JiraIntegration {
  connected: boolean
  baseUrl: string
  username: string
  apiToken: string
  projectKey: string
  syncEnabled: boolean
  lastSync: string
  scope: {
    issues: boolean
    projects: boolean
    workflows: boolean
    comments: boolean
  }
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [showApiKey, setShowApiKey] = useState(false)
  const [jiraIntegration, setJiraIntegration] = useState<JiraIntegration>({
    connected: false,
    baseUrl: "",
    username: "",
    apiToken: "",
    projectKey: "",
    syncEnabled: false,
    lastSync: "",
    scope: {
      issues: true,
      projects: true,
      workflows: false,
      comments: true
    }
  })

  const [generalSettings, setGeneralSettings] = useState({
    projectId: "project_686b6697873fbef61cc0ef86",
    projectName: "JS-Playwright",
    description: "Project for testing JS-Playwright reports",
    dataRetention: "30"
  })

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API Key", key: "sk_test_1234567890abcdef", created: "2024-01-15", lastUsed: "2024-01-20" },
    { id: "2", name: "Development API Key", key: "sk_dev_0987654321fedcba", created: "2024-01-10", lastUsed: "2024-01-19" }
  ])

  const [branchMappings, setBranchMappings] = useState([
    { id: "1", source: "main", target: "production", autoDeploy: true },
    { id: "2", source: "develop", target: "staging", autoDeploy: true },
    { id: "3", source: "feature/*", target: "development", autoDeploy: false }
  ])

  const handleSaveGeneral = () => {
    console.log("Saving general settings:", generalSettings)
    // API call would go here
  }

  const handleJiraConnect = () => {
    setJiraIntegration(prev => ({
      ...prev,
      connected: true,
      lastSync: new Date().toISOString()
    }))
  }

  const handleJiraDisconnect = () => {
    setJiraIntegration(prev => ({
      ...prev,
      connected: false,
      baseUrl: "",
      username: "",
      apiToken: "",
      projectKey: "",
      syncEnabled: false,
      lastSync: ""
    }))
  }

  const handleJiraSync = () => {
    setJiraIntegration(prev => ({
      ...prev,
      lastSync: new Date().toISOString()
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateApiKey = () => {
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const newApiKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never"
    }
    setApiKeys(prev => [...prev, newApiKey])
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id))
  }

  const addBranchMapping = () => {
    const newMapping = {
      id: Date.now().toString(),
      source: "",
      target: "",
      autoDeploy: false
    }
    setBranchMappings(prev => [...prev, newMapping])
  }

  const deleteBranchMapping = (id: string) => {
    setBranchMappings(prev => prev.filter(mapping => mapping.id !== id))
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                Member Organization
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500">
                JS-Playwright
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
          <p className="text-gray-600">Manage your project settings and integrations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="branch-mapping" className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span>Branch Mapping</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center space-x-2">
              <Plug className="h-4 w-4" />
              <span>Integration</span>
            </TabsTrigger>
            <TabsTrigger value="danger-zone" className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your project settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-id">Project ID</Label>
                    <Input
                      id="project-id"
                      value={generalSettings.projectId}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={generalSettings.projectName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, projectName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={generalSettings.description}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention (days)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={generalSettings.dataRetention}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, dataRetention: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveGeneral} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for accessing the Testdino API.</CardDescription>
                  </div>
                  <Button onClick={generateApiKey} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Generate New Key</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <p className="text-sm text-gray-500">
                          Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 font-mono text-sm">
                      {showApiKey ? apiKey.key : "••••••••••••••••••••••••••••••••"}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branch Mapping */}
          <TabsContent value="branch-mapping" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Branch Mapping</CardTitle>
                    <CardDescription>Configure branch mappings for automated deployments.</CardDescription>
                  </div>
                  <Button onClick={addBranchMapping} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Mapping</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {branchMappings.map((mapping) => (
                  <div key={mapping.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <Label>Source Branch</Label>
                        <Input value={mapping.source} placeholder="main" />
                      </div>
                      <div>
                        <Label>Target Environment</Label>
                        <Input value={mapping.target} placeholder="production" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch id={`auto-deploy-${mapping.id}`} checked={mapping.autoDeploy} />
                          <Label htmlFor={`auto-deploy-${mapping.id}`}>Auto Deploy</Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBranchMapping(mapping.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Jira Integration</CardTitle>
                <CardDescription>Connect your Jira instance to sync issues and workflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {jiraIntegration.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <h4 className="font-medium">Connection Status</h4>
                      <p className="text-sm text-gray-500">
                        {jiraIntegration.connected ? "Connected to Jira" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {jiraIntegration.connected ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleJiraSync}
                          className="flex items-center space-x-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Sync</span>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleJiraDisconnect}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleJiraConnect}
                        className="flex items-center space-x-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Connect</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Connection Details */}
                {jiraIntegration.connected && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jira-url">Jira Base URL</Label>
                        <Input
                          id="jira-url"
                          value={jiraIntegration.baseUrl}
                          onChange={(e) => setJiraIntegration(prev => ({ ...prev, baseUrl: e.target.value }))}
                          placeholder="https://your-domain.atlassian.net"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jira-username">Username</Label>
                        <Input
                          id="jira-username"
                          value={jiraIntegration.username}
                          onChange={(e) => setJiraIntegration(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="your-email@domain.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jira-api-token">API Token</Label>
                      <Input
                        id="jira-api-token"
                        type="password"
                        value={jiraIntegration.apiToken}
                        onChange={(e) => setJiraIntegration(prev => ({ ...prev, apiToken: e.target.value }))}
                        placeholder="Enter your Jira API token"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jira-project-key">Project Key</Label>
                      <Input
                        id="jira-project-key"
                        value={jiraIntegration.projectKey}
                        onChange={(e) => setJiraIntegration(prev => ({ ...prev, projectKey: e.target.value }))}
                        placeholder="PROJ"
                      />
                    </div>
                  </div>
                )}

                {/* Sync Settings */}
                {jiraIntegration.connected && (
                  <div className="space-y-4">
                    <Separator />
                    <h4 className="font-medium">Sync Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sync-enabled">Enable Auto Sync</Label>
                          <p className="text-sm text-gray-500">Automatically sync data every hour</p>
                        </div>
                        <Switch
                          id="sync-enabled"
                          checked={jiraIntegration.syncEnabled}
                          onCheckedChange={(checked) => setJiraIntegration(prev => ({ ...prev, syncEnabled: checked }))}
                        />
                      </div>
                      {jiraIntegration.lastSync && (
                        <p className="text-sm text-gray-500">
                          Last sync: {new Date(jiraIntegration.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Scope Settings */}
                {jiraIntegration.connected && (
                  <div className="space-y-4">
                    <Separator />
                    <h4 className="font-medium">Scope of Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="scope-issues">Issues</Label>
                          <p className="text-sm text-gray-500">Sync Jira issues and their status</p>
                        </div>
                        <Switch
                          id="scope-issues"
                          checked={jiraIntegration.scope.issues}
                          onCheckedChange={(checked) => setJiraIntegration(prev => ({ 
                            ...prev, 
                            scope: { ...prev.scope, issues: checked } 
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="scope-projects">Projects</Label>
                          <p className="text-sm text-gray-500">Sync project information and metadata</p>
                        </div>
                        <Switch
                          id="scope-projects"
                          checked={jiraIntegration.scope.projects}
                          onCheckedChange={(checked) => setJiraIntegration(prev => ({ 
                            ...prev, 
                            scope: { ...prev.scope, projects: checked } 
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="scope-workflows">Workflows</Label>
                          <p className="text-sm text-gray-500">Sync workflow configurations</p>
                        </div>
                        <Switch
                          id="scope-workflows"
                          checked={jiraIntegration.scope.workflows}
                          onCheckedChange={(checked) => setJiraIntegration(prev => ({ 
                            ...prev, 
                            scope: { ...prev.scope, workflows: checked } 
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="scope-comments">Comments</Label>
                          <p className="text-sm text-gray-500">Sync issue comments and discussions</p>
                        </div>
                        <Switch
                          id="scope-comments"
                          checked={jiraIntegration.scope.comments}
                          onCheckedChange={(checked) => setJiraIntegration(prev => ({ 
                            ...prev, 
                            scope: { ...prev.scope, comments: checked } 
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone */}
          <TabsContent value="danger-zone" className="space-y-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    These actions cannot be undone. Please be certain before proceeding.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Delete Project</h4>
                        <p className="text-sm text-gray-600">
                          Permanently delete this project and all associated data.
                        </p>
                      </div>
                      <Button variant="destructive">Delete Project</Button>
                    </div>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Clear All Data</h4>
                        <p className="text-sm text-gray-600">
                          Remove all test data, reports, and analytics.
                        </p>
                      </div>
                      <Button variant="destructive">Clear Data</Button>
                    </div>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Revoke All API Keys</h4>
                        <p className="text-sm text-gray-600">
                          Invalidate all existing API keys immediately.
                        </p>
                      </div>
                      <Button variant="destructive">Revoke All Keys</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 