import { useEffect, useRef, useState } from 'react'
import Casilla from './components/Casilla.jsx'
import Teclado from './components/Teclado.jsx'
import { estadosDe } from './juego.js'

const FILAS = 6
const COLUMNAS = 5
const PALABRAS = [
  'PERRO', 'GATOS', 'CASAS', 'LIBRO', 'NUBES', 'VERDE', 'MUNDO', 'FUEGO', 'PLATO', 'QUESO',
  'RADIO', 'SILLA', 'ARBOL', 'LUNAS', 'SOLAR', 'AGUAS', 'MARCO', 'NIEVE', 'VUELO', 'RAPTO',
  'JUEGO', 'FELIZ', 'AMIGO', 'PLAYA', 'SELVA', 'CLAVE', 'LIMON', 'MANOS', 'PINTA', 'FALSO',
  'CANTO', 'ROSAS', 'PARED', 'TIENE', 'TAREA', 'MARCA', 'METAS', 'RURAL', 'DULCE', 'CIELO',
  'NARDO', 'PRADO', 'BRISA', 'CUBRE', 'VIVIR', 'LARGO', 'MENTE', 'ORSOS', 'SABOR', 'CHICO',
  'RAZON', 'ALERO', 'ASADO', 'AVION', 'BAILE', 'BARCO', 'BASAR', 'BELLO', 'BICHO', 'BLUSA',
  'BOLAR', 'BORRA', 'BRAVO', 'BURRO', 'CABRA', 'CALDO', 'CALMA', 'CAMPO', 'CARRO', 'CASCO',
  'CEDRO', 'CERCA', 'COBRO', 'CORAL', 'CUERO', 'DARDO', 'DEBIL', 'DUCHA', 'EJIDO', 'ELIGE',
  'ENEMA', 'FIRME', 'GANAR', 'GIRAR', 'GLOBO', 'GRANO', 'HABLA', 'HACER', 'HIELO', 'IGUAL',
  'JUGAR', 'LABIO', 'LOGRO', 'MANGO', 'MEDIR', 'NOVEL', 'ORDEN', 'OTROS', 'PASAR', 'PLUMA'
]

function elegirSolucion(anterior) {
  const opciones = PALABRAS.filter((palabra) => palabra !== anterior)
  return opciones[Math.floor(Math.random() * opciones.length)]
}

// Crea un tablero vacío: 6 filas de 5 letras en blanco
function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  const [solucion, setSolucion] = useState(() => elegirSolucion())
  const [aviso, setAviso] = useState('')
  const cursor = useRef(null)

  // El último intento comprobado, como texto: 'PERRO'
  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  useEffect(() => {
    // Lleva el cursor a la primera casilla en la que se puede escribir
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    // Solo aceptamos una letra, o nada si se ha borrado
    if (!/^[A-ZÑ]?$/.test(letra)) return

    // Copiamos el tablero, cambiamos la copia y la guardamos
    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)
    setAviso('')

    // Después de escribir una letra, pasamos a la casilla siguiente
    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

  function manejarRetroceso(evento) {
    if (evento.key === 'Backspace' && evento.currentTarget.value === '') {
      evento.preventDefault()
      evento.currentTarget.previousElementSibling?.focus()
    }
  }

  function insertarLetra(letra) {
    const destino = cursor.current ?? { fila: filaActual, columna: 0 }
    const { fila, columna } = destino
    if (fila !== filaActual || terminada) return

    const copia = intentos.map((intento) => [...intento])
    copia[fila][columna] = letra
    setIntentos(copia)
    setAviso('')
    document.querySelector(`[data-fila="${fila}"][data-columna="${columna + 1}"]:enabled`)?.focus()
  }

  function nuevaPartida() {
    setIntentos(tableroVacio())
    setFilaActual(0)
    setSolucion(elegirSolucion(solucion))
    setAviso('')
    cursor.current = null
  }

  function comprobar(evento) {
    // Evita que el navegador recargue la página al enviar el formulario
    evento.preventDefault()
    if (terminada) return
    // No se puede comprobar una fila incompleta
    if (intentos[filaActual].includes('')) {
      setAviso('Faltan letras')
      return
    }

    setAviso('')
    setFilaActual(filaActual + 1)
  }

  const estadosTeclado = {}
  for (let fila = 0; fila < filaActual; fila++) {
    const estados = estadosDe(intentos[fila].join(''), solucion)
    estados.forEach((estado, columna) => {
      const letra = intentos[fila][columna]
      const prioridad = { ausente: 1, presente: 2, correcta: 3 }
      if (!estadosTeclado[letra] || prioridad[estado] > prioridad[estadosTeclado[letra]]) {
        estadosTeclado[letra] = estado
      }
    })
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => (
          <div className="fila" key={f}>
            {fila.map((letra, c) => (
              <Casilla
                key={c}
                letra={letra}
                fila={f}
                columna={c}
                estado={f < filaActual ? estadosDe(fila.join(''), solucion)[c] : ''}
                activa={f === filaActual && !terminada}
                onCambio={(evento) => cambiarLetra(f, c, evento)}
                onKeyDown={manejarRetroceso}
                onEnfocar={() => { cursor.current = { fila: f, columna: c } }}
              />
            ))}
          </div>
        ))}
      </div>
      {terminada ? (
        <div className="final">
          <p className="mensaje" role="status">
            {ganada ? '¡Enhorabuena, has acertado!' : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={nuevaPartida}>
            Nueva partida
          </button>
        </div>
      ) : (
        <>
          <button className="boton" type="submit">
            Comprobar
          </button>
          <p className="aviso" role="status">{aviso}</p>
          <Teclado estados={estadosTeclado} onLetra={insertarLetra} />
        </>
      )}
    </form>
  )
}


export default App
