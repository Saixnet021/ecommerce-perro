'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductCard } from '@/components/product-card';
import { Cart } from '@/components/cart';
import { Product } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, ShoppingCart, TrendingUp, Users, Award, Zap, Shield, Headphones, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    [featuresRef, statsRef, catalogRef, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [featuresRef, statsRef, catalogRef, ctaRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-28">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 animate-slide-down">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 px-2">
              Explora Nuestro Productos
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 px-4">
              Los mejores productos del mercado a un solo clic
            </p>

            <div className="max-w-xl md:max-w-2xl mx-auto relative px-2">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4 md:w-5 md:h-5" />
              <Input
                type="text"
                placeholder="Busca tu producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base text-black bg-white border-2 border-blue-300 focus:border-blue-100 placeholder:text-gray-500 w-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12" ref={statsRef} id="stats">
            <div className={`bg-white shadow-lg p-6 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${visibleElements.has('stats') ? 'animate-fade-in' : 'opacity-0'
              }`} style={{ animationDelay: '0s' }}>
              <Zap className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              <p className="text-gray-700">Productos Activos</p>
            </div>
            <div className={`bg-white shadow-lg p-6 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${visibleElements.has('stats') ? 'animate-fade-in' : 'opacity-0'
              }`} style={{ animationDelay: '0.1s' }}>
              <Users className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
              <p className="text-3xl font-bold text-gray-900">90+</p>
              <p className="text-gray-700">Clientes Satisfechos</p>
            </div>
            <div className={`bg-white shadow-lg p-6 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${visibleElements.has('stats') ? 'animate-fade-in' : 'opacity-0'
              }`} style={{ animationDelay: '0.2s' }}>
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
              <p className="text-3xl font-bold text-gray-900">150+</p>
              <p className="text-gray-700">Ventas Realizadas</p>
            </div>
            <div className={`bg-white shadow-lg p-6 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${visibleElements.has('stats') ? 'animate-fade-in' : 'opacity-0'
              }`} style={{ animationDelay: '0.3s' }}>
              <Award className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="text-gray-700">Garantía</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16 border-t border-b border-blue-200" ref={featuresRef} id="features">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center group ${visibleElements.has('features') ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '0s' }}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 transform group-hover:scale-110">
                <Shield className="w-8 h-8 text-blue-950" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% Seguro</h3>
              <p className="text-gray-600">Tarjetas verificadas y auténticas con garantía de funcionamiento</p>
            </div>
            <div className={`text-center group ${visibleElements.has('features') ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '0.1s' }}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 transform group-hover:scale-110">
                <Truck className="w-8 h-8 text-blue-950" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Recibe tus códigos automáticamente después del pago</p>
            </div>
            <div className={`text-center group ${visibleElements.has('features') ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '0.2s' }}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 transform group-hover:scale-110">
                <Headphones className="w-8 h-8 text-blue-950" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Soporte 24/7</h3>
              <p className="text-gray-600">Equipo disponible para ayudarte en cualquier momento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <div className="container mx-auto px-4 py-16" id="productos" ref={catalogRef}>
        <div className={`text-center mb-12 ${visibleElements.has('productos') ? 'animate-fade-in' : 'opacity-0'
          }`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 text-lg">
            Elige entre nuestras mejores productos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron productos con ese término' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${visibleElements.has('productos') ? 'animate-scale-in' : 'opacity-0'
                  }`}
                style={{
                  animationDelay: visibleElements.has('productos') ? `${index * 0.05}s` : '0s'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 py-16" ref={ctaRef} id="cta">
        <div className={`container mx-auto px-4 text-center ${visibleElements.has('cta') ? 'animate-fade-in' : 'opacity-0'
          }`}>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">¿Listo para comprar?</h2>
          <p className="text-gray-700 mb-8 text-lg">
            Realiza tu compra ahora y recibe tu código al instante
          </p>
          <Button
            onClick={scrollToProducts}
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg font-bold transition-all duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            Explorar Catálogo
          </Button>
        </div>
      </div>

      <Cart />
    </div>
  );
}
