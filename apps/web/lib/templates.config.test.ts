import { describe, it, expect } from 'vitest'
import { SPECIALIZED_TEMPLATES } from './templates.config'

describe('SPECIALIZED_TEMPLATES', () => {
  it('should have all required properties for each template', () => {
    Object.values(SPECIALIZED_TEMPLATES).forEach((template) => {
      expect(template.instruction).toBeDefined()
      expect(typeof template.instruction).toBe('string')
      expect(template.instruction.length).toBeGreaterThan(0)

      expect(template.format).toBeDefined()
      expect(typeof template.format).toBe('string')
      expect(template.format.length).toBeGreaterThan(0)

      expect(['sticky', 'table', 'code', 'audit']).toContain(template.panelA_style)
    })
  })

  it('should contain key SDLC milestones', () => {
    const keys = Object.keys(SPECIALIZED_TEMPLATES)
    expect(keys).toContain('Historias de Usuario')
    expect(keys).toContain('Criterios de Aceptación')
    expect(keys).toContain('Diccionario de Datos')
    expect(keys).toContain('Esquema ER')
    expect(keys).toContain('Análisis de Viabilidad')
    expect(keys).toContain('Definición de Stack')
    expect(keys).toContain('Setup del Proyecto')
    expect(keys).toContain('Desarrollo de Features')
    expect(keys).toContain('Configuración de CI/CD')
    expect(keys).toContain('Monitoreo y Alertas')
    expect(keys).toContain('Auditoría OWASP')
    expect(keys).toContain('Automatización de Pruebas')
    expect(keys).toContain('Planes E2E')
  })

  it('should include Mermaid blocks in relevant templates', () => {
    const mermaidTemplates = ['Esquema ER', 'Wireframes', 'Desarrollo de Features', 'Configuración de CI/CD', 'Auditoría OWASP', 'Automatización de Pruebas']
    
    mermaidTemplates.forEach(key => {
      const template = SPECIALIZED_TEMPLATES[key as keyof typeof SPECIALIZED_TEMPLATES]
      expect(template?.format).toContain('mermaid')
    })
  })
})
