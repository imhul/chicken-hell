// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    chicken_hell_lib::run()
}

// #[tauri::command]
// fn restart_app(app_handle: tauri::AppHandle) {
//     for window in app_handle.windows().values() {
//         let _ = window.close();
//     }

//     std::process::Command::new(std::env::current_exe().unwrap())
//         .spawn()
//         .expect("Не вдалося перезапустити застосунок");

//     std::process::exit(0);
// }
