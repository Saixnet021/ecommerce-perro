
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export const ProductService = {
    async getAll(): Promise<Product[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Product[];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
};
