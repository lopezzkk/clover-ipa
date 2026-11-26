# Partes de dados do three.js r128 (só para a versão Babylon)

Só os arquivos de **dados** que o jogo usa (objetos, formas, materiais, luzes, câmera, texturas, curvas).
Ficaram de fora: o renderizador WebGL, os carregadores, o áudio, os ajudantes e a matemática
(trocada pela matemática própria em `src/compat/matematica.ts`). O desenho é feito só pelo Babylon.js.
Licença MIT (ver LICENSE). Montado por `montar-compat.mjs`; conferido por `testes/camada.mjs`.
