// export const maxLength = (val, nrCaract, msg) => val.length === nrCaract || msg
export const exactLength = (val, nrCaract, campo) => val.length === nrCaract || `${campo} deve conter exatamente ${nrCaract} caracteres!`
export const maxLength = (val, nrCaract, campo) => val.length <= nrCaract || `${campo} deve conter no máximo ${nrCaract} caracteres!`
export const minLength = (val, nrCaract, campo) => val.length >= nrCaract || `${campo} deve conter no mínimo ${nrCaract} caracteres!`
export const notStartWith = (val, caracter, campo) => !val.startsWith(caracter) || `${campo} não pode começar com ${caracter}!`
export const isNumber = (val, campo) => {
  return String(+val) !== 'NaN' || `${campo} deve conter somente números!`;
}
