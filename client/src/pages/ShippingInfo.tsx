import { Card, CardContent } from "../components/ui/card";
import { Truck, MapPin, Clock, AlertCircle } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Store Pickup Only</h2>
            </div>
            <p className="mb-4">
              Currently, DiscountMart operates on a store pickup model only. We do not offer home delivery 
              or shipping services at this time.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Why Store Pickup?</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Store pickup allows us to offer you the best discount prices by reducing our operational costs. 
                    Plus, you can inspect your items before taking them home!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Pickup Timeline</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Order Processing:</span>
                <span className="text-gray-600">Within 24 hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Ready for Pickup:</span>
                <span className="text-gray-600">Email notification sent</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Pickup Window:</span>
                <span className="text-gray-600">7 days from notification</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Our Store Location</h2>
            <div className="space-y-2">
              <p className="font-medium">DiscountMart</p>
              <p>15 KN 4 Ave</p>
              <p>Downtown Kigali, Rwanda</p>
              <p className="text-gray-600">Phone: +(250)780152723</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Store Hours:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Monday - Friday:</p>
                <p>9:00 AM - 8:00 PM</p>
                <p>Saturday:</p>
                <p>9:00 AM - 6:00 PM</p>
                <p>Sunday:</p>
                <p>10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Future Shipping Plans</h2>
            </div>
            <p className="mb-4">
              We're constantly working to improve our services. Home delivery and shipping options 
              are being considered for the future to better serve our customers.
            </p>
            <p className="text-sm text-gray-600">
              Stay tuned for updates on our website and social media channels for any new shipping options!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
