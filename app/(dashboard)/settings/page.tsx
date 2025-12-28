"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  timezone: string
  language: string
  avatar: string
  bio: string
}

interface NotificationSettings {
  emailAlerts: boolean
  pushNotifications: boolean
  priceAlerts: boolean
  newsUpdates: boolean
  weeklyReports: boolean
  systemMaintenance: boolean
}

interface PrivacySettings {
  profileVisibility: string
  dataSharing: boolean
  analytics: boolean
  marketingEmails: boolean
}

interface AppearanceSettings {
  theme: string
  fontSize: string
  density: string
  animations: boolean
  compactMode: boolean
}

interface DataSettings {
  autoBackup: boolean
  dataRetention: string
  exportFormat: string
  cloudSync: boolean
}

export default function SettingsPage() {
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+39 123 456 7890",
    timezone: "Europe/Rome",
    language: "Italian",
    avatar: "/api/placeholder/32/32",
    bio: "Experienced trader focused on equity markets and technical analysis."
  })

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: true,
    priceAlerts: true,
    newsUpdates: false,
    weeklyReports: true,
    systemMaintenance: true
  })

  // Privacy State
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "private",
    dataSharing: false,
    analytics: true,
    marketingEmails: false
  })

  // Appearance State
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    fontSize: "medium",
    density: "comfortable",
    animations: true,
    compactMode: false
  })

  // Data State
  const [dataSettings, setDataSettings] = useState<DataSettings>({
    autoBackup: true,
    dataRetention: "1year",
    exportFormat: "csv",
    cloudSync: true
  })

  // UI State
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password change state
  const [passwordChange, setPasswordChange] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  // Track changes
  const trackChange = () => {
    setHasUnsavedChanges(true)
  }

  // Save settings
  const saveSettings = async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLoading(false)
    setHasUnsavedChanges(false)
    toast.success("Settings saved successfully!")
  }

  // Reset to defaults
  const resetToDefaults = () => {
    // Reset all settings to default values
    setProfile({
      name: "John Doe",
      email: "john.doe@example.com", 
      phone: "+39 123 456 7890",
      timezone: "Europe/Rome",
      language: "Italian",
      avatar: "/api/placeholder/32/32",
      bio: "Experienced trader focused on equity markets and technical analysis."
    })
    
    setNotifications({
      emailAlerts: true,
      pushNotifications: true,
      priceAlerts: true,
      newsUpdates: false,
      weeklyReports: true,
      systemMaintenance: true
    })
    
    setPrivacy({
      profileVisibility: "private",
      dataSharing: false,
      analytics: true,
      marketingEmails: false
    })
    
    setAppearance({
      theme: "system",
      fontSize: "medium", 
      density: "comfortable",
      animations: true,
      compactMode: false
    })
    
    setDataSettings({
      autoBackup: true,
      dataRetention: "1year",
      exportFormat: "csv",
      cloudSync: true
    })
    
    setHasUnsavedChanges(false)
    toast.success("Settings reset to defaults!")
  }

  // Change password
  const changePassword = async () => {
    if (passwordChange.new !== passwordChange.confirm) {
      toast.error("New passwords don't match!")
      return
    }
    
    if (passwordChange.new.length < 8) {
      toast.error("Password must be at least 8 characters long!")
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setPasswordChange({ current: "", new: "", confirm: "" })
    setLoading(false)
    toast.success("Password changed successfully!")
  }

  // Delete account
  const deleteAccount = async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    toast.success("Account deletion initiated. You'll receive a confirmation email.")
  }

  // Export data
  const exportData = async (format: string) => {
    setLoading(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    toast.success(`Data exported successfully as ${format.toUpperCase()}!`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved changes
            </Badge>
          )}
          <Button 
            onClick={saveSettings} 
            disabled={!hasUnsavedChanges || loading}
            size="sm"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data & Storage
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, name: e.target.value }))
                      trackChange()
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, email: e.target.value }))
                      trackChange()
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, phone: e.target.value }))
                      trackChange()
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => {
                    setProfile(prev => ({ ...prev, timezone: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Rome">Rome (UTC+1)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profile.language} onValueChange={(value) => {
                    setProfile(prev => ({ ...prev, language: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => {
                    setProfile(prev => ({ ...prev, bio: e.target.value }))
                    trackChange()
                  }}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordChange.current}
                    onChange={(e) => setPasswordChange(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordChange.new}
                    onChange={(e) => setPasswordChange(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordChange.confirm}
                    onChange={(e) => setPasswordChange(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button onClick={changePassword} disabled={loading || !passwordChange.current || !passwordChange.new || !passwordChange.confirm}>
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when prices hit your target levels
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">News Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive market news and analysis updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newsUpdates}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, newsUpdates: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Get weekly performance summaries
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Be notified about scheduled maintenance
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemMaintenance}
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({ ...prev, systemMaintenance: checked }))
                      trackChange()
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => {
                    setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                      <SelectItem value="contacts">Contacts - Only your contacts can see</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing anonymized data for research
                    </p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => {
                      setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve our service with usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => {
                      setPrivacy(prev => ({ ...prev, analytics: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and offers
                    </p>
                  </div>
                  <Switch
                    checked={privacy.marketingEmails}
                    onCheckedChange={(checked) => {
                      setPrivacy(prev => ({ ...prev, marketingEmails: checked }))
                      trackChange()
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>

              {showDeleteConfirm && (
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-destructive">
                      Are you absolutely sure? This action cannot be undone.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete your account, remove all your data from our servers, and cancel your subscriptions.
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={deleteAccount}
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-2 h-4 w-4" />
                        )}
                        Yes, delete my account
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Preferences</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={appearance.theme} onValueChange={(value) => {
                    setAppearance(prev => ({ ...prev, theme: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={appearance.fontSize} onValueChange={(value) => {
                    setAppearance(prev => ({ ...prev, fontSize: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Display Density</Label>
                  <Select value={appearance.density} onValueChange={(value) => {
                    setAppearance(prev => ({ ...prev, density: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={appearance.animations}
                    onCheckedChange={(checked) => {
                      setAppearance(prev => ({ ...prev, animations: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more content with less spacing
                    </p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => {
                      setAppearance(prev => ({ ...prev, compactMode: checked }))
                      trackChange()
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Storage Settings */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your data storage and backup preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup your data daily
                    </p>
                  </div>
                  <Switch
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => {
                      setDataSettings(prev => ({ ...prev, autoBackup: checked }))
                      trackChange()
                    }}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Retention Period</Label>
                  <Select value={dataSettings.dataRetention} onValueChange={(value) => {
                    setDataSettings(prev => ({ ...prev, dataRetention: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Export Format</Label>
                  <Select value={dataSettings.exportFormat} onValueChange={(value) => {
                    setDataSettings(prev => ({ ...prev, exportFormat: value }))
                    trackChange()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cloud Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync your data across all devices
                    </p>
                  </div>
                  <Switch
                    checked={dataSettings.cloudSync}
                    onCheckedChange={(checked) => {
                      setDataSettings(prev => ({ ...prev, cloudSync: checked }))
                      trackChange()
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                Monitor your storage usage and data consumption.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used Storage</span>
                  <span>2.4 GB of 5 GB</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Trading Data</p>
                  <p className="font-medium">1.2 GB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Documents</p>
                  <p className="font-medium">800 MB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Media Files</p>
                  <p className="font-medium">400 MB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Other</p>
                  <p className="font-medium">50 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import & Export</CardTitle>
              <CardDescription>
                Import data from other platforms or export your data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center space-y-2">
                    <Upload className="h-6 w-6 mx-auto" />
                    <div>
                      <p className="font-medium">Import Data</p>
                      <p className="text-xs text-muted-foreground">
                        CSV, JSON, Excel files
                      </p>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4"
                  onClick={() => exportData(dataSettings.exportFormat)}
                  disabled={loading}
                >
                  <div className="text-center space-y-2">
                    {loading ? (
                      <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
                    ) : (
                      <Download className="h-6 w-6 mx-auto" />
                    )}
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-xs text-muted-foreground">
                        {dataSettings.exportFormat.toUpperCase()} format
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetToDefaults}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}