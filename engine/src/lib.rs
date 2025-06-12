// Idle Horizons – Minimal Damage Engine (Rust → WASM)
// ----------------------------------------------------
// v0.2 – fixes comment/example for 50 000 armour and adds unit tests.
// Compile with `wasm-pack build --target web` and import the generated
// JS glue into your React front-end.
//
// Formula reference (agreed with project owner):
//   DR(x) = min( 0.90 , (x / (x + 15 000)) × 0.90 )
//   • Returns *decimal* damage-reduction (0.36 ⇒ 36 %)
//   • Physical and Magical both use the same curve
//
use wasm_bindgen::prelude::*;

/// Maximum damage-reduction expressed as a decimal (90 %).
const DR_CAP: f64 = 0.90;
/// Scale factor in the denominator.
const ARMOR_SCALE: f64 = 15_000.0;

/// Returns damage-reduction **in decimal form** (e.g. 0.36 for 36 %).
///
/// Formula: DR(x) = min( DR_CAP, (x / (x + ARMOR_SCALE)) * DR_CAP )
#[wasm_bindgen]
pub fn damage_reduction(armor: f64) -> f64 {
    if armor <= 0.0 {
        return 0.0;
    }
    let dr = (armor / (armor + ARMOR_SCALE)) * DR_CAP;
    dr.min(DR_CAP)
}

/// Returns the post-reduction multiplier, i.e. **1-DR**.
#[wasm_bindgen]
pub fn damage_after_reduction(armor: f64) -> f64 {
    1.0 - damage_reduction(armor)
}

// ----------------------------------------------------
// ⬇ Basic unit tests so we can catch regressions fast ⬇
// ----------------------------------------------------
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_damage_reduction_curve() {
        // 0 armour ⇒ 0 % DR
        assert!((damage_reduction(0.0) - 0.0).abs() < 1e-9);

        // 10 000 armour ⇒ 36 % DR (0.36)
        assert!((damage_reduction(10_000.0) - 0.36).abs() < 1e-6);

        // 50 000 armour ⇒ 69.230769 % DR (≈0.69230769)
        assert!((damage_reduction(50_000.0) - 0.69230769).abs() < 1e-6);
    }
}
