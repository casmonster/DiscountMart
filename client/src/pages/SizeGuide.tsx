
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function SizeGuide() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Size Guide</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Find the perfect fit with our comprehensive size guide. All measurements are in centimeters unless otherwise specified.
        </p>
      </div>

      <Tabs defaultValue="clothing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="tableware">Tableware</TabsTrigger>
          <TabsTrigger value="home-decor">Home Items</TabsTrigger>
        </TabsList>

        <TabsContent value="clothing" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Men's Clothing</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Chest (cm)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Waist (cm)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">S</td>
                      <td className="border border-gray-300 px-4 py-2">88-96</td>
                      <td className="border border-gray-300 px-4 py-2">76-84</td>
                      <td className="border border-gray-300 px-4 py-2">68-70</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">M</td>
                      <td className="border border-gray-300 px-4 py-2">96-104</td>
                      <td className="border border-gray-300 px-4 py-2">84-92</td>
                      <td className="border border-gray-300 px-4 py-2">70-72</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">L</td>
                      <td className="border border-gray-300 px-4 py-2">104-112</td>
                      <td className="border border-gray-300 px-4 py-2">92-100</td>
                      <td className="border border-gray-300 px-4 py-2">72-74</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">XL</td>
                      <td className="border border-gray-300 px-4 py-2">112-120</td>
                      <td className="border border-gray-300 px-4 py-2">100-108</td>
                      <td className="border border-gray-300 px-4 py-2">74-76</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Women's Clothing</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Bust (cm)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Waist (cm)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">XS</td>
                      <td className="border border-gray-300 px-4 py-2">78-82</td>
                      <td className="border border-gray-300 px-4 py-2">58-62</td>
                      <td className="border border-gray-300 px-4 py-2">83-87</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">S</td>
                      <td className="border border-gray-300 px-4 py-2">82-86</td>
                      <td className="border border-gray-300 px-4 py-2">62-66</td>
                      <td className="border border-gray-300 px-4 py-2">87-91</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">M</td>
                      <td className="border border-gray-300 px-4 py-2">86-90</td>
                      <td className="border border-gray-300 px-4 py-2">66-70</td>
                      <td className="border border-gray-300 px-4 py-2">91-95</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">L</td>
                      <td className="border border-gray-300 px-4 py-2">90-94</td>
                      <td className="border border-gray-300 px-4 py-2">70-74</td>
                      <td className="border border-gray-300 px-4 py-2">95-99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tableware" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Dinnerware Specifications</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Dinner Plates</h3>
                  <p className="text-gray-600">Standard diameter: 25-27 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Salad Plates</h3>
                  <p className="text-gray-600">Standard diameter: 20-22 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Bowls</h3>
                  <p className="text-gray-600">Capacity: 300-500 ml, Diameter: 15-18 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Cups</h3>
                  <p className="text-gray-600">Capacity: 200-300 ml, Height: 8-10 cm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Glassware Specifications</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Water Glasses</h3>
                  <p className="text-gray-600">Capacity: 250-350 ml, Height: 10-12 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Wine Glasses</h3>
                  <p className="text-gray-600">Capacity: 150-200 ml, Height: 18-20 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Cocktail Glasses</h3>
                  <p className="text-gray-600">Capacity: 120-180 ml, Height: 15-17 cm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home-decor" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Home Decor Dimensions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Small Vases</h3>
                  <p className="text-gray-600">Height: 15-25 cm, Diameter: 8-12 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Medium Vases</h3>
                  <p className="text-gray-600">Height: 25-35 cm, Diameter: 12-18 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Large Vases</h3>
                  <p className="text-gray-600">Height: 35-50 cm, Diameter: 18-25 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Throw Blankets</h3>
                  <p className="text-gray-600">Standard size: 130 x 180 cm</p>
                </div>
                <div>
                  <h3 className="font-medium">Decorative Lamps</h3>
                  <p className="text-gray-600">Table lamps: 30-45 cm height, Floor lamps: 120-150 cm height</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Measurement Tips</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Measure your space before purchasing furniture or large decor items</li>
                <li>Consider the scale of items in relation to your room size</li>
                <li>For clothing, measure yourself rather than relying on your usual size</li>
                <li>If you're between sizes, we recommend sizing up for comfort</li>
                <li>Contact us if you need specific measurements for any item</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}