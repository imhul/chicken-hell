use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Handle TS `number | string`
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Id {
    Num(i64),
    Str(String),
}

/// Basic position
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f32,
    pub y: f32,
}

pub type BaseSize = Size;
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Size {
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bonus {
    pub id: String,
    pub name: String,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum LvlName {
    Trainee,
    Medium,
    Master,
    Prime,
}

/* -------------------------
   Enums for many string unions
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AbilityType {
    Shooting,
    Defense,
    Speed,
    Health,
    CriticalChance,
    CriticalDamage,
    Crafting,
    Mining,
    Harvesting,
    Building,
    Research,
    Healing,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BuffType {
    Shooting,
    Defense,
    Speed,
    Health,
    CriticalChance,
    CriticalDamage,
    Crafting,
    Mining,
    Harvesting,
    Building,
    Research,
    Healing,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum DebuffType {
    Shooting,
    Defense,
    Speed,
    Health,
    CriticalChance,
    CriticalDamage,
    Crafting,
    Mining,
    Harvesting,
    Building,
    Research,
    Healing,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum SkillType {
    Shooting,
    Defense,
    Speed,
    Health,
    CriticalChance,
    CriticalDamage,
    Crafting,
    Mining,
    Harvesting,
    Building,
    Research,
    Healing,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AchievementType {
    FirstBlood,
    SharpShooter,
    Survivor,
    Collector,
    Builder,
    Defender,
    Explorer,
    Harvester,
    Miner,
    Crafter,
    Researcher,
    Healer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ProfessionType {
    Collector,
    Constructor,
    Defender,
    Warrior,
    Explorer,
    Harvester,
    Miner,
    Crafter,
    Researcher,
    Healer,
    Bearer,
    Any,
}

/* -------------------------
   State enums
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum EnemyState {
    Idle,
    Lvlup,
    Angry,
    Run,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BaseState {
    Idle,
    Die,
    Damage,
    Transform,
    Special,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum EnemyEggState {
    Jump,
    Birth,
    Death,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum HeroState {
    Lvlup,
    Die,
    Damage,
    Transform,
    Special,
    PlayerStand,
    PlayerRun,
    PlayerRunShot,
    PlayerShootUp,
    CrabIdle,
    CrabWalk,
    EnemyDeath,
    Impact,
    JumperIdle,
    JumperJump,
    Octopus,
    PlayerCling,
    PlayerDuck,
    PlayerHurt,
    PlayerIdle,
    PlayerJump,
    PowerUp,
    Shot,
}

/// SummaryState = HeroState | EnemyState | EnemyEggState
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SummaryState {
    Hero(HeroState),
    Enemy(EnemyState),
    Egg(EnemyEggState),
}

/* -------------------------
   Other small enums / placeholders
   ------------------------- */

/// Placeholder: theme name (you didn't supply this TS). Adjust if needed.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ThemeName {
    Light,
    Dark,
    System,
}

/// Placeholder: difficulty (adjust to your real TS if different)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum GameDifficultyType {
    Easy,
    Normal,
    Hard,
    Insane,
}

/// Placeholder keybindings shape — flexible mapping from action -> key
pub type KeyBindings = HashMap<String, String>;

/* -------------------------
   Core TS-derived structs
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub id: String,
    pub name: AchievementType,
    pub status: String,
    pub progress: f64,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ability {
    pub id: String,
    pub name: AbilityType,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub description: String,
    pub lvl: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Buff {
    pub id: String,
    pub name: BuffType,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub description: String,
    pub lvl: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Debuff {
    pub id: String,
    pub name: DebuffType,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub description: String,
    pub lvl: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

/* -------------------------
   BaseEntity & derived
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaseEntity {
    pub age: u64,
    pub dead: bool,
    pub hp: f64,
    pub id: Id,
    pub name: String,
    pub position: Position,
    #[serde(rename = "state")]
    pub state: SummaryState, // union type
    pub timestamp: u64,
    pub total_hp: f64,
    pub z_index: i32,
}

/* ItemEntity extends BaseEntity in TS — we serialize all fields explicitly here */
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ItemEntity {
    // base entity fields
    pub age: u64,
    pub dead: bool,
    pub hp: f64,
    // In TS ItemEntity.id is string (overrides BaseEntity). Keep explicit string here.
    pub id: String,
    pub name: String,
    pub position: Position,
    #[serde(rename = "state")]
    pub state: SummaryState,
    pub timestamp: u64,
    pub total_hp: f64,
    pub z_index: i32,

    // item-specific
    pub title: String,
    pub description: String,
    pub quantity: u32,
    pub stackable: bool,
    pub max_stack: u32,
    pub wearable: bool,
    pub equippable: bool,
    pub usable: bool,
    pub broken: bool,
    pub bonus: Vec<Bonus>,
}

