import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { formatRwandanFrancs, convertToRwandanFrancs } from "../lib/currency";
import { Product } from "../types/product";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
    enabled: !!id, // only run query if id exists
  });

  useEffect(() => {
    if (error) {
      navigate("/not-found");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-blue-800">
            {formatRwandanFrancs(convertToRwandanFrancs(product.price))}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
