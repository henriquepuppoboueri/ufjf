export function diminuiTexto(text) {
  const limiteCaracteres = 250;
  if (text.length > limiteCaracteres) {
    return text.substr(0, limiteCaracteres) + " <clique para expandir>";
  }
  return text;
}

export function registroPortugues(reg) {
  const nrRegistros =
    reg > 1 ? `registro(s) selecionados.` : `registro selecionado.`;
  return `${reg} ${nrRegistros}`;
}
