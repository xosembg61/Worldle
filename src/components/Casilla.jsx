function Casilla({ letra, fila, columna, estado = '', activa, onCambio, onKeyDown, onEnfocar }) {
  return (
    <input
      className={`casilla ${estado}`}
      value={letra}
      maxLength={1}
      disabled={!activa}
      aria-label={`Fila ${fila + 1}, columna ${columna + 1}${letra ? `, letra ${letra}` : ''}${estado ? `, ${estado}` : ''}`}
      data-fila={fila}
      data-columna={columna}
      onChange={onCambio}
      onKeyDown={onKeyDown}
      onFocus={onEnfocar}
    />
  )
}

export default Casilla


