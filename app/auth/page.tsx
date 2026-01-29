'use client';

import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { auth } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await updateProfile(user, {
                    displayName: name
                });

                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        displayName: name,
                        createdAt: new Date(),
                        role: 'user'
                    });
                } catch (error) {
                    console.error("Error creating user document:", error);
                }
            }
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-24">
            <div className="mb-8 text-center animate-fade-in">
                <div className="w-20 h-20 relative mx-auto mb-4">
                    <Image
                        src="/pedro.jpeg"
                        alt="PEDRO SMS Logo"
                        fill
                        className="object-contain rounded-full shadow-lg"
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido a PEDRO SMS</h1>
                <p className="text-gray-600 mt-2">Tu tienda de confianza de tarjetas digitales</p>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-2 border-blue-100 bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-gray-900">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </CardTitle>
                    <p className="text-center text-sm text-gray-500">
                        {isLogin ? 'Ingresa tus credenciales para continuar' : 'Regístrate para comenzar a comprar'}
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 h-11"
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 h-11"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 shadow-md transition-all hover:scale-[1.03]"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : null}
                            {isLogin ? 'Ingresar' : 'Registrarse'}
                        </Button>

                        <div className="relative flex items-center gap-2 py-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs font-medium text-gray-400 uppercase">O continúa con</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <Button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            variant="outline"
                            className="w-full border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700 font-semibold h-11 transition-all"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
