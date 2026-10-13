import { expect, test } from 'vitest'
import { estadosDe, estadoDe } from './juego.js'

test('letra en su sitio', () => {
  expect(estadoDe('P', 0, 'PERRO')).toBe('correcta')
})

test('letra en otra posición', () => {
  expect(estadoDe('O', 0, 'PERRO')).toBe('presente')
})

test('letra que no está en la solución', () => {
  expect(estadoDe('X', 0, 'PERRO')).toBe('ausente')
})

test('limita las letras repetidas a las que aparecen en la solución', () => {
  expect(estadosDe('RRRRR', 'PERRO')).toEqual([
    'ausente',
    'ausente',
    'correcta',
    'correcta',
    'ausente',
  ])
})