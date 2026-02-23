#[starknet::contract]
mod Stampd {

    #[storage]
    struct Storage {
        receipt_count: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.receipt_count.write(0);
    }
}