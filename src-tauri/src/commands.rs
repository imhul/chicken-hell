use mongodb::bson::{doc, to_document};
use tauri::State;

use crate::state::AppState;
use crate::types::SaveType;

#[tauri::command]
pub async fn save_slot(
    state: State<'_, AppState>,
    data: SaveType,
    slot: u32,
) -> Result<String, String> {
    let doc = to_document(&data).map_err(|e| e.to_string())?;

    state
        .collection
        .update_one(
            doc! { "slot": slot },
            doc! { "$set": doc },
            mongodb::options::UpdateOptions::builder()
                .upsert(true)
                .build(),
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok("saved".into())
}

#[tauri::command]
pub async fn load_slot(state: State<'_, AppState>, slot: u32) -> Result<SaveType, String> {
    let res = state
        .collection
        .find_one(doc! { "slot": slot }, None)
        .await
        .map_err(|e| e.to_string())?;

    res.ok_or("slot not found".into())
}

#[tauri::command]
pub async fn delete_slot(state: State<'_, AppState>, slot: u32) -> Result<String, String> {
    state
        .collection
        .delete_one(doc! { "slot": slot }, None)
        .await
        .map_err(|e| e.to_string())?;

    Ok("deleted".into())
}
