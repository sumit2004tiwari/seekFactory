import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Phone, Mail, MapPin, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

interface ProfileData {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  website: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  businessType: string;
}

const ProfileManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    website: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
    },
    businessType: "manufacturer",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Initialize profile with user data
    setProfile({
      name: user.name || "",
      email: user.email || "",
      companyName: (user as any).companyName || "",
      phone: (user as any).phone || "",
      website: (user as any).website || "",
      description: (user as any).description || "",
      address: {
        street: (user as any).address?.street || "",
        city: (user as any).address?.city || "",
        state: (user as any).address?.state || "",
        country: (user as any).address?.country || "India",
        zipCode: (user as any).address?.zipCode || "",
      },
      businessType: (user as any).businessType || "manufacturer",
    });
    
    setIsLoading(false);
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await apiClient.updateProfile({
        name: profile.name,
        companyName: profile.companyName,
        phone: profile.phone,
        businessType: profile.businessType,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Profile Management</h1>
            <p className="text-muted-foreground">
              Manage your account information and business details
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="business">Business Details</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        placeholder="Your email address"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profile.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select
                        value={profile.businessType}
                        onValueChange={(value) => handleInputChange('businessType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      value={profile.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your business..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Business Address
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={profile.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={profile.address.zipCode}
                          onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Account Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Verification</h4>
                        <p className="text-sm text-muted-foreground">Verify your email address</p>
                      </div>
                      <Badge variant={user?.isEmailVerified ? "default" : "secondary"}>
                        {user?.isEmailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Business Verification</h4>
                        <p className="text-sm text-muted-foreground">Verify your business credentials</p>
                      </div>
                      <Badge variant={user?.isVerified ? "default" : "secondary"}>
                        {user?.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Verification features will be implemented in the next phase of development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} variant="accent">
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
