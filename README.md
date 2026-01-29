# PEDRO SMS - Ecommerce de Tarjetas de Juego

Plataforma de ecommerce para vender tarjetas de juego con autenticación, carrito de compras y panel de administración.

## 🚀 Stack Tecnológico

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Firebase** - Autenticación y base de datos
- **Zustand** - Gestión de estado
- **Lucide React** - Iconos

## 📋 Características

✅ Autenticación con Firebase (Email/Password)  
✅ Catálogo de productos con búsqueda  
✅ Carrito de compras persistente  
✅ Sistema de descuentos automáticos  
✅ Integración con WhatsApp para pedidos  
✅ Panel de administración  
✅ Gestión de productos (CRUD)  
✅ Gestión de pedidos  
✅ Control de stock en tiempo real  
✅ Diseño responsive y moderno  

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar Firebase:**

   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Activa Authentication (Email/Password)
   - Activa Firestore Database
   - Copia las credenciales de configuración

3. **Crear archivo `.env.local`:**
```bash
cp .env.local.example .env.local
```

4. **Editar `.env.local` con tus credenciales de Firebase:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 🚀 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Estructura del Proyecto

```
├── app/
│   ├── admin/          # Panel de administración
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de inicio (catálogo)
├── components/
│   ├── ui/             # Componentes base (Button, Input, Card)
│   ├── auth-button.tsx # Autenticación
│   ├── cart.tsx        # Carrito de compras
│   ├── navbar.tsx      # Barra de navegación
│   └── product-card.tsx # Tarjeta de producto
├── lib/
│   ├── firebase.ts     # Configuración Firebase
│   └── utils.ts        # Utilidades
├── store/
│   ├── auth.ts         # Estado de autenticación
│   └── cart.ts         # Estado del carrito
└── types/
    └── index.ts        # Tipos TypeScript
```

## 🛒 Flujo de Compra

1. Usuario busca y agrega productos al carrito
2. Revisa el carrito (puede modificar cantidades)
3. Click en "Finalizar Compra"
4. Se crea un pedido con estado "pending"
5. Se abre WhatsApp con el mensaje pre-llenado
6. Admin aprueba/rechaza desde el panel
7. Al aprobar, se descuenta el stock automáticamente

## 👨‍💼 Panel de Admin

Accede a `/admin` después de iniciar sesión.

**Funciones:**
- ➕ Agregar nuevos productos
- 🗑️ Eliminar productos
- ✅ Aprobar pedidos (descuenta stock)
- ❌ Rechazar pedidos
- 📊 Ver todos los pedidos pendientes

## 📱 WhatsApp

Edita el número de WhatsApp en `components/cart.tsx`:
```typescript
const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
```

Cambia `51999999999` por tu número (con código de país).

## 🚀 Deploy en Vercel

1. Sube el código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno en Vercel
4. Deploy automático

---

**Desarrollado con ❤️ usando Next.js y Firebase**

