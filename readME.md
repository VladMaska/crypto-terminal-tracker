# Crypto Terminal Tracker

A terminal user interface (TUI) application to track live cryptocurrency prices using the free CoinGecko API.

## Features

- Track multiple cryptocurrencies: Bitcoin, Ethereum, Cardano, Solana, TON
- Display prices in multiple fiat currencies: USD, EUR, RUB
- Interactive terminal UI with table and color highlighting via `blessed` and `blessed-contrib`
- Auto-refreshes data every 30 seconds
- Simple controls to switch fiat currency and exit the app

## Installation

1. Clone or download the repository
2. Install dependencies:

```bash
npm install
```

## Usage
Run the app with:

```bash
node index.js
```

## Controls
- ```F1``` — switch to USD
- ```F2``` — switch to EUR
- ```F3``` — switch to RUB
- ```Q```, ```ESC```, ```Ctrl+C``` — quit the app