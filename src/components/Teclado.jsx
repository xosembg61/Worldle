const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM']

function Teclado({ estados, onLetra }) {
  return (
    <div className="teclado" aria-label="Teclado en pantalla">
      {FILAS_TECLADO.map((fila) => (
        <div className="fila-teclado" key={fila}>
          {[...fila].map((letra) => (
            <button
              className={`tecla ${estados[letra] ?? ''}`}
              key={letra}
              type="button"
              aria-label={`Letra ${letra}${estados[letra] ? `, ${estados[letra]}` : ''}`}
              onClick={() => onLetra(letra)}
            >
              {letra}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Teclado