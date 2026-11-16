// Clover RP para Windows: abre o mesmo jogo da versão web (pasta dist/) numa janela própria.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("não foi possível abrir o Clover RP");
}
