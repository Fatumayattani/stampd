export const STAMPD_ABI = [
  {
    "type": "function",
    "name": "stamp",
    "inputs": [
      { "name": "commitment", "type": "felt" },
      { "name": "client", "type": "felt" },
      { "name": "project_tag", "type": "felt" }
    ],
    "outputs": [
      { "name": "receipt_id", "type": "felt" }
    ]
  },

  {
    "type": "function",
    "name": "dispute",
    "inputs": [
      { "name": "receipt_id", "type": "felt" }
    ],
    "outputs": []
  },

  {
    "type": "function",
    "name": "reveal",
    "inputs": [
      { "name": "receipt_id", "type": "felt" },
      { "name": "delivery_hash", "type": "felt" },
      { "name": "salt", "type": "felt" }
    ],
    "outputs": []
  },

  {
    "type": "function",
    "name": "get_receipt",
    "inputs": [
      { "name": "receipt_id", "type": "felt" }
    ],
    "outputs": [
      { "name": "commitment", "type": "felt" },
      { "name": "freelancer", "type": "felt" },
      { "name": "client", "type": "felt" },
      { "name": "project_tag", "type": "felt" },
      { "name": "timestamp", "type": "felt" },
      { "name": "status", "type": "felt" }
    ],
    "state_mutability": "view"
  }
];