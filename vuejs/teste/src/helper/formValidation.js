// export const maxLength = (val, nrCaract, msg) => val.length === nrCaract || msg
export const exactLength = (val, nrCaract, msg) => val.length === nrCaract || msg
export const maxLength = (val, nrCaract, msg) => val.length <= nrCaract || msg
export const minLength = (val, nrCaract, msg) => val.length >= nrCaract || msg
