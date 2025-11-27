// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    chicken_hell_lib::run()
}

#[deprecated(
    since = "0",
    note = "now that func goes to frontend"
)]
#[warn(dead_code)]
#[tauri::command]
async fn restart_app(app: tauri::AppHandle) -> Result<(), String> {
    for window in app.webview_windows().values() {
        let _ = window.close();
    }

    let exe = std::env::current_exe().map_err(|e| e.to_string())?;

    std::process::Command::new(exe)
        .spawn()
        .map_err(|e| e.to_string())?;

    std::process::exit(0);
}
