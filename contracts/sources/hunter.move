module oneascension::hunter {
    use sui::object::{Self, UID, ID, uid_to_inner};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;
    use sui::dynamic_object_field as dof;

    /// The core Hunter object representing a player.
    public struct Hunter has key, store {
        id: UID,
        name: String,
        class_type: u8, // 0: Assassin, 1: Mage, 2: Tank, 3: Healer
        level: u64,
        xp: u64,
        str: u64,
        int: u64,
        vit: u64,
    }

    /// An extracted shadow that can be wrapped into a Hunter object
    public struct Shadow has key, store {
        id: UID,
        boss_name: String,
        bonus_str: u64,
        bonus_int: u64,
    }

    /// A weapon dropped by a boss
    public struct Weapon has key, store {
        id: UID,
        name: String,
        str_bonus: u64,
    }

    /// Event emitted when a new Hunter is Awakened.
    public struct HunterAwakened has copy, drop {
        hunter_id: ID,
        class_type: u8,
    }

    /// Accessors for other modules
    public fun name(h: &Hunter): String { h.name }
    public fun level(h: &Hunter): u64 { h.level }
    public fun str(h: &Hunter): u64 { h.str }

    /// Mint a new Hunter object
    public entry fun awaken(name: String, class_type: u8, ctx: &mut TxContext) {
        let mut str = 10;
        let mut int = 10;
        let mut vit = 10;

        if (class_type == 0) { str = 20; vit = 12; } // Assassin
        else if (class_type == 1) { int = 25; str = 5; } // Mage
        else if (class_type == 2) { vit = 25; str = 15; } // Tank
        else if (class_type == 3) { vit = 18; int = 15; }; // Healer

        let h_id = object::new(ctx);
        event::emit(HunterAwakened {
            hunter_id: uid_to_inner(&h_id),
            class_type,
        });

        let hunter = Hunter {
            id: h_id, name, class_type, level: 1, xp: 0, str, int, vit,
        };

        transfer::public_transfer(hunter, tx_context::sender(ctx));
    }

    /// Create a shadow instance (Used directly by raid combat)
    public fun mint_shadow(boss_name: String, str: u64, int: u64, ctx: &mut TxContext): Shadow {
        Shadow { id: object::new(ctx), boss_name, bonus_str: str, bonus_int: int }
    }

    /// Create a weapon instance
    public fun mint_weapon(name: String, str: u64, ctx: &mut TxContext): Weapon {
        Weapon { id: object::new(ctx), name, str_bonus: str }
    }

    /// "Arise" mechanic logic wrapper. Adds a shadow using dynamic object fields.
    public entry fun wrap_shadow(hunter: &mut Hunter, shadow: Shadow) {
        dof::add(&mut hunter.id, b"active_shadow", shadow);
    }

    /// Attach a weapon to the hunter
    public entry fun wrap_weapon(hunter: &mut Hunter, weapon: Weapon) {
        dof::add(&mut hunter.id, b"active_weapon", weapon);
    }

    /// Internal function for the PRD's combat logic to add XP and handle leveling linearly
    public fun add_xp(hunter: &mut Hunter, amount: u64) {
        hunter.xp = hunter.xp + amount;
        
        let required_xp = hunter.level * 100;
        if (hunter.xp >= required_xp) {
            let overflow = hunter.xp - required_xp;
            hunter.level = hunter.level + 1;
            hunter.xp = overflow;

            // Stat linear growth
            if (hunter.class_type == 0) { hunter.str = hunter.str + 5; }
            else if (hunter.class_type == 1) { hunter.int = hunter.int + 5; }
            else if (hunter.class_type == 2) { hunter.vit = hunter.vit + 5; }
            else if (hunter.class_type == 3) { hunter.int = hunter.int + 3; hunter.vit = hunter.vit + 3; };
        }
    }
}
