import { defineStore } from "pinia";

export const useStore = defineStore("usuarioLogado", {
  state: () => {
    return { nome: "Henrique Puppo Boueri", email: "henrique.puppo@ufjf.br" };
  },
});
