import axios from "axios";
import blessed from "blessed";
import contrib from "blessed-contrib";

const COINS = ["bitcoin", "ethereum", "cardano", "solana", "ton"];
const FIATS = ["usd", "eur", "rub"];
let selectedFiat = "usd";

// Create screen and grid
const screen = blessed.screen({
  smartCSR: true,
  title: "Crypto Terminal Tracker (CoinGecko)"
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen });

const table = grid.set(0, 0, 10, 12, contrib.table, {
  keys: true,
  fg: "white",
  interactive: false,
  label: `📈 Crypto Prices (in ${selectedFiat.toUpperCase()})`,
  width: "100%",
  height: "100%",
  border: { type: "line", fg: "cyan" },
  columnSpacing: 4,
  columnWidth: [20, 20]
});
screen.append(table);

const info = blessed.box({
  bottom: 0,
  height: 2,
  width: "100%",
  content:
    "Press F1/F2/F3 to switch fiat currency (USD, EUR, RUB). Press Q or ESC to quit.",
  style: { fg: "yellow" },
  tags: true
});
screen.append(info);

async function fetchPrices() {
  try {
    // Формируем список ids и валют для запроса
    const ids = COINS.join(",");
    const vs_currencies = selectedFiat;

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids,
          vs_currencies
        }
      }
    );

    const data = res.data;

    // Формируем данные для таблицы
    const rows = COINS.map((coin) => {
      const price = data[coin]?.[selectedFiat];
      return [
        coin.charAt(0).toUpperCase() + coin.slice(1),
        price ? price.toFixed(4) : "N/A"
      ];
    });

    table.setData({
      headers: ["Coin", `Price (${selectedFiat.toUpperCase()})`],
      data: rows
    });

    screen.render();
  } catch (error) {
    table.setData({
      headers: ["Error"],
      data: [[`Failed to fetch data: ${error.message}`]]
    });
    screen.render();
  }
}

// Initial fetch and interval update
fetchPrices();
const interval = setInterval(fetchPrices, 30000);

// Key bindings
screen.key(["q", "C-c", "escape"], () => {
  clearInterval(interval);
  process.exit(0);
});

screen.key(["f1", "f2", "f3"], (ch, key) => {
  if (key.name === "f1") selectedFiat = "usd";
  if (key.name === "f2") selectedFiat = "eur";
  if (key.name === "f3") selectedFiat = "rub";
  table.options.label = `📈 Crypto Prices (in ${selectedFiat.toUpperCase()})`;
  fetchPrices();
});

screen.render();
