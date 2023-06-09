import { exportFile } from "quasar";

export function diminuiTexto(text) {
  const limiteCaracteres = 250;
  if (text && text.length > limiteCaracteres) {
    const returnText = text.substr(0, limiteCaracteres) + '... <i><b> clique para expandir <b><i>'
    return returnText;
  }
  return text;
}

export function registroPortugues(reg) {
  const nrRegistros =
    reg > 1 ? `registros selecionados.` : `registro selecionado.`;
  return `${reg} ${nrRegistros}`;
}

export function exportTable(colunas, dados, nomeArquivo) {
  // naive encoding to csv format
  const content = [colunas.map((col) => wrapCsvValue(col.label))]
    .concat(
      dados.map((row) =>
        colunas
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile(`${nomeArquivo}.csv`, content, "text/csv", {
    encoding: "windows-1252",
    mimeType: "text/csv;charset=iso-8859-1;",
  });

  if (status !== true) {
    $q.notify({
      message: "Favor autorizar o download no navegador...",
      color: "negative",
      icon: "warning",
    });
  }
}

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export function gerarCorAleatoria(nome) {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}
