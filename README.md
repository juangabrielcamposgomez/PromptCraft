# 🚀 PromptCraft Academy: SDLC AI-Augmented Engineering

**PromptCraft Academy** es una plataforma de ingeniería de élite diseñada para dominar el Ciclo de Vida de Desarrollo de Software (SDLC) mediante la orquestación avanzada de Inteligencia Artificial. No es solo un generador de prompts; es un ecosistema completo que guía a desarrolladores —desde aprendices hasta profesionales— en la creación de software robusto, seguro y escalable.

---

## 🌟 Características Principales

### 🛠️ Motor de Plantillas SDLC Especializadas
Implementación de 14 pilares técnicos que cubren todas las fases del desarrollo profesional:
*   **Análisis & Requerimientos**: Historias de Usuario, Análisis de Viabilidad y NFRs.
*   **Modelado de Datos**: Diccionarios de Datos, Esquemas ER (Mermaid) y Normalización.
*   **Arquitectura & UI**: Wireframes, Design Tokens y Blueprints de Stack Técnico.
*   **Implementación**: Setup de Proyecto y Desarrollo de Features con planes de acción.
*   **DevOps & QA**: Pipelines CI/CD, Planes E2E (Playwright) y Automatización de Pruebas.
*   **Seguridad Proactiva**: Auditoría OWASP, Análisis Snyk y Defensa en Profundidad.

### 📊 Methodology Hub (Scrum & Kanban)
Gestión ágil integrada directamente en el flujo de ingeniería:
*   **Tablero Dual**: Alterna entre la agilidad de Scrum (Sprints/Story Points) y el flujo continuo de Kanban.
*   **Hitos Automáticos**: Sincronización en tiempo real entre la generación de artefactos de IA y el progreso del tablero.
*   **Snapshot History**: Historial auditable de todas las iteraciones técnicas realizadas.

### 🎨 Wide View UI & UX Premium
*   **Espacio de Trabajo Expandido**: Interfaz optimizada para pantallas anchas con visualización simultánea de configuración y resultados.
*   **Visualización Mermaid**: Renderizado dinámico de diagramas de arquitectura, flujos y esquemas de base de datos.
*   **Diseño 100% Responsivo**: Experiencia fluida en dispositivos móviles, tablets y escritorio.

---

## 🏗️ Stack Tecnológico

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components).
*   **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) con diseño Glassmorphism.
*   **Base de Datos**: PostgreSQL alojado en **AWS RDS**.
*   **ORM**: [Prisma 7+](https://www.prisma.io/) con soporte para transacciones atómicas.
*   **Testing**: [Vitest](https://vitest.dev/) con mocks avanzados para lógica de negocio.
*   **Monorepo**: [Turborepo](https://turbo.build/) para una gestión eficiente de paquetes.

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
*   Node.js 20+
*   pnpm 9+

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/OriundoStartup/PromptCraft-Academy.git
   ```
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Configura las variables de entorno en `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db"
   OPENAI_API_KEY="tu-api-key"
   ```

### Desarrollo
Para iniciar el entorno de desarrollo local:
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Pruebas
Ejecutar la suite de pruebas unitarias:
```bash
# Todos los paquetes
pnpm test

# Específico para la web
pnpm --filter web test
```

---

## 🛡️ Seguridad & Calidad
El proyecto sigue los más estrictos estándares de seguridad:
*   **Cero Secretos Hardcodeados**: Gestión estricta mediante variables de entorno.
*   **Auditoría OWASP**: Plantillas integradas para el análisis de vulnerabilidades.
*   **Test Coverage**: Validación de lógica de negocio crítica en el paquete `@devflow/core`.

---

## 🤝 Contribuciones
Mantenido por el equipo de **Oriundo Startup**. Si deseas contribuir, por favor abre un Pull Request o crea un Issue para discutir los cambios.

---
*Desarrollado con ❤️ para la comunidad de ingeniería de software.*
