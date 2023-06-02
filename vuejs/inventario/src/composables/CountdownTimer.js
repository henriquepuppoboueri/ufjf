import { onMounted, onUnmounted, ref, computed } from "vue";
import moment from "moment";

export function useCountdownTimer(_dataFutura) {
  let dataFutura = ref(_dataFutura);
  let dataAtual = ref(new Date());

  const dataFormatada = computed(() => {
    return moment(dataDiff.value).add(3, "hours").format("HH:mm:ss.");
  });
  const dataDiff = computed(() => {
    return dataFutura.value - dataAtual.value;
  });
  const intervals = [];

  onMounted(() => {
    const interval = setInterval(() => {
      dataAtual.value = new Date();
    }, 1000);
    intervals.push(interval);
  });

  onUnmounted(() => {
    console.log('onUnmounted');
    intervals.forEach((interval) => {
      clearInterval(interval);
    });
  });
  return dataFormatada;
}
