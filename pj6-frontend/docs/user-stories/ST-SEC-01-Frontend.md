---
id: ST-SEC-01
title: Pantalla de Login y Recuperación de Contraseña (Frontend)
layer: frontend      # frontend | backend | both
priority: high       # high | medium | low
status: in-review   # implementada, pendiente de aprobación QA/PO

---

# ST-SEC-01 — Pantalla de Login y Recuperación de Contraseña (Frontend)

**Como** usuario registrado de la aplicación  
**Quiero** disponer de una interfaz de inicio de sesión y un flujo visual para recuperar mi contraseña  
**Para** poder acceder a mi cuenta de forma sencilla, segura y autónoma.

## Descripción

Implementar la interfaz de usuario para el proceso de autenticación y recuperación de contraseña, incluyendo validaciones en tiempo real, manejo de estados visuales, accesibilidad y experiencia de usuario. La historia contempla únicamente el desarrollo del frontend y la integración con servicios ya existentes.

## Criterios de aceptación

### Login

- [ ] La pantalla debe renderizar los siguientes elementos:
  - Campo **Correo Electrónico**.
  - Campo **Contraseña**.
  - Botón **Iniciar Sesión**.
  - Enlace **¿Olvidaste tu contraseña?**.

- [ ] El campo de correo electrónico debe validar en tiempo real el formato `usuario@dominio.com`.

- [ ] El campo de contraseña debe:
  - Mostrarse enmascarado por defecto.
  - Permitir alternar entre mostrar y ocultar la contraseña mediante un icono.

- [ ] El botón **Iniciar Sesión** debe permanecer habilitado únicamente cuando el formulario sea válido.

- [ ] Al enviar el formulario:
  - El botón debe deshabilitarse.
  - Debe mostrarse un indicador visual de carga (spinner).
  - Deben evitarse múltiples envíos simultáneos.

### Recuperación de contraseña

- [ ] Al seleccionar **¿Olvidaste tu contraseña?**, el usuario debe navegar a una vista secundaria o visualizar un modal.

- [ ] La pantalla de recuperación debe solicitar únicamente el correo electrónico registrado.

- [ ] El correo electrónico debe validarse en tiempo real.

- [ ] Tras una respuesta exitosa del servicio, debe mostrarse el mensaje:

> Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.

- [ ] La interfaz no debe mostrar mensajes diferenciados según exista o no el correo.

### Manejo de errores y feedback

- [ ] Si la autenticación falla, debe mostrarse el mensaje:

> Correo electrónico o contraseña incorrectos.

- [ ] Ante errores de red o errores inesperados, debe mostrarse una notificación global mediante toast, snackbar o alerta.

- [ ] Los mensajes de error deben ser claros para el usuario y no exponer información técnica.

## Requisitos no funcionales

### Seguridad

- [ ] Sanitizar los datos ingresados antes de enviarlos al backend.
- [ ] Evitar mostrar información sensible en mensajes de error.
- [ ] Prevenir múltiples solicitudes simultáneas.

### Accesibilidad

- [ ] Todos los controles deben ser navegables mediante teclado.
- [ ] Los campos y botones deben incluir atributos `aria-label`.
- [ ] El flujo debe ser compatible con lectores de pantalla.

### UX/UI

- [ ] Implementar los estilos definidos en `technical-preferences.md`.
- [ ] Mantener consistencia visual con el sistema de diseño.
- [ ] Garantizar visualización responsive en desktop y dispositivos móviles.
- [ ] Implementar estados visuales para loading, error, foco y éxito.

## Tareas técnicas

### Componentes

- [ ] Implementar componente de Login.
- [ ] Implementar componente/modal de recuperación de contraseña.
- [ ] Implementar componente reutilizable para notificaciones.

### Validaciones

- [ ] Implementar validación de correo electrónico.
- [ ] Implementar validación del formulario.
- [ ] Implementar control de múltiples envíos.

### Estados

- [ ] Implementar estados de carga.
- [ ] Implementar estados de error.
- [ ] Implementar estados de éxito.
- [ ] Implementar navegación entre vistas.

### Accesibilidad

- [ ] Configurar navegación por teclado.
- [ ] Agregar atributos ARIA.
- [ ] Validar compatibilidad con lectores de pantalla.

## Definición de terminado (DoD)

- [ ] Todos los criterios de aceptación implementados.
- [ ] La interfaz es responsive.
- [ ] Las validaciones frontend funcionan correctamente.
- [ ] Las pruebas visuales y funcionales son satisfactorias.
- [ ] La accesibilidad básica ha sido validada.
- [ ] La historia ha sido aprobada por QA y Product Owner.
