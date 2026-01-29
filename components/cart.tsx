'use client';

import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const user = useAuth((state) => state.user);

  const handleCheckout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para continuar');
      return;
    }

    // Aquí irá la lógica de crear orden y enviar WhatsApp
    const total = getTotal();
    const message = `🛒 *Nuevo Pedido PEDRO SMS*\n\n` +
      `Cliente: ${user.email}\n` +
      `Items:\n${items.map(item => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\n` +
      `*Total: ${formatPrice(total)}*`;

    const whatsappUrl = `https://wa.me/51937074085?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 border-2 border-blue-700"
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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-gray-300">
              {/* Header */}
              <div className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  Tu Carrito
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-900 hover:text-gray-700 p-1 hover:bg-gray-200 rounded transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-2 border-gray-200 p-4 rounded-lg hover:border-blue-400 transition">
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex-shrink-0 border-2 border-gray-200">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-3xl">
                              🎮
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-blue-600 font-semibold">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 border-2 border-gray-300 bg-white text-gray-900 font-bold rounded hover:bg-gray-100 transition"
                            >
                              −
                            </button>
                            <span className="font-bold text-gray-900 min-w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                              className="px-3 py-1 border-2 border-gray-300 bg-white text-gray-900 font-bold rounded hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition font-bold"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <span className="font-bold text-gray-900 text-lg">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}

                    {/* Subtotal y Total */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <span className="font-bold text-gray-900">{formatPrice(getTotal())}</span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-3">
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-bold text-gray-900">Total:</span>
                          <span className="font-bold text-blue-600 text-2xl">{formatPrice(getTotal())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="flex-1 border-2 border-gray-400 text-gray-900 font-bold hover:bg-gray-100"
                      >
                        Continuar Comprando
                      </Button>
                      <Button
                        onClick={handleCheckout}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
                        size="lg"
                      >
                        Comprar por WhatsApp
                      </Button>
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
