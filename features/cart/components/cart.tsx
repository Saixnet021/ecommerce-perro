
'use client';

import { useCart } from '../store/cart.store';
import { useAuth } from '@/features/auth/store/auth.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
    const user = useAuth((state) => state.user);

    const handleCheckout = async () => {
        if (!user) {
            alert('Debes iniciar sesión para continuar');
            return;
        }

        const total = getTotal();

        try {
            // Guardar orden en Firestore
            await addDoc(collection(db, 'orders'), {
                userEmail: user.email,
                items: items,
                total: total,
                status: 'pending',
                createdAt: new Date(),
            });

            const message = `🛒 *Nuevo Pedido PEDRO SMS*\n\n` +
                `Cliente: ${user.email}\n` +
                `Items:\n${items.map(item => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\n` +
                `*Total: ${formatPrice(total)}*`;

            const whatsappUrl = `https://wa.me/51937074085?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            clearCart();
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Hubo un error al procesar el pedido. Por favor intenta nuevamente.');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all z-50 border-2 border-blue-400/50 group"
            >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                        {items.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                        <div className="bg-black backdrop-blur-xl rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col border-t sm:border border-blue-500/20 pointer-events-auto">
                            {/* Header */}
                            <div className="flex flex-row items-center justify-between p-5 md:p-6 bg-gradient-to-r from-blue-900/20 to-transparent border-b border-white/10">
                                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                    Tu Carrito
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 bg-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                                            <ShoppingCart className="w-10 h-10 text-gray-600" />
                                        </div>
                                        <p className="text-xl font-bold text-gray-500">Tu carrito está vacío</p>
                                        <Button
                                            variant="link"
                                            onClick={() => setIsOpen(false)}
                                            className="mt-4 text-blue-500"
                                        >
                                            Ir a ver productos
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 border border-white/10 p-4 rounded-xl bg-white/5 hover:border-blue-500/30 transition-all group">
                                                <div className="relative w-24 h-24 bg-gray-900 rounded-lg flex-shrink-0 border border-white/5 overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-3xl">🎮</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div className="space-y-0.5">
                                                        <h4 className="font-bold text-white text-sm sm:text-lg leading-tight truncate">{item.name}</h4>
                                                        <p className="text-xs sm:text-sm text-blue-400 font-bold">{formatPrice(item.price)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center border border-white/10 rounded-lg bg-black/40 p-0.5">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white transition"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="font-bold text-white min-w-6 sm:min-w-8 text-center text-xs sm:text-base">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white transition"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-between py-1">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-full transition"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                    <span className="font-black text-white text-sm sm:text-xl tracking-tight">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Total y Botones */}
                                        <div className="mt-4 sm:mt-6 p-4 md:p-6 bg-blue-900/10 rounded-xl border border-blue-500/20 space-y-3 sm:space-y-4">
                                            <div className="flex justify-between items-center text-lg sm:text-2xl">
                                                <span className="font-bold text-white">Total:</span>
                                                <span className="font-black text-blue-400 tracking-tighter">{formatPrice(getTotal())}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                                                <Button
                                                    onClick={() => setIsOpen(false)}
                                                    variant="outline"
                                                    className="border-white/10 bg-white/5 text-gray-300 font-bold hover:bg-white/10 hover:text-white h-10 sm:h-12 text-xs sm:text-sm"
                                                >
                                                    Más Productos
                                                </Button>
                                                <Button
                                                    onClick={handleCheckout}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 sm:h-12 text-xs sm:text-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] border border-blue-400/30"
                                                >
                                                    Confirmar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
