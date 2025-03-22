// Información sobre la configuración de autenticación en Supabase

/**
 * Para habilitar la autenticación por correo electrónico y contraseña en Supabase, necesitas:
 * 
 * 1. Acceder al panel de control de Supabase: https://app.supabase.io
 * 2. En tu proyecto, ir a "Authentication" > "Providers"
 * 3. Activar "Email" como proveedor de autenticación
 * 4. Configurar las opciones según tus necesidades:
 *    - Confirmar correos (recomendado para producción)
 *    - Permitir acceso sin confirmación (útil durante desarrollo)
 *    - Personalizar plantillas de correo si lo deseas
 * 
 * También puedes configurar políticas de seguridad y redirecciones
 * para manejar el proceso de inicio de sesión y registro.
 * 
 * Para la gestión de usuarios, dirígete a "Authentication" > "Users"
 * donde podrás ver, gestionar y eliminar usuarios del sistema.
 */

export const authConfig = {
    // Estas son las variables de entorno necesarias para la autenticación
    // Ya deberían estar configuradas en tu archivo .env.local
    // NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    // Rutas de la aplicación
    routes: {
        login: '/login',
        register: '/register',
        home: '/',
        unauthorized: '/login',
    }
} 