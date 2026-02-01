'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { PurchaseModal } from './purchase-modal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addItem(product);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-500 bg-white h-full flex flex-col">
        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gradient-to-br from-blue-600 to-blue-500 flex-shrink-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl sm:text-6xl">🎮</span>
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              ¡Últimas!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Agotado
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
          <div className="space-y-3 flex-1 flex flex-col">
            <h3 className="font-bold text-sm sm:text-base line-clamp-1 text-gray-800">{product.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 gap-2">
              <span className="text-lg sm:text-xl font-bold text-blue-600 truncate">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">Stock: {product.stock}</span>
            </div>
            <div className="flex gap-2 pt-2 mt-auto">
              <Button
                onClick={() => setIsPurchaseModalOpen(true)}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                Comprar
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant="outline"
                className="flex-1 border-blue-300 hover:bg-blue-50 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                Carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <PurchaseModal 
        isOpen={isPurchaseModalOpen}
        product={product}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </>
  );
}
