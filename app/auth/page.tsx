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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-3 sm:p-4 pt-20 sm:pt-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <div className="mb-6 sm:mb-8 text-center animate-fade-in relative z-10 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative mx-auto mb-4 sm:mb-6 p-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400">
                    <div className="w-full h-full rounded-full overflow-hidden border-3 sm:border-4 border-black relative">
                        <Image
                            src="/pedro.jpeg"
                            alt="PEDRO SMS Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
                <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Tarjetas digitales de confianza</p>
            </div>

            <Card className="w-full max-w-sm sm:max-w-md shadow-[0_0_40px_rgba(37,99,235,0.1)] border border-blue-500/20 bg-white/5 backdrop-blur-xl relative z-10">
                <CardHeader className="space-y-1 p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center text-white">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </CardTitle>
                    <p className="text-center text-xs sm:text-sm text-gray-400">
                        {isLogin ? 'Ingresa tus credenciales' : 'Regístrate para empezar'}
                    </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-black/40 border-white/10 focus:border-blue-500 text-white placeholder:text-gray-600 h-10 sm:h-11 text-sm"
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
                                className="bg-black/40 border-white/10 focus:border-blue-500 text-white placeholder:text-gray-600 h-10 sm:h-11 text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/40 border-white/10 focus:border-blue-500 text-white placeholder:text-gray-600 h-10 sm:h-11 text-sm"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 sm:h-11 text-sm sm:text-base shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all hover:scale-[1.02] border border-blue-400/30"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : null}
                            {isLogin ? 'Ingresar' : 'Registrarse'}
                        </Button>

                        <div className="relative flex items-center gap-2 py-3 sm:py-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs font-medium text-gray-500 uppercase">O continúa</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <Button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            variant="outline"
                            className="w-full border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-semibold h-10 sm:h-11 text-sm transition-all bg-transparent"
                        >
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
