export const STAMPD_ABI = [
  {
    "type": "struct",
    "name": "Receipt",
    "members": [
      { "name": "commitment", "type": "felt252" },
      { "name": "freelancer", "type": "ContractAddress" },
      { "name": "client", "type": "ContractAddress" },
      { "name": "project_tag", "type": "felt252" },
      { "name": "timestamp", "type": "u64" },
      { "name": "status", "type": "felt252" }
    ]
  },

  {
    "type": "function",
    "name": "stamp",
    "inputs": [
      { "name": "commitment", "type": "felt252" },
      { "name": "client", "type": "ContractAddress" },
      { "name": "project_tag", "type": "felt252" }
    ],
    "outputs": [
      { "name": "receipt_id", "type": "u64" }
    ],
    "state_mutability": "external"
  },

  {
    "type": "function",
    "name": "dispute",
    "inputs": [
      { "name": "receipt_id", "type": "u64" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },

  {
    "type": "function",
    "name": "reveal",
    "inputs": [
      { "name": "receipt_id", "type": "u64" },
      { "name": "delivery_hash", "type": "felt252" },
      { "name": "salt", "type": "felt252" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },

  {
    "type": "function",
    "name": "get_receipt",
    "inputs": [
      { "name": "receipt_id", "type": "u64" }
    ],
    "outputs": [
      { "type": "Receipt" }
    ],
    "state_mutability": "view"
  }
];