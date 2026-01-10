use crate::types::SaveType;
use mongodb::{Client, Collection};

pub struct AppState {
    pub collection: Collection<SaveType>,
}

impl AppState {
    pub async fn new() -> Option<Self> {
        let uri = "mongodb+srv://root:49384938@cluster0.wxd3e9h.mongodb.net/?appName=Cluster0";
        let client = match Client::with_uri_str(uri).await {
            Ok(client) => client,
            Err(_) => return None,
        };

        let db = client.database("test_db");
        let collection = db.collection::<SaveType>("saves");

        Some(Self { collection })
    }
}
