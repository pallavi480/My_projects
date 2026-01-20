// 30 chains (you can add more)
const chainsList = [
  { id: "bitcoin", name: "Bitcoin", color: "#f7931a", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { id: "ethereum", name: "Ethereum", color: "#627eea", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { id: "solana", name: "Solana", color: "#00ffab", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { id: "cardano", name: "Cardano", color: "#0033ad", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { id: "polkadot", name: "Polkadot", color: "#e6007a", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
  { id: "avalanche", name: "Avalanche", color: "#e84142", logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
  { id: "dogecoin", name: "Dogecoin", color: "#ba9f33", logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
  { id: "polygon", name: "Polygon", color: "#8247e5", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  { id: "chainlink", name: "Chainlink", color: "#2a5ada", logo: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
  { id: "litecoin", name: "Litecoin", color: "#b8b8b8", logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png" },
  { id: "stellar", name: "Stellar", color: "#7c7c7c", logo: "https://cryptologos.cc/logos/stellar-xlm-logo.png" },
  { id: "tron", name: "Tron", color: "#de0f0f", logo: "https://cryptologos.cc/logos/tron-trx-logo.png" },
  { id: "vechain", name: "VeChain", color: "#00a3d9", logo: "https://cryptologos.cc/logos/vechain-vet-logo.png" },
  { id: "iota", name: "IOTA", color: "#000000", logo: "https://cryptologos.cc/logos/iota-miota-logo.png" },
  { id: "tezos", name: "Tezos", color: "#2c7df7", logo: "https://cryptologos.cc/logos/tezos-xtz-logo.png" },
  { id: "eos", name: "EOS", color: "#000000", logo: "https://cryptologos.cc/logos/eos-eos-logo.png" },
  { id: "neo", name: "NEO", color: "#58bf00", logo: "https://cryptologos.cc/logos/neo-neo-logo.png" },
  { id: "zcash", name: "Zcash", color: "#ffb600", logo: "https://cryptologos.cc/logos/zcash-zec-logo.png" },
  { id: "dash", name: "Dash", color: "#1c75bc", logo: "https://cryptologos.cc/logos/dash-dash-logo.png" },
  { id: "monero", name: "Monero", color: "#f60d0d", logo: "https://cryptologos.cc/logos/monero-xmr-logo.png" },
  { id: "bitcoin-cash", name: "Bitcoin Cash", color: "#8dc351", logo: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png" },
  { id: "dogecoin2", name: "Dogecoin2", color: "#ba9f33", logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
  { id: "ethereum2", name: "Ethereum2", color: "#627eea", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { id: "solana2", name: "Solana2", color: "#00ffab", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { id: "cardano2", name: "Cardano2", color: "#0033ad", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { id: "polkadot2", name: "Polkadot2", color: "#e6007a", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
  { id: "avalanche2", name: "Avalanche2", color: "#e84142", logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
  { id: "tron2", name: "Tron2", color: "#de0f0f", logo: "https://cryptologos.cc/logos/tron-trx-logo.png" },
  { id: "vechain2", name: "VeChain2", color: "#00a3d9", logo: "https://cryptologos.cc/logos/vechain-vet-logo.png" },
  { id: "litecoin2", name: "Litecoin2", color: "#b8b8b8", logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png" }
];

// Store chain blocks
const chains = {};

// Columns
const columns = [
  document.getElementById("column-1"),
  document.getElementById("column-2"),
  document.getElementById("column-3")
];

// Generate chains into columns
chainsList.forEach((chain, idx) => {
  chains[chain.id] = [];
  const chainDiv = document.createElement("div");
  chainDiv.classList.add("chain-container");

  chainDiv.innerHTML = `
    <div class="blockchain-container">
      <div class="blockchain" id="blockchain-${chain.id}"></div>
    </div>
    <div class="chain-title" style="color:${chain.color}">
      <img src="${chain.logo}" alt="${chain.name}"> ${chain.name}
    </div>
    <div class="controls">
      <button onclick="addBlock('${chain.id}')">Add Block</button>
      <button onclick="tamperBlock('${chain.id}')">Tamper Last Block</button>
    </div>
  `;

  const colIdx = Math.floor(idx / 10); // 0-9 → col1, 10-19 → col2, 20-29 → col3
  columns[colIdx].appendChild(chainDiv);
});

// SHA256 hash
function calculateHash(index, previousHash, data, nonce) {
  return CryptoJS.SHA256(index + previousHash + data + nonce).toString();
}

// Mine block
function mineBlock(block, chainId) {
  block.nonce = 0;
  const chainColor = chainsList.find(c => c.id === chainId).color;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      block.nonce++;
      block.hash = calculateHash(block.index, block.previousHash, block.data, block.nonce);
      renderChain(chainId, chainColor);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      while (!block.hash.startsWith("00")) {
        block.nonce++;
        block.hash = calculateHash(block.index, block.previousHash, block.data, block.nonce);
      }
      resolve(block);
    }, 1500 + Math.random() * 1000);
  });
}

// Add block
async function addBlock(chainId, data = "Block Data") {
  const blockchain = chains[chainId];
  const index = blockchain.length;
  const previousHash = index === 0 ? "0" : blockchain[index - 1].hash;
  const block = { index, previousHash, data, nonce: 0, hash: "" };
  blockchain.push(block);
  const chainColor = chainsList.find(c => c.id === chainId).color;
  renderChain(chainId, chainColor);
  await mineBlock(block, chainId);
  renderChain(chainId, chainColor);
}

// Tamper block
function tamperBlock(chainId) {
  const blockchain = chains[chainId];
  if (!blockchain.length) return;
  blockchain[blockchain.length - 1].data = "TAMPERED!";
  blockchain[blockchain.length - 1].hash = calculateHash(
    blockchain[blockchain.length - 1].index,
    blockchain[blockchain.length - 1].previousHash,
    blockchain[blockchain.length - 1].data,
    blockchain[blockchain.length - 1].nonce
  );
  for (let i = 1; i < blockchain.length; i++) {
    blockchain[i].previousHash = blockchain[i - 1].hash;
  }
  const chainColor = chainsList.find(c => c.id === chainId).color;
  renderChain(chainId, chainColor);
}

// Render chain
function renderChain(chainId, color) {
  const blockchain = chains[chainId];
  const container = document.getElementById(`blockchain-${chainId}`);
  container.innerHTML = "";
  blockchain.forEach((block, idx) => {
    const div = document.createElement("div");
    div.classList.add("block");
    div.style.borderColor = color;
    div.style.color = color;
    div.addEventListener("click", () => div.classList.toggle("flip"));
    if (idx > 0 && block.previousHash !== blockchain[idx - 1].hash) {
      div.classList.add("invalid");
    }
    div.innerHTML = `
      <div class="front">
        <p><strong>Index:</strong> ${block.index}</p>
        <p><strong>Nonce:</strong> ${block.nonce}</p>
        <p><strong>Hash:</strong> ${block.hash.substring(0,12)}...</p>
      </div>
      <div class="back">
        <p>Data: ${block.data}</p>
        <p>Prev: ${block.previousHash.substring(0,6)}...</p>
      </div>
    `;
    container.appendChild(div);
  });
}



