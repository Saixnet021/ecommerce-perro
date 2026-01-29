'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Check, X, Package, ShoppingBag, LogOut, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminPage() {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'usuarios'>('productos');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Convertir imagen a base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewProduct({ ...newProduct, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const loadData = async () => {
    const [productsSnapshot, ordersSnapshot] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'orders')),
    ]);

    setProducts(
      productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[]
    );

    setOrders(
      ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Order[]
    );

    // Cargar usuarios desde Firestore
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        // Calcular total de órdenes para este usuario
        totalOrders: ordersSnapshot.docs.filter(d => d.data().userEmail === doc.data().email).length,
        lastOrder: ordersSnapshot.docs
          .filter(d => d.data().userEmail === doc.data().email)
          .sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0))[0]
          ?.data().createdAt?.toDate() || null
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: new Date(),
      });
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        category: '',
      });
      loadData();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      await deleteDoc(doc(db, 'products', id));
      loadData();
    }
  };

  const handleUpdateProduct = async (productId: string, updatedProduct: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', productId), updatedProduct);
      loadData();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar producto');
    }
  };

  const handleApproveOrder = async (order: Order) => {
    try {
      // Actualizar stock de productos
      for (const item of order.items) {
        const productRef = doc(db, 'products', item.id);
        const product = products.find((p) => p.id === item.id);
        if (product) {
          await updateDoc(productRef, {
            stock: product.stock - item.quantity,
          });
        }
      }

      // Actualizar estado de la orden
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'approved',
      });

      loadData();
      alert('Pedido aprobado y stock actualizado');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Error al aprobar pedido');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'rejected',
    });
    loadData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <p className="text-sm text-gray-600 text-center mb-4">
                {isLogin ? 'Inicia sesión para acceder' : 'Crea una cuenta de administrador'}
              </p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black bg-white border-2 border-blue-400 focus:border-blue-600 placeholder-gray-600"
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black bg-white border-2 border-blue-400 focus:border-blue-600 placeholder-gray-600"
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validar que solo admin@admin.com pueda acceder
  const ADMIN_EMAIL = 'admin@admin.com';
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              No tienes permisos para acceder al panel de administración.
            </p>
            <p className="text-center text-sm text-gray-500">
              Usuario: {user.email}
            </p>
            <Button onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 py-8 pt-28">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Panel de Administración</h1>
          <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'productos'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'pedidos'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Pedidos ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'usuarios'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-700 hover:text-gray-900'
              }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuarios ({users.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
          {/* Productos Tab */}
          {activeTab === 'productos' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  Gestión de Productos
                </h2>
                <Button onClick={() => setShowAddProduct(!showAddProduct)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {showAddProduct && (
                <div className="mb-6 p-4 border-2 border-blue-400 rounded-lg bg-blue-50 space-y-3">
                  <Input
                    placeholder="Nombre"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="text-black bg-white border-2 border-gray-300 focus:border-blue-600 placeholder-gray-600"
                  />
                  <Input
                    placeholder="Descripción"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="text-black bg-white border-2 border-gray-300 focus:border-blue-600 placeholder-gray-600"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      className="text-black bg-white border-2 border-gray-300 focus:border-blue-600 placeholder-gray-600"
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      className="text-black bg-white border-2 border-gray-300 focus:border-blue-600 placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 block">Imagen del producto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex h-10 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-600"
                    />
                    {newProduct.imageUrl && (
                      <div className="relative w-full h-24 bg-gray-100 rounded-md overflow-hidden border-2 border-gray-300">
                        <img
                          src={newProduct.imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Categoría"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="text-black bg-white border-2 border-gray-300 focus:border-blue-600 placeholder-gray-600"
                  />
                  <Button onClick={handleAddProduct} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                    Guardar Producto
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-blue-400 transition-all">
                    <div className="space-y-3">
                      {editingProduct === product.id ? (
                        <>
                          <Input
                            value={product.name}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, name: e.target.value } : p);
                              setProducts(updated);
                            }}
                            className="text-black bg-white border-2 border-gray-300 focus:border-blue-600"
                          />
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, stock: parseInt(e.target.value) } : p);
                              setProducts(updated);
                            }}
                            className="text-black bg-white border-2 border-gray-300 focus:border-blue-600"
                            placeholder="Stock"
                          />
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p);
                              setProducts(updated);
                            }}
                            className="text-black bg-white border-2 border-gray-300 focus:border-blue-600"
                            placeholder="Precio"
                          />
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-gray-900">{product.name}</h4>
                          <div className="text-sm space-y-1">
                            <p className="text-blue-600 font-semibold">{formatPrice(product.price)}</p>
                            <p className="text-gray-700">
                              Stock: <span className={product.stock > 10 ? 'text-green-600 font-bold' : product.stock > 0 ? 'text-yellow-600 font-bold' : 'text-red-600 font-bold'}>{product.stock}</span>
                            </p>
                          </div>
                        </>
                      )}
                      <div className="flex gap-2 pt-2">
                        {editingProduct === product.id ? (
                          <>
                            <Button
                              onClick={() => handleUpdateProduct(product.id, {
                                name: product.name,
                                stock: product.stock,
                                price: product.price
                              })}
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingProduct(null)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => setEditingProduct(product.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-2 border-gray-400 text-gray-900"
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pedidos Tab */}
          {activeTab === 'pedidos' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                Gestión de Pedidos
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {orders
                  .filter((order) => order.status === 'pending')
                  .map((order) => (
                    <div key={order.id} className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50 hover:border-blue-400 transition">
                      <div className="mb-3">
                        <p className="font-bold text-gray-900">{order.userEmail}</p>
                        <p className="text-sm text-gray-600">
                          Fecha: {order.createdAt?.toLocaleDateString('es-ES') || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border-2 border-gray-200 mb-3">
                        <p className="font-bold text-gray-900">{order.items?.[0]?.name || 'Producto desconocido'} {order.items?.length > 1 ? `(+${order.items.length - 1} más)` : ''}</p>
                        <p className="text-blue-600 font-semibold">Items: {order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0}</p>
                        <p className="text-lg font-bold text-gray-900">Total: {formatPrice(order.finalTotal || order.total || 0)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveOrder(order)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                {orders.filter((order) => order.status === 'pending').length === 0 && (
                  <p className="text-center text-gray-600 py-12 text-lg font-medium">No hay pedidos pendientes</p>
                )}
              </div>
            </div>
          )}

          {/* Usuarios Tab */}
          {activeTab === 'usuarios' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                Gestión de Usuarios
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Nombre</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Registrado</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Total de Órdenes</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Última Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-gray-900 font-medium">{user.displayName || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-700">{user.email}</td>
                        <td className="py-3 px-4 text-gray-700 text-sm">{user.createdAt?.toLocaleDateString('es-ES') || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{user.totalOrders}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 text-sm">
                          {user.lastOrder?.toLocaleDateString('es-ES') || 'Sin pedidos'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-center text-gray-600 py-12 text-lg font-medium">No hay usuarios registrados</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
