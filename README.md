# fugle-backend-pretest

## How to setup
1. clone repo
```shell
git clone git@github.com/cwc329/fugle-backend-pretest
```
2. install dependencies
```shell
yarn install
```
3. start redis
```shell
docker-compose up -d
```
4. run server
run in dev mode
```shell
yarn dev
```
build and run
```shell
yarn build # build server
yarn start # run server
```

## Websocket document
- Subscribe to a currency pair

**send**
```json
{
  "event": "subscribe",
  "currencyPair": "btcusd"
}
```
**receive**
```json
{
  "topic": "btcusd",
  "price": 40000
}
```
- Unsubscribe to a currency pair

**send**
```json
{
  "event": "unsubscribe",
  "currencyPair": "btcusd"
}
```
- Get OHLC of a currency pair

**send**
```json
{
  "event": "ohlc",
  "currencyPair": "btcusd"
}
```

**receive**
```json
{
  "timestamp": "1643630400",
  "open": "2188.97",
  "high": "2211.00",
  "low": "2188.97",
  "close": "2188.97",
  "volume": "4.01560417"
}
```
