export function estadoDe(letra, columna, solucion) {
  if (solucion[columna] === letra) return 'correcta'
  if (solucion.includes(letra)) return 'presente'
  return 'ausente'
}

export function estadosDe(intento, solucion) {
  const estados = Array(intento.length).fill('ausente')
  const letrasRestantes = solucion.split('')

  for (let columna = 0; columna < intento.length; columna++) {
    if (intento[columna] === solucion[columna]) {
      estados[columna] = 'correcta'
      letrasRestantes[columna] = ''
    }
  }

  for (let columna = 0; columna < intento.length; columna++) {
    if (estados[columna] === 'correcta') continue
    const indice = letrasRestantes.indexOf(intento[columna])
    if (indice !== -1) {
      estados[columna] = 'presente'
      letrasRestantes[indice] = ''
    }
  }

  return estados
}