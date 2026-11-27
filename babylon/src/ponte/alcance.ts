/** alcance por tamanho: peças pequenas somem antes (ficam com poucos pixels na tela, dentro da névoa); as grandes vão até o alcance do nível gráfico */
export const alcanceDe = (raio: number, A: number) => raio < 1 ? A * 0.55 : raio < 3 ? A * 0.8 : A;
