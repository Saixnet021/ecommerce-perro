
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/store/cart.store';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { PurchaseModal } from '@/features/orders/components/purchase-modal';

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
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/20 bg-black/60 shadow-xl rounded-xl backdrop-blur-md">
                {/* Subtle border instead of moving gradient */}
                <div className="absolute inset-0 rounded-xl p-[1px] bg-transparent group-hover:bg-blue-500/30 -z-10 transition-all opacity-0 group-hover:opacity-100" />

                <div className="h-full overflow-hidden flex flex-col">
                    <div className="relative h-40 sm:h-56 bg-gray-900/50 overflow-hidden group-hover:scale-105 transition-transform duration-700">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-opacity"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-b from-blue-900/20 to-black/20">
                                <span className="text-6xl animate-bounce-slow filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🎮</span>
                            </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse border border-white/10">
                                ¡Últimas Unidades!
                            </div>
                        )}
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-red-600/90 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12 border-2 border-white/20 shadow-xl">AGOTADO</span>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/20">
                        <div className="space-y-2 sm:space-y-3">
                            <div>
                                <h3 className="font-bold text-base sm:text-xl line-clamp-1 text-white transition-colors tracking-wide">{product.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mt-1 min-h-[32px] sm:min-h-[40px] font-medium">{product.description}</p>
                            </div>

                            <div className="flex items-end justify-between border-t border-white/5 pt-2 sm:pt-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider">Precio</span>
                                    <span className="text-xl sm:text-2xl font-black text-blue-400 tracking-tight drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${product.stock > 0
                                        ? 'bg-blue-900/30 text-blue-300 border-blue-500/30'
                                        : 'bg-red-900/30 text-red-300 border-red-500/30'
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} Disponibles` : 'Sin Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-4 mt-1 sm:mt-2">
                            <Button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                disabled={product.stock === 0}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all border border-blue-400/30 h-9 sm:h-10 text-xs sm:text-sm px-2"
                            >
                                <CheckCircle className="w-4 h-4 mr-0.5 sm:mr-1" />
                                Comprar
                            </Button>
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                variant="outline"
                                className="border border-blue-500/50 bg-blue-950/20 text-blue-400 hover:bg-blue-900/40 hover:text-cyan-300 hover:border-cyan-400/50 font-bold backdrop-blur-sm shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] h-9 sm:h-10 text-xs sm:text-sm px-2"
                            >
                                <ShoppingCart className="w-4 h-4 mr-0.5 sm:mr-1" />
                                Carrito
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                product={product}
                onClose={() => setIsPurchaseModalOpen(false)}
            />
        </>
    );
}
