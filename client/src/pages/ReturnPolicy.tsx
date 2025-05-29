import { Card, CardContent } from "@/components/ui/card";

export default function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Return Policy</h1>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">30-Day Return Policy</h2>
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              you can return most items within 30 days of pickup for a full refund.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be unused and in their original packaging</li>
              <li>All tags and labels must be attached</li>
              <li>Please bring your receipt or order confirmation</li>
              <li>Refunds will be processed to the original payment method</li>
              <li>Custom or personalized items cannot be returned unless defective</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">How to Return Items</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Step 1: Visit Our Store</h3>
                <p className="text-gray-600">Bring the item(s) and your receipt to our store location during business hours.</p>
              </div>
              <div>
                <h3 className="font-medium">Step 2: Inspection</h3>
                <p className="text-gray-600">Our staff will inspect the item to ensure it meets our return criteria.</p>
              </div>
              <div>
                <h3 className="font-medium">Step 3: Process Refund</h3>
                <p className="text-gray-600">Once approved, we'll process your refund immediately.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Exchanges</h2>
            <p className="mb-4">
              We're happy to exchange items for a different size or color, subject to availability. 
              Exchanges follow the same 30-day timeframe and condition requirements as returns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Damaged or Defective Items</h2>
            <p className="mb-4">
              If you receive a damaged or defective item, please contact us immediately. We'll arrange 
              for a replacement or full refund, even outside the normal return window.
            </p>
            <p className="text-sm text-gray-600">
              For questions about returns, call us at +(250)780152723 or email us through our contact page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}