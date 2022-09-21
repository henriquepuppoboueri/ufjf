// export const maxLength = (val, nrCaract, msg) => val.length === nrCaract || msg
export const exactLength = (val, nrCaract, campo) => val.length === nrCaract || `${campo} deve conter ${nrCaract} caracteres!`
export const maxLength = (val, nrCaract, campo) => val.length <= nrCaract || `${campo} deve conter no máximo ${nrCaract} caracteres!`
export const minLength = (val, nrCaract, campo) => val.length >= nrCaract || `${campo} deve conter no mínimo ${nrCaract} caracteres!`
// export const startsWith = (val, caracteres, campo) => val.length >= nrCaract || `${campo} deve conter no mínimo ${nrCaract} caracteres!`
