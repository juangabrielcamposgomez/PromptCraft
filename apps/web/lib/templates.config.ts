export type ResultType = 'USER_STORY' | 'ACCEPTANCE_CRITERIA' | 'MASTER_PROMPT' | 'TECHNICAL_SPEC' | 'SECURITY_AUDIT';

export interface SpecializedTemplate {
  instruction: string;
  format: string;
  panelA_style: 'sticky' | 'table' | 'code' | 'audit';
}

export const SPECIALIZED_TEMPLATES: Record<string, SpecializedTemplate> = {
  'Análisis Snyk': {
    instruction: "Actúa como un DevSecOps Engineer especializado en Snyk. Analiza las dependencias declaradas e identifica paquetes vulnerables o con licencias riesgosas.",
    format: `
Genera el Dependency Health Report:
1. **Vulnerability Scan**: [Lista de CVEs detectados en simulación]
2. **License Compliance**: [Check de licencias permitidas/prohibidas]
3. **Remediation Plan**: [Comandos como npm audit fix o actualizaciones de versión]
4. **Concepto Zero Trust**: [Breve explicación de por qué no confiar en dependencias externas]
    `,
    panelA_style: 'audit'
  },
  'Defensa en Profundidad': {
    instruction: "Actúa como un Security Architect. Diseña una estrategia de Defensa en Profundidad multicapa (Red, App, Datos, Admin) para evitar puntos únicos de falla.",
    format: `
Genera el Layered Security Blueprint:
1. **Diagrama de Capas (Mermaid)**:
\`\`\`mermaid
graph TD
    subgraph Edge[Capa de Red]
    WAF[WAF / VPC]
    end
    subgraph App[Capa de Aplicación]
    Auth[Auth / Validation]
    end
    subgraph Data[Capa de Datos]
    Encrypt[Encryption at Rest]
    end
    Edge --> App
    App --> Data
\`\`\`
2. **Matriz de Controles**: [Definición de privilegios mínimos e IAM Roles]
3. **Estrategia de Blindaje**: [Detalle de cada nivel de la 'cebolla' de seguridad]
    `,
    panelA_style: 'code'
  },
  'Auditoría OWASP': {
    instruction: "Actúa como un Auditor de Seguridad (Ethical Hacker). Revisa los requerimientos bajo el estándar OWASP Top 10. Genera un reporte de vulnerabilidades y un mapa de calor de riesgos.",
    format: `
Genera el Security Audit Report:
1. **Risk Heatmap (Mermaid)**:
\`\`\`mermaid
quadrantChart
    title Mapa de Calor de Riesgos
    x-axis Impacto Bajo --> Impacto Alto
    y-axis Probabilidad Baja --> Probabilidad Alta
    Inyeccion SQL: [0.8, 0.9]
    Broken Auth: [0.7, 0.8]
    XSS: [0.5, 0.6]
\`\`\`
2. **Plan de Mitigación**: [Acciones para cerrar brechas]
3. **Security Headers**: [Configuración recomendada]
    `,
    panelA_style: 'audit'
  },
  'Automatización de Pruebas': {
    instruction: "Actúa como un QA Automation Engineer. Crea una estrategia de pruebas unitarias e integrales con Vitest/Jest, definiendo casos de éxito y falla.",
    format: `
Genera el Test Suite Blueprint:
1. **Test Runner Flow (Mermaid)**:
\`\`\`mermaid
graph TD
    A[Mock Data] --> B[Execute Function]
    B --> C{Assertion}
    C -->|Pass| D[Success Report]
    C -->|Fail| E[Error Log]
\`\`\`
2. **Ejemplo de Código (.test.ts)**: [Snippet de prueba]
3. **Métricas de Cobertura**: [Objetivo de cobertura sugerido]
    `,
    panelA_style: 'code'
  },
  'Planes E2E': {
    instruction: "Actúa como un SDET (Software Development Engineer in Test). Diseña un plan de pruebas End-to-End con Playwright/Cypress centrado en el Critical User Path.",
    format: `
Genera el E2E Testing Plan:
- **Critical User Path**: [Flujo de inicio a fin]
- **Automation Script**: [Estructura del script Playwright]
- **Validación de UI**: [Puntos de control visual]
- **Lecciones Aprendidas**: [Por qué este flujo es crítico]
    `,
    panelA_style: 'sticky'
  },
  'Configuración de CI/CD': {
    instruction: "Actúa como un DevOps Engineer. Diseña un pipeline de CI/CD profesional. Proporciona la configuración YAML para automatizar el ciclo de vida del código.",
    format: `
Genera el Pipeline Blueprint:
1. **Workflow Visual (Mermaid)**:
\`\`\`mermaid
graph LR
    A[Push] --> B[Lint/Build]
    B --> C[Test QA]
    C --> D[Deploy Stage]
    D --> E[Deploy Prod]
\`\`\`
2. **Configuración YAML**: [Proporciona un ejemplo de GitHub Actions o Amplify YAML]
3. **Estrategia de Despliegue**: [Blue-Green o Rolling Update]
    `,
    panelA_style: 'code'
  },
  'Monitoreo y Alertas': {
    instruction: "Actúa como un Cloud Architect. Define una estrategia de observabilidad completa y un sistema de alertas proactivo.",
    format: `
Genera el Observability Dashboard:
- **Métricas Críticas (KPIs)**: [Uso CPU, Latencia DB, Errores 5xx]
- **Protocolo de Alerta**: [Configuración para Slack/Email]
- **Health Checks**: [Endpoints de salud del sistema]
- **Log Management**: [Estrategia de centralización de logs]
    `,
    panelA_style: 'audit'
  },
  'Setup del Proyecto': {
    instruction: "Actúa como un Monorepo Specialist. Define la estructura de carpetas óptima, archivos de configuración (package.json, tsconfig) y la estrategia de compartición de código entre paquetes.",
    format: `
Genera el Blueprint del Proyecto:
1. **Árbol de Directorios**:
\`\`\`text
root/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   └── core/
└── package.json
\`\`\`
2. **Dependencias Clave**: [Lista de paquetes críticos]
3. **Justificación Pedagógica**: [Por qué usar monorepo y esta estructura]
    `,
    panelA_style: 'code'
  },
  'Desarrollo de Features': {
    instruction: "Actúa como un Senior Fullstack Engineer. Transforma los criterios de aceptación en un plan de implementación técnica, detallando el flujo de datos entre cliente y servidor.",
    format: `
Genera el Plan de Implementación:
1. **Data Flow Diagram (Mermaid)**:
\`\`\`mermaid
sequenceDiagram
    Client->>ServerAction: Invoca mutación
    ServerAction->>Prisma: Persiste datos
    Prisma-->>Client: Revalida Path
\`\`\`
2. **Lógica de Negocio**: [Pasos técnicos para implementar la feature]
3. **Manejo de Errores**: [Estrategia de validación y fallos]
    `,
    panelA_style: 'code'
  },
  'Wireframes': {
    instruction: "Actúa como un UX Architect. Define la estructura esquelética priorizando la usabilidad y la jerarquía. Genera un diagrama de bloques en Mermaid para visualizar el layout.",
    format: `
Genera el UX Blueprint:
1. **Layout Diagram (Mermaid)**:
\`\`\`mermaid
graph TD
    A[Header] --> B[Sidebar]
    A --> C[Main Content]
    C --> D[Result Grid]
\`\`\`
2. **Inventario de Componentes**: [Lista de elementos necesarios]
3. **Flujo de Usuario**: [Pasos críticos de interacción]
    `,
    panelA_style: 'code'
  },
  'Prototipo de Alta Fidelidad': {
    instruction: "Actúa como un Senior Product Designer experto en Tailwind 4. Define el estilo visual completo, tokens de diseño y micro-interacciones con Framer Motion.",
    format: `
Genera la Ficha de Identidad Visual:
- **Design Tokens**: Colores (Hex/HSL), Tipografías, Espaciado.
- **Configuración Tailwind**: [Clases clave para el look & feel]
- **Micro-interacciones**: [Definición de animaciones]
- **Accesibilidad**: [Cumplimiento WCAG]
    `,
    panelA_style: 'sticky'
  },
  'Diccionario de Datos': {
    instruction: "Actúa como un Database Administrator (DBA). Genera una tabla técnica exhaustiva de entidades y campos. Utiliza tipos de datos optimizados para PostgreSQL y explica la semántica de cada restricción.",
    format: `
Genera el Diccionario de Datos en formato tabla Markdown:
| Entidad | Campo | Tipo de Dato | Restricciones | Descripción Pedagógica |
|---------|-------|--------------|---------------|------------------------|
| [Nombre]| [ID]  | [UUID/INT]   | [PK, NOT NULL]| [Explicación de negocio]|
    `,
    panelA_style: 'table'
  },
  'Esquema ER': {
    instruction: "Actúa como un Data Architect. Define las relaciones entre tablas y proporciona el código Mermaid.js para su visualización. Explica la integridad referencial.",
    format: `
Genera el Blueprint de Arquitectura:
1. **Diagrama Mermaid.js** (Usa formato erDiagram):
\`\`\`mermaid
erDiagram
    TABLA1 ||--o{ TABLA2 : "relación"
\`\`\`
2. **Cardinalidad y Relaciones**: [Explicación técnica]
3. **Integridad**: [PKs, FKs y reglas de borrado/actualización]
    `,
    panelA_style: 'code'
  },
  'Análisis de Viabilidad': {
    instruction: "Actúa como un Arquitecto de Soluciones Senior. Analiza los requerimientos y detecta cuellos de botella técnicos o dependencias críticas. Genera un informe de viabilidad técnica destacando latencia de datos y escalabilidad.",
    format: `
Genera un Reporte de Viabilidad (Semáforo):
- **Viabilidad Técnica:** [Puntaje 1-10] + Justificación.
- **Disponibilidad de Datos:** [Real-time / Batch / Mock] + Fuente.
- **Complejidad:** [Baja/Media/Alta].
- **Riesgos Críticos:** [Mínimo 2 puntos de fallo].
- **Recomendación Go/No-Go:** [Decisión final].
    `,
    panelA_style: 'audit'
  },
  'Definición de Stack': {
    instruction: "Actúa como un CTO. Define el stack tecnológico óptimo justificando cada elección técnica basada en los 'Principios de Arquitectura de Oriundo' (Next.js, Prisma, PostgreSQL, AWS).",
    format: `
Genera el Tech Stack Blueprint:
- **Core Stack:** [Framework, DB, ORM]
- **Justificación de Ingeniería:** [Por qué elegir estas herramientas para este caso específico]
- **Integraciones:** [Servicios de terceros necesarios]
- **Estrategia de Escalado:** [Cómo crecerá este stack]
    `,
    panelA_style: 'code'
  },
  'Historias de Usuario': {
    instruction: "Actúa como Product Owner. Transforma los requerimientos en Historias de Usuario siguiendo el estándar INVEST.",
    format: `
Genera 3 Historias de Usuario con este formato:
- **ID:** [US-00X]
- **Título:** [Título descriptivo]
- **Como:** [Rol definido]
- **Quiero:** [Acción funcional]
- **Para:** [Valor de negocio/beneficio]
- **Prioridad:** [MoSCoW]
- **Story Points:** [Sugerencia de estimación]
    `,
    panelA_style: 'sticky'
  },
  'Criterios de Aceptación': {
    instruction: "Actúa como QA Engineer. Para cada funcionalidad, escribe criterios de aceptación sin ambigüedades. Usa estrictamente el formato BDD/Gherkin.",
    format: `
Para cada funcionalidad clave, genera:
- **Escenario:** [Nombre del caso de uso]
- **GIVEN** (Dado que) [Contexto inicial]
- **WHEN** (Cuando) [Action del usuario]
- **THEN** (Entonces) [Resultado esperado]
- **Checklist QA:** [Mínimo 3 validaciones técnicas]
    `,
    panelA_style: 'table'
  },
  'Pentesting ZAP': {
    instruction: "Actúa como Security Researcher. Identifica vulnerabilidades basadas en OWASP Top 10.",
    format: `
Genera un reporte de seguridad preventiva:
- **Vulnerabilidad:** [Nombre]
- **Riesgo:** [Alto/Medio/Bajo]
- **Mitigación:** [Cómo arreglarlo]
- **Test Case:** [Cómo probarlo]
    `,
    panelA_style: 'audit'
  }
};
