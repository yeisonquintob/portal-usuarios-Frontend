export const environment = {
    production: true,
    apiUrl: 'http://localhost:5223', // Cambiar por la URL de producción cuando esté disponible
    tokenExpiryTime: 3600,
    refreshTokenExpiryTime: 604800,
    defaultPageSize: 10,
    maxPageSize: 50,
    uploadMaxSize: 5242880,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en']
  };