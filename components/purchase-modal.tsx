'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/store/auth';
import { AlertCircle } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
}

export function PurchaseModal({ isOpen, product, onClose }: PurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { user } = useAuth();

  // Si no está autenticado, mostrar mensaje
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Inicia Sesión Requerido
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">
              Para realizar compras, debes tener una cuenta activa. Esto nos permite:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Guardar tu información de compra</li>
              <li>✓ Ofrecerte descuentos especiales</li>
              <li>✓ Mantenerte actualizado con tus pedidos</li>
            </ul>
            <Button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    try {
      // Crear la orden
      const orderData = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        userEmail: user?.email || 'guest@example.com',
        status: 'solicitado',
        createdAt: new Date(),
        quantity: 1,
      };

      await addDoc(collection(db, 'orders'), orderData);
      setIsPurchased(true);

      // Esperar 2 segundos y redirigir a WhatsApp
      setTimeout(() => {
        const message = `Hola, me interesa comprar: ${product.name} por ${formatPrice(product.price)}`;
        const whatsappUrl = `https://wa.me/51937074085?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
        setIsPurchased(false);
      }, 2000);
    } catch (error) {
      console.error('Error al procesar compra:', error);
      alert('Error al procesar la compra');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!isPurchased ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Confirmar Compra</DialogTitle>
              <DialogDescription>
                Revisa los detalles antes de confirmar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Precio:</span>
                  <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Stock disponible:</span>
                  <span className="font-semibold text-green-600">{product.stock}</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-sm text-amber-900">
                  ℹ️ Se creará una solicitud y serás redirigido a WhatsApp para completar el pedido.
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmPurchase}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Procesando...' : 'Confirmar Compra'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-green-600">¡Solicitud Recibida!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <div className="text-center">
                <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Solicitud Enviada</h3>
                <p className="text-gray-600 text-sm">Tu solicitud está siendo procesada. Te redirigiremos a WhatsApp para finalizar tu compra.</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
