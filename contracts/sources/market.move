module oneascension::market {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};

    /// Since OneChain uses a different base token namespace likely, we make it generic placeholder ONE
    public struct ONE has drop {}

    /// An escrow listing wrapping an item of type T (e.g. Weapon, LootBox)
    public struct Listing<T: key + store> has key, store {
        id: UID,
        item: T,
        ask_price: u64,
        seller: address,
    }

    /// List an item on the Hunter Marketplace
    public fun list<T: key + store>(item: T, ask_price: u64, ctx: &mut TxContext) {
        let listing = Listing {
            id: object::new(ctx),
            item,
            ask_price,
            seller: tx_context::sender(ctx),
        };
        transfer::public_share_object(listing);
    }

    /// Purchase an item
    public fun purchase<T: key + store>(
        mut listing: Listing<T>, 
        mut payment: Coin<ONE>, 
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) >= listing.ask_price, 0); // Insufficient funds

        // Pay seller
        let exact_payment = coin::split(&mut payment, listing.ask_price, ctx);
        transfer::public_transfer(exact_payment, listing.seller);

        // Refund excess
        transfer::public_transfer(payment, tx_context::sender(ctx));

        // Transfer item to buyer
        let Listing { id, item, ask_price: _, seller: _ } = listing;
        object::delete(id);
        transfer::public_transfer(item, tx_context::sender(ctx));
    }
}
