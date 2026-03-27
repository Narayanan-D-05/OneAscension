This is the **Product Requirements Document (PRD)** for **OneAscension**, a high-concurrency, class-based RPG built on OneChain. This document is designed to guide your 40-hour MVP sprint, focusing on the "System" aesthetic and on-chain mechanics.

---

## 📄 Project Name: OneAscension
**Tagline:** *The System has chosen you. Transcend the Tower.* **Track:** GameFi  
**Tech Stack:** OneChain (Move), OneWallet, OneID, React/Next.js (Frontend)

---

## 1. Executive Summary
**OneAscension** is a "Solo Leveling" inspired RPG where the entire game logic—stats, leveling, and raiding—is executed on-chain. Players choose a class (Mage, Assassin, Tank, Healer) and progress through "The Tower." The project proves OneChain’s scalability by processing every combat action as a verified state transition.

**🚨 STRICT IMPLEMENTATION RULE: No Mockups, Simulations, or Fallbacks 🚨**  
*Every single GameFi feature and OneChain integration outlined in this PRD must be real. There will be no simulated gameplay loops, no "mock" tokenomics, and no fallback Web2 databases for game state. If a sword swings or a boss is defeated, a real transaction must occur on OneChain. Submitting a visual demo or slide-ware without functioning Move contracts is considered a failure condition for this sprint.*

## 2. Target User Experience (The "System")
* **Minimalist UI:** A sleek, "blue-tinted" HUD that feels like an integrated AI system.
* **Invisible Blockchain:** Use of **Session Keys** via OneWallet so players never see a transaction popup during a 10-minute dungeon run.
* **Ownership:** Every item and shadow extracted is a first-class Move object owned by the player's OneID.

## 3. Core Features (MVP Scope)

### A. Hunter Management (The "Status" Screen)
* **Class Selection:** Users mint a permanent `Hunter` object and choose one of four archetypes.
* **Stat Progression:** 
    * **Strength:** Increases physical damage (Assassin/Tank focus).
    * **Intelligence:** Increases mana and magic power (Mage focus).
    * **Vitality:** Increases HP and resistance (Tank/Healer focus).
* **Move Implementation:** Every level-up triggers a `move::call` to update the Hunter's struct.

### B. The Combat Loop (The "Dungeon")
* **Solo/Multiplayer Raids (Guilds):** Players enter a `RaidRoom` (Shared Object). Players can form "Guilds" to receive a party-wide 5% XP buff when raiding together.
* **Skill Casting:** Each class has 1 signature active skill on-chain.
    * *Assassin:* "Phantom Strike" (High DMG).
    * *Healer:* "Sanctuary" (Party HP Restore).
* **State Updates:** Every hit decreases Boss HP on-chain and triggers an event for the frontend to render.

### C. Reward System & Economy (The "Loot")
* **On-Chain Drops & Randomness:** Bosses drop `LootBox` objects. Verifiable on-chain randomness determines LootBox rarity drops and critical hit chances during combat.
* **Equip System:** Move's "Nested Objects" allow players to "wrap" a weapon inside their Hunter object, increasing their stats programmatically.
* **The "Hunter Association" Marketplace:** A simple P2P trading hub where players can list unopened `LootBox`es or crafted weapons for OneChain tokens.

### D. "Shadow Extraction" (Dynamic NFT Composability)
* **Mechanic:** Defeated bosses have a chance to be "extracted" and minted as an on-chain Shadow NFT.
* **Composability:** The Shadow can be wrapped into the Hunter object as a companion, passively leveling up alongside the Hunter and conferring unique stat boosts based on the boss type.

### E. Tower Leaderboards (Competitive Aspect)
* **Mechanic:** An on-chain leaderboard tracks the highest floors cleared and fastest boss clear times. Hunters are assigned ranks (E-Rank to S-Rank).
* **Incentives:** Prize pool smart contracts automatically distribute tokens to the Top S-Rank players at the end of a season (or hackathon sprint).

---

## 4. Technical Requirements & Move Logic

| Feature | Move Primitive | Description |
| :--- | :--- | :--- |
| **Identity** | `OneID` | Used as the primary key for the `Hunter` object. |
| **Concurrency** | **Parallel Execution** | Multiple players in different dungeons can update their XP simultaneously. |
| **Security** | **Resource Safety** | Hunter objects cannot be duplicated or deleted without system authorization. |
| **Multiplayer/Guilds** | **Shared Objects** | The `Boss` and `Guild` are shared objects accessed by the party's transaction block. |
| **Randomness** | **On-Chain VRF** | Used to securely determine loot rarity and shadow extraction success rates. |
| **Economy** | **Marketplace Module** | Escrow-based smart contracts for secure P2P trading of GameFi assets. |

---

## 5. The 40-Hour MVP Roadmap

| Timeframe | Task | Deliverable |
| :--- | :--- | :--- |
| **0-8h** | **Smart Contract Core** | `hunter.move` (classes/shadows), `raid.move` (bosses), and `leaderboard.move`. |
| **8-16h** | **Marketplace & Guilds** | `market.move` for P2P trading and basic Guild shared objects. |
| **16-26h** | **Core UI** | The "Status" Dashboard, "Dungeon" Battle Screen, and Leaderboard view. |
| **26-34h** | **Integration** | OneWallet Session Keys, OneID polling, and Randomness module events. |
| **34-40h** | **Polish/Demo** | Level-up animations and a 3-minute video of a party defeating a boss and trading. |

---

## 6. Success Metrics for Judges
1.  **Fully Realized On-Chain Logic:** Zero use of mockups, simulated wallets, or Web2 fallbacks; every gameplay mechanic perfectly integrates live with OneChain tools (OneWallet, OneID).
2.  **High Frequency:** Demonstrate a live raid where 3 players generate ~15 TPS combined on-chain.
3.  **Object Depth:** Show a Hunter object "owning" a Legendary Sword NFT and a Shadow minion.
4.  **Flow:** Zero "Confirm Transaction" popups during active gameplay via live Session Keys.

---

**Next Step:** Would you like me to generate the **`hunter.move`** smart contract code now so you can begin the Phase 1 development?
