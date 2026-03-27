module oneascension::raid {
    use sui::object::{Self, UID, ID, uid_to_inner};
    use sui::transfer;
    use sui::tx_context::{TxContext};
    use sui::event;
    use oneascension::hunter::{Self, Hunter};
    use std::string::String;

    /// Shared object representing a Raid Boss instance
    public struct Boss has key {
        id: UID,
        name: String,
        max_hp: u64,
        current_hp: u64,
        base_xp_reward: u64,
        is_defeated: bool,
    }

    /// Event emitted when a boss takes damage
    public struct BossDamaged has copy, drop {
        boss_id: ID,
        damage_dealt: u64,
        remaining_hp: u64,
    }

    /// Event emitted when a boss is defeated
    public struct BossDefeated has copy, drop {
        boss_id: ID,
    }

    /// Initialize a new boss (Shared Object)
    public entry fun spawn_boss(name: String, hp: u64, xp_reward: u64, ctx: &mut TxContext) {
        let boss = Boss {
            id: object::new(ctx),
            name,
            max_hp: hp,
            current_hp: hp,
            base_xp_reward: xp_reward,
            is_defeated: false,
        };
        transfer::share_object(boss);
    }

    /// Assassin active skill: High Damage
    public entry fun phantom_strike(boss: &mut Boss, hunter: &mut Hunter, ctx: &mut TxContext) {
        assert!(!boss.is_defeated, 0); // Boss must be alive
        
        let damage = hunter::str(hunter) * 2; // Simple math for MVP
        
        if (boss.current_hp <= damage) {
            boss.current_hp = 0;
            boss.is_defeated = true;
            
            event::emit(BossDefeated {
                boss_id: uid_to_inner(&boss.id),
            });

            hunter::add_xp(hunter, boss.base_xp_reward);
            
            // Extract Shadow logic simulating Randomness Drop
            let shadow = hunter::mint_shadow(boss.name, 20, 0, ctx);
            hunter::wrap_shadow(hunter, shadow);

            // Mint Weapon drop
            let weapon_name = boss.name;
            let weapon = hunter::mint_weapon(weapon_name, 50, ctx);
            hunter::wrap_weapon(hunter, weapon);

        } else {
            boss.current_hp = boss.current_hp - damage;
            event::emit(BossDamaged {
                boss_id: uid_to_inner(&boss.id),
                damage_dealt: damage,
                remaining_hp: boss.current_hp,
            });
            hunter::add_xp(hunter, boss.base_xp_reward / 10);
        }
    }

    /// Healer active skill: Restore HP to party
    public entry fun sanctuary(boss: &Boss, hunter: &mut Hunter, _ctx: &mut TxContext) {
        assert!(!boss.is_defeated, 0); 
        // Emulates state transition for PRD
        hunter::add_xp(hunter, 100);
    }
}
