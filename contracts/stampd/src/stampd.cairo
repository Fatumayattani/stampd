use starknet::ContractAddress;

#[starknet::interface]
trait IStampd<TContractState> {
    fn stamp(
        ref self: TContractState,
        commitment: felt252,
        client: ContractAddress,
        project_tag: felt252
    ) -> u64;

    fn dispute(
        ref self: TContractState,
        receipt_id: u64
    );

    fn get_receipt(
        self: @TContractState,
        receipt_id: u64
    ) -> Stampd::Receipt;
}

#[starknet::contract]
mod Stampd {
    use starknet::ContractAddress;
    use starknet::{get_block_timestamp, get_caller_address};

    use starknet::event::EventEmitter;
    use starknet::storage::{
        Map,
        StoragePathEntry,
        StoragePointerReadAccess,
        StoragePointerWriteAccess,
};

    #[derive(Drop, Serde, PartialEq, starknet::Store)]
pub enum ReceiptStatus {
    #[default]
    Committed,
    Disputed,
    Revealed,
}

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Receipt {
        pub commitment: felt252,
        pub freelancer: ContractAddress,
        pub client: ContractAddress,
        pub project_tag: felt252,
        pub timestamp: u64,
        pub status: ReceiptStatus,
    }

    #[storage]
    struct Storage {
        receipt_count: u64,
        receipts: Map<u64, Receipt>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        StampdCommitted: StampdCommitted,
        StampdDisputed: StampdDisputed,
    }

    #[derive(Drop, starknet::Event)]
    struct StampdCommitted {
        receipt_id: u64,
        freelancer: ContractAddress,
        client: ContractAddress,
        commitment: felt252,
        project_tag: felt252,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct StampdDisputed {
        receipt_id: u64,
        by: ContractAddress,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.receipt_count.write(0);
    }

    #[abi(embed_v0)]
    impl StampdImpl of super::IStampd<ContractState> {

    fn stamp(
        ref self: ContractState,
        commitment: felt252,
        client: ContractAddress,
        project_tag: felt252
    ) -> u64 {
        let receipt_id = self.receipt_count.read();
        let freelancer = get_caller_address();
        let timestamp = get_block_timestamp();

        let receipt = Receipt {
            commitment,
            freelancer,
            client,
            project_tag,
            timestamp,
            status: ReceiptStatus::Committed,
        };

        self.receipts.entry(receipt_id).write(receipt);
        self.receipt_count.write(receipt_id + 1);

        self.emit(StampdCommitted {
            receipt_id,
            freelancer,
            client,
            commitment,
            project_tag,
            timestamp,
        });

        receipt_id
    }

    fn dispute(
        ref self: ContractState,
        receipt_id: u64
    ) {
        let caller = get_caller_address();
        let mut receipt = self.receipts.entry(receipt_id).read();

        assert(caller == receipt.client, 'Only client can dispute');
        assert(receipt.status == ReceiptStatus::Committed, 'Invalid state');

        receipt.status = ReceiptStatus::Disputed;

        self.receipts.entry(receipt_id).write(receipt);

        self.emit(StampdDisputed {
            receipt_id,
            by: caller,
            timestamp: get_block_timestamp(),
        });
    }

    fn get_receipt(self: @ContractState, receipt_id: u64) -> Receipt {
        self.receipts.entry(receipt_id).read()
    }
}
}
