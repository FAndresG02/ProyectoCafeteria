# Guía de contribución

Gracias por interesarte en contribuir a Proyecto Cafetería. Este documento describe las prácticas básicas para trabajar con el repositorio y mantener el código limpio.

## Cómo contribuir

1. Haz un fork del repositorio.
2. Crea una rama nueva con un nombre descriptivo:

```bash
git checkout -b feature/nombre-de-la-mejora
```

3. Realiza cambios pequeños y enfocados.
4. Añade comentarios claros en los commits.
5. Envía un pull request explicando:
   - Qué problema resuelve.
   - Qué cambios se hicieron.
   - Cómo probarlo.

## Estándares de código

- Usa **ESLint / Prettier** en los archivos Angular.
- Mantén los componentes y servicios separados.
- En el backend, sigue la convención de paquetes de Spring Boot.
- No subas credenciales ni archivos `*.env`.

## Pruebas

- Verifica que el frontend compile con `npm run build`.
- Ejecuta el backend con `./mvnw test` si agregas pruebas.

## Reporte de errores

Si encuentras un bug o deseas mejorar la documentación:

- Crea un issue detallado.
- Marca el tipo de problema: bug, mejora o documentación.

## Comunicación

- Usa mensajes de commit claros.
- Describe el propósito del cambio en el pull request.
- Si el cambio es grande, comenta primero en el issue.
