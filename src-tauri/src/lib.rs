mod commands;
mod state;
mod types;

use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(
            tauri::async_runtime::block_on(AppState::new())
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::save_slot,
            commands::load_slot,
            commands::delete_slot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}