/* -------------------------
   Game-specific entities
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColonyEntity {
    pub id: i64,
    pub uid: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnemyEntity {
    // extends BaseEntity logically; explicit fields:
    pub age: u64,
    pub dead: bool,
    pub hp: f64,
    pub id: Id,
    pub name: String,
    pub position: Position,
    #[serde(rename = "state")]
    pub state: SummaryState,
    pub timestamp: u64,
    pub total_hp: f64,
    pub z_index: i32,

    // enemy-specific
    pub uid: String,
    pub speed: f32,
    pub attack_speed: f32,
    pub attack_power: f32,
    pub base: Position,
    pub state_timestamp: u64,
    pub state_enum: EnemyState, // explicit EnemyState (kept for clarity)
    pub colony: ColonyEntity,
    pub damage: f32,
    pub egg: bool,
    pub queen: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BulletEntity {
    pub id: String,
    pub x: f32,
    pub y: f32,
    pub owner: BulletOwner,
    pub direction: Position,
    pub speed: f32,
    pub damage: f32,
    pub distance: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BulletOwner {
    Hero,
    Enemy,
}

/* Hero (very large) */
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HeroEntity {
    // base entity fields
    pub age: u64,
    pub dead: bool,
    pub hp: f64,
    pub id: Id,
    pub name: String,
    pub position: Position,
    #[serde(rename = "state")]
    pub state: SummaryState,
    pub timestamp: u64,
    pub total_hp: f64,
    pub z_index: i32,

    // hero-specific
    pub abilities: HashMap<String, Ability>,
    pub achievements: Vec<Achievement>,
    pub attack_power: f32,
    pub buffs: HashMap<String, Buff>,
    pub damage: f32,
    pub debuffs: HashMap<String, Debuff>,
    pub inventory: Vec<ItemEntity>,
    pub items_storage: Vec<ItemEntity>,
    pub lvl: u32,
    pub points_to_next_lvl: u32,
    pub professions: HashMap<String, Profession>,
    pub shooting: f32,
    pub skills: HashMap<String, Skill>,
    pub speed: f32,
    pub state_enum: HeroState,
    pub technologies: HashMap<String, Technology>,
    pub weared_items: Vec<ItemEntity>,
    pub xp: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profession {
    pub id: String,
    pub name: ProfessionType,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub lvl: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Skill {
    pub id: String,
    pub name: SkillType,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub description: String,
    pub lvl: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Technology {
    pub id: String,
    pub name: String,
    pub active: bool,
    pub status: String,
    pub progress: f64,
    pub level: u32,
    pub lvl_name: LvlName,
    pub points_to_next_lvl: u64,
    pub bonus: Bonus,
}

/* -------------------------
   Colonies (Record<uid, {...}>)
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColonyData {
    pub list: Vec<EnemyEntity>,
    pub hp: f64,
    pub total_hp: f64,
    pub dirty: bool,
    pub angry: bool,
    pub last_attack_timestamp: u64,
}

pub type Colonies = HashMap<String, ColonyData>;

/* -------------------------
   Preferences & SaveType + wrappers
   ------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Preferences {
    pub difficulty: GameDifficultyType,
    pub key_bindings: KeyBindings,
    pub theme: ThemeName,
    pub sound_level: f32,
    pub fullscreen: bool,
    pub antialias: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SaveType {
    pub bullets: Vec<BulletEntity>,
    pub colonies: Colonies,
    pub game_size: BaseSize,
    pub hero: HeroEntity,
    pub hero_name: String,
    pub play_time: f64,
    pub preferences: Preferences,
    pub scene: u32,
    pub seed: String,
    pub start_timestamp: u64,
    pub water: Vec<Position>,
    pub world_name: String,
    pub zoom: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SaveRequestParams {
    pub data: SaveType,
    pub slot: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadRequestParams {
    pub slot: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeleteRequestParams {
    pub slot: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SaveResponseParams {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadResponseParams {
    pub success: bool,
    pub message: String,
    pub data: Option<SaveType>,
}
