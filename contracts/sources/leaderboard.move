module oneascension::leaderboard {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{TxContext};
    use oneascension::hunter::{Self, Hunter};
    use std::vector;

    public struct Record has store {
        hunter_name: std::string::String,
        level: u64,
    }

    public struct Leaderboard has key {
        id: UID,
        top_hunters: vector<Record>,
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(Leaderboard {
            id: object::new(ctx),
            top_hunters: vector::empty(),
        });
    }

    public entry fun submit_score(board: &mut Leaderboard, hunter: &Hunter) {
        let record = Record {
            hunter_name: hunter::name(hunter),
            level: hunter::level(hunter),
        };
        vector::push_back(&mut board.top_hunters, record);
    }
}
