
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CreateOrderDTO {
    userEmail: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string;
        category: string;
    }>;
    total: number;
    status: string;
    createdAt: Date;
}

export const OrderService = {
    async create(orderData: CreateOrderDTO): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'orders'), orderData);
            return docRef.id;
        } catch (error) {
            console.error('Error al crear la orden:', error);
            throw error;
        }
    }
};
