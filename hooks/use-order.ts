
import { useState } from 'react';
import { OrderService, CreateOrderDTO } from '@/services/order.service';

export function useOrder() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createOrder = async (orderData: CreateOrderDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const orderId = await OrderService.create(orderData);
            return orderId;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createOrder, isLoading, error };
}
