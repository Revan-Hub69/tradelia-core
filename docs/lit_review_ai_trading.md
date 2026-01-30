# AI Trading Literature Review (In Progress)

Status: IN PROGRESS
Scope: peer-reviewed + arXiv + SSRN + tier-1 venues. Markets/horizons/datasets are taken from the papers when stated.
Rule: If full text is not accessible, mark access level and rely on abstract/metadata only.

## Legend
- Access: OPEN (full PDF), LIMITED (abstract/metadata only), PAYWALLED (publisher access required)
- Horizon: HFT (ms-sec), Intraday (min-hours), Swing (days-weeks), Long (months+), Not stated
- Data: LOB (limit order book), OHLCV, trades, quotes, news/sentiment, macro, options, crypto on-chain

---

## A) Surveys and systematic reviews

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2025 | Deep learning for algorithmic trading: A systematic review of predictive models and optimization strategies | Array | Not stated | Not stated | Not stated | Systematic review of DL in trading | OPEN | Open-access SLR focused on DL for algorithmic trading. |
| 2024 | Artificial intelligence techniques in financial trading: A systematic literature review | Journal of King Saud Univ. - CIS | Multi-asset | Not stated | Not stated | SLR of AI methods in trading | OPEN | Reviews 143 articles; reports 8 markets, 40 AI techniques, 16% fully automated. |
| 2024 | A Survey of Deep Reinforcement Learning in Financial Markets | ICBIS 2024 (Atlantis Press) | Multi-asset | Not stated | Not stated | Survey of DRL in finance | OPEN | Survey covers RL for prediction, strategy, risk, and sentiment. |
| 2023 | Machine Learning Applications in Algorithmic Trading: A Comprehensive Systematic Review | IJEME | Multi-asset | Not stated | Not stated | SLR of ML-driven ATS | OPEN | Highlights DL/DRL/Q-learning, overfitting/instability risks. |
| 2021 | Deep Reinforcement Learning in Quantitative Algorithmic Trading: A Review | arXiv | Stocks | Low-frequency | Not stated | DRL survey | LIMITED | Review notes unrealistic settings and lack of real-time tests. |
| 2019 | Machine Learning for Quantitative Finance Applications: A Survey | Applied Sciences | Multi-asset | Not stated | Not stated | Survey of ML in quant finance | OPEN | Broad ML survey across quant finance tasks. |
| 2025 | Artificial Intelligence in Stock Market Trading - A Comprehensive Survey of Models | IJRSI | Stocks | Not stated | Not stated | Bibliometric survey | OPEN | Bibliometric SLR of 9,088 works (1971-2025). |
| 2023 | Deep learning in the stock market: a systematic survey of practice, backtesting, and applications | Artificial Intelligence Review | Stocks | Not stated | Not stated | Survey of DL with backtesting focus | OPEN | Open-access survey focused on backtested studies and domain metrics. |

---

## B) Market microstructure & LOB prediction

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2019 | DeepLOB: Deep Convolutional Neural Networks for Limit Order Books | IEEE TSP (arXiv 1808.03668) | Cash equities (LSE, FI-2010 benchmark) | HFT | LOB | CNN + LSTM for short-term price movement | LIMITED | Evaluated on FI-2010 and one-year LSE data; reports stable OOS accuracy and cross-instrument transfer; DOI 10.1109/TSP.2019.2907260. |
| 2018 | Benchmark dataset for mid-price forecasting of limit order book data with ML methods | Journal of Forecasting | Nasdaq Nordic stocks (5) | HFT | LOB | Public benchmark dataset + baselines | LIMITED | 10 days, ~4,000,000 samples, anchored CV protocol; DOI 10.1002/for.2543. |
| 2018 | Machine Learning for Forecasting Mid Price Movement using LOB Data | arXiv 1809.07861 | Not stated | HFT | LOB | ML on LOB features vs learned features | LIMITED | Abstract via metadata only. |
| 2024 | HLOB: Information Persistence and Structure in Limit Order Books | arXiv 2405.18938 | Nasdaq stocks (15), 3 LOB datasets | HFT | LOB | Homological CNN + information filtering network | LIMITED | Compares to 9 deep baselines; studies horizon degradation; DOI 10.48550/arXiv.2405.18938. |
| 2025 | TLOB: A Novel Transformer Model with Dual Attention for Price Trend Prediction with LOB Data | arXiv 2502.15757 | Not stated | HFT | LOB | Dual-attention transformer for PTP | LIMITED | Dual-attention transformer; details pending full PDF; DOI 10.48550/arXiv.2502.15757. |
| 2024 | ViT-LOB: Efficient Vision Transformer for Stock Price Trend Prediction Using LOBs | ICASI 2024 | Stocks (FI-2010) | HFT | LOB | Lightweight ViT for LOB trend prediction | LIMITED | Reports major inference/memory reductions vs prior models; DOI 10.1109/ICASI60819.2024.10547868. |
| 2025 | LiT: limit order book transformer | Frontiers in AI | Crypto (Binance) | HFT | LOB | Transformer-based LOB forecasting | OPEN | Uses Binance LOB data; evaluates 300-1000ms horizons. |
| 2021 | Microstructure in the Machine Age | Review of Financial Studies | Not stated | Not stated | Microstructure measures | ML for microstructure prediction | PAYWALLED | Shows microstructure features with predictive power. |

---

## C) Reinforcement learning for trading (benchmarks & methods)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2022 | FinRL-Meta: Market Environments and Benchmarks for Data-Driven Financial RL | NeurIPS Datasets & Benchmarks | Not stated | Not stated | Market data -> gym envs | Benchmarking + DataOps pipeline | LIMITED | DataOps pipeline and market environments; arXiv 2206.11876; DOI 10.48550/arXiv.2206.11876. |
| 2021 | FinRL: Deep Reinforcement Learning Framework to Automate Trading in Quantitative Finance | arXiv 2111.09395 | Not stated | Multi-granularity | Market data + APIs | Full-stack DRL framework | LIMITED | Open-source pipeline with risk constraints; DOI 10.48550/arXiv.2111.09395. |
| 2024 | A multi-agent reinforcement learning framework for optimizing financial trading strategies based on TimesNet | Expert Systems with Applications | Not stated | Not stated | Not stated | Multi-agent DRL framework | PAYWALLED | Abstract only via publisher page. |
| 2024 | R-DDQN: Optimizing Algorithmic Trading Strategies Using a Reward Network in a Double DQN | Mathematics (MDPI) | Stocks (HSI, IXIC, SP500, GOOGL, MSFT, INTC) | Not stated | Price data | RLHF-style reward shaping for trading | OPEN | Uses reward network trained from expert demonstrations; DOI 10.3390/math12111621. |
| 2024 | Deep Reinforcement Learning for Algorithmic Trading Strategies | IJRAI | US stocks (S&P 500) | Not stated | High-frequency features | DQN and PPO | OPEN | Uses S&P 500 high-frequency derived features. |
| 2023 | An Ensemble Method of Deep Reinforcement Learning for Automated Cryptocurrency Trading | arXiv 2309.00626 | Crypto | Intraday | Price data | DRL ensemble | LIMITED | Ensemble improves OOS performance vs DRL and passive. |
| 2024 | Reinforcement Learning Pair Trading: A Dynamic Scaling Approach | arXiv 2407.16103 | Crypto (BTC-GBP, BTC-EUR) | Intraday (1-min) | Price data | RL + pairs trading | LIMITED | RL selects entry/scale decisions for crypto pairs; DOI 10.48550/arXiv.2407.16103. |
| 2025 | Cryptocurrency Futures Portfolio Trading System Using Reinforcement Learning | Applied Sciences (MDPI) | Crypto futures (Binance, 18 assets) | Multi-horizon (10/30/60 min, daily) | Price data | A2C + timeframe analysis (ANOVA portfolios) | OPEN | 2022-2023 Binance Futures; classifies high vs low frequency regimes; DOI 10.3390/app15179400. |

---

## D) Execution & market impact (deterministic systems backbone)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2011 | Optimal Trade Execution Under GBM in the Almgren–Chriss Framework | IJTAF | Equities (theory) | Intraday | Price process | Optimal execution (HJB closed form) | LIMITED | Classic AC framework variant. |
| 2011 | Some mathematical aspects of market impact modeling | EMS Press (survey chapter) | Equities (theory) | Intraday | Market impact models | Survey of market impact & stability | PAYWALLED | Theoretical survey of execution/impact. |
| 2017 | Simulation Analysis of Optimal Execution Based on Almgren–Chriss | CMSAM 2017 | Equities (sim) | Intraday | Simulated price paths | AC vs TWAP comparison | OPEN | Simulation study of execution schedules. |

---

## E) Infrastructure / systems / data pipelines (evidence for real infra)

| Year | Title | Venue | Markets | Horizon | Data | Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2022 | FinRL-Meta (DataOps for market envs) | NeurIPS Datasets & Benchmarks | Not stated | Not stated | Market data | DataOps pipeline, reproducibility | LIMITED | Useful for infra architecture patterns. |

---

## F) Market making (RL / adversarial)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2020 | Robust Market Making via Adversarial Reinforcement Learning | IJCAI | Not stated | Not stated | Simulated market | Adversarial RL for robust market making | OPEN | IJCAI 2020 Special Track on AI in FinTech; ARL yields robustness and risk-averse behavior in A-S setting; DOI 10.24963/ijcai.2020/633. |
| 2022 | A reinforcement learning approach to improve the performance of the Avellaneda-Stoikov market-making algorithm | PLOS ONE | BTC-USD | HFT | L2 tick data | RL tweaks risk aversion parameter in A-S | OPEN | 30 days of BTC-USD L2 tick data; RL adjusts risk aversion; DOI 10.1371/journal.pone.0277042. |

---

## G) Execution / market impact with RL

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2024 | Reinforcement Learning for Optimal Execution when Liquidity is Time-Varying | Applied Mathematical Finance | Not stated | Intraday | Simulated dynamics | Double Deep Q-Learning for AC execution | LIMITED | Applied Mathematical Finance vol 31, issue 5 (312-342); arXiv 2402.12049; learns optimal policy under time-varying impact. |
| 2023 | Towards Generalizable Reinforcement Learning for Trade Execution | IJCAI | Not stated | Intraday | LOB-based simulator | Offline RL generalization | OPEN | Frames execution as offline RL with dynamic context; uses high-fidelity LOB simulator; proposes compact context representations. |
| 2024 | An adaptive dual-level reinforcement learning approach for optimal trade execution | Expert Systems with Applications | Not stated | Intraday | Not stated | PPO with dual-level Transformer + LSTM for VWAP tracking | PAYWALLED | Models U-shaped intraday volume; improves cumulative VWAP tracking vs prior RL; DOI 10.1016/j.eswa.2024.124263. |
| 2023 | Reinforcement Learning for Optimal Trade Execution (MSc Applied Project) | Imperial College London | Not stated | Intraday | Simulated environment | DQN/DDQN for execution vs TWAP | OPEN | RL approximates TWAP under simple environment assumptions. |
| 2024 | Deep Learning-Driven Order Execution Strategies in High-Frequency Trading: An Empirical Study on Enhancing Market Efficiency | Applied and Computational Engineering | Not stated | HFT | Not stated | PPO for execution vs VWAP/TWAP | OPEN | Open-access; uses PPO to optimize execution and discusses VWAP/TWAP limits for HFT. |

---

## H) Portfolio management (RL)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2017 | A Deep Reinforcement Learning Framework for the Financial Portfolio Management Problem | arXiv 1706.10059 | Crypto (backtests) | Intraday (30-min) | Price data | EIIE + PVM + OSBL | LIMITED | Backtests in cryptocurrency market with 30-minute period; introduces EIIE and portfolio-vector memory; DOI 10.48550/arXiv.1706.10059. |
| 2017 | A Deep Reinforcement Learning Framework for the Financial Portfolio Management Problem | arXiv 1706.10059 | Crypto (backtests) | Intraday (30-min) | Price data | EIIE + PVM + OSBL | LIMITED | Backtests in cryptocurrency market with 30-minute trading period; evaluates CNN/RNN/LSTM variants. |
| 2022 | Deep Reinforcement Learning for Portfolio Management | EasyChair | Stocks + crypto (stated portfolios) | Not stated | Price data | Policy gradient + CNN/RNN | OPEN | Compares to equal-weight and single-stock baselines. |
| 2023 | Portfolio Management based on Deep Reinforcement Learning Method with Data Augment | Procedia Computer Science | Not stated | Not stated | Price + indicators | DDPG with financial indicators | OPEN | Compares indicators vs price-only inputs. |
| 2024 | A Systematic Approach to Portfolio Optimization: Comparative Study of RL Agents, Market Signals, Horizons | Algorithms (MDPI) | Not stated | Not stated | OHLC + indicators | DQN/DDPG/PPO/SAC benchmark | OPEN | Compares agents across signals and rebalance frequencies. |
| 2023 | Online portfolio management via deep reinforcement learning with high-frequency data | Information Processing & Management | Not stated | HFT | High-frequency data | Transformer-based RL (LSRE-CAAN) | PAYWALLED | Long-sequence extractor + cross-asset attention. |
| 2023 | Deep reinforcement learning for portfolio management | Knowledge-Based Systems | Not stated | Not stated | Not stated | Global-context aware RL | PAYWALLED | Focus on global context embeddings. |
| 2025 | PortfolioZero: A stock portfolio model based on deep reinforcement learning | Applied Soft Computing | Stocks | Not stated | Not stated | Transformer + MCTS + sentiment | PAYWALLED | Claims improved returns across market conditions. |

---

## I) FX forecasting (ML)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2025 | Directional forecasting for eight forex pairs against the US dollar using machine learning techniques | Discover Artificial Intelligence | FX (8 pairs vs USD) | Daily | OHLC + macro indicators | ML classifiers with dynamic transaction costs | OPEN | 2018-2023 daily data; 8 pairs (EUR, JPY, CHF, AUD, CNY, MXN, ZAR, TRY); published Aug 27, 2025; DOI 10.1007/s44163-025-00424-4. |
| 2024 | FX-spot predictions with transformer and time embeddings | Expert Systems with Applications | FX spot | Not stated | Time series | Transformer with time embeddings | OPEN | ESwA Vol 249 (Part B), 123538; DOI 10.1016/j.eswa.2024.123538. |

---

## J) Crypto forecasting (DL)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2024 | Forecasting of Cryptocurrency Price and Financial Stability: Fresh Insights based on Big Data Analytics and Deep Learning AI Techniques | ETASR | BTC, ETH | Intraday | High-frequency price | LSTM forecasting | OPEN | Uses high-frequency BTC/ETH data from 2019-12-31 to 2020-12-31 (COVID period); DOI 10.48084/etasr.7096. |

---

## K) FX options / volatility forecasting

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2024 | Forecasting implied volatilities of currency options with ML and econometrics models | Int. J. Data Science and Analytics | FX options (EURUSD) | Not stated | Volatility surface data | LSTM vs RF vs AR-GARCH | OPEN | LSTM best at shorter maturities; AR-GARCH better at longer; DOI 10.1007/s41060-024-00528-7. |

---

## K) Public LOB benchmark datasets

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2018 | Benchmark dataset for mid-price forecasting of limit order book data with machine learning methods | Journal of Forecasting | Nasdaq Nordic stocks (5) | HFT | LOB | Public benchmark dataset + baselines | LIMITED | 10 days, ~4,000,000 samples; anchored CV protocol; DOI 10.1002/for.2543. |

---

## L) News and sentiment (NLP signals)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2019 | FinBERT: Financial Sentiment Analysis with Pre-trained Language Models | arXiv 1908.10063 | Not stated | Not stated | Financial text | Domain-specific BERT for sentiment | LIMITED | Improves sentiment classification on financial datasets; DOI 10.48550/arXiv.1908.10063. |
| 2021 | Stock Movement Prediction with Financial News using Contextualized Embedding from BERT | arXiv 2107.08721 | US equities | Short-term | News headlines | FT-CE-RNN using BERT embeddings | LIMITED | Uses Bloomberg news headlines; reports better accuracy and trading simulations vs baselines. |
| 2024 | Stress index strategy enhanced with financial news sentiment analysis for the equity markets | arXiv 2404.00012 | Equities (US + major markets) | Not stated | News summaries + stress indicators | GPT-based sentiment + stress index strategy | LIMITED | Reports improved Sharpe and lower drawdowns across markets. |
| 2023 | Deep Learning Approach to Sentiment Analysis in Financial Markets: Algorithms Overview | Zenodo | Not stated | Not stated | Financial news | Survey of DL sentiment methods | OPEN | Overview of BERT/FinBERT and applications in trading. |

---

## M) Execution theory and market impact (non-RL)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2001 | Optimal execution of portfolio transactions | Journal of Risk | Equities | Intraday | Price process + impact | Mean-variance optimal execution (Almgren-Chriss) | LIMITED | Efficient frontier of execution cost vs risk; DOI 10.21314/JOR.2001.041. |
| 2016 | Dynamic optimal execution in a mixed-market-impact Hawkes price model | Finance and Stochastics | Not stated | Intraday | Hawkes processes | Execution under Hawkes impact | PAYWALLED | Mixed impact with Hawkes price model; DOI 10.1007/s00780-015-0282-y. |
| 2019 | Price impact of large orders using Hawkes processes | ANZIAM Journal | Not stated | Intraday | Hawkes processes | Price impact modeling | PAYWALLED | Analyzes large order impact; DOI 10.1017/S1446181119000038. |
| 2022 | Optimal trade execution with uncertain volume target | Journal of Computational Finance | Not stated | Intraday | Price + volume uncertainty | Execution with uncertain volume target | PAYWALLED | Risk-averse trader delays trades; DOI 10.21314/JCF.2022.018. |

---

## N) Market making (microstructure, non-RL)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2008 | High-frequency trading in a limit order book | Quantitative Finance | Equities (model) | HFT | LOB | Avellaneda-Stoikov market making | LIMITED | Classic inventory risk + optimal quotes; DOI 10.1080/14697680701381228. |

---

## O) Backtesting, overfitting, and evaluation

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2014 | Pseudo-Mathematics and Financial Charlatanism: The Effects of Backtest Overfitting on Out-of-Sample Performance | Notices of the AMS | Not stated | Not stated | Backtest simulations | Overfitting in backtests | OPEN | Shows high backtest SR achievable by data mining; warns of negative OOS. |
| 2016 | The Probability of Backtest Overfitting | Journal of Computational Finance | Not stated | Not stated | Backtest simulations | PBO + CSCV framework | LIMITED | Introduces PBO via CSCV; DOI 10.21314/JCF.2016.322. |
| 2013 | The Probability of Back-Test Overfitting | SSRN | Not stated | Not stated | Backtest simulations | PBO (SSRN version) | LIMITED | SSRN preprint; DOI 10.2139/SSRN.2326253. |

---

## P) Statistical arbitrage / pairs / cointegration

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2007 | Statistical arbitrage in the U.S. equities market | Quantitative Finance | US equities | Intraday | Price data | Stat arb portfolio optimization | LIMITED | Found persistent short-term predictability; DOI 10.1080/14697680600724016. |
| 2008 | Optimal trading in a statistical arbitrage strategy | Quantitative Finance | Equities (model) | Intraday | Price process | OU spread trading | LIMITED | Optimal entry/exit under OU dynamics; DOI 10.1080/14697680701434035. |
| 2011 | Optimal stopping for pairs trading: A model with mean-reverting spread | Quantitative Finance | Equities (model) | Intraday | Spread process | Optimal stopping for pairs trading | LIMITED | Closed-form optimal thresholds; DOI 10.1080/14697688.2010.541483. |
| 2017 | Pairs trading in the commodity futures market | Quantitative Finance | Commodities futures | Intraday | Futures prices | Cointegration + pairs trading | LIMITED | Tests pairs across futures contracts; DOI 10.1080/14697688.2016.1272844. |
| 2019 | Pairs trading strategy based on a new statistical distance metric | Expert Systems with Applications | Equities | Daily | Price data | Distance metric for pairs selection | PAYWALLED | Proposes new distance metric; DOI 10.1016/j.eswa.2019.112919. |

---

## Q) Volatility / options / hedging

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2020 | Deep Hedging | Quantitative Finance | Options | Intraday | Price + options | Deep hedging (RL) | LIMITED | Uses neural networks for dynamic hedging; DOI 10.1080/14697688.2019.1571681. |
| 2021 | Deep Hedging of derivatives using neural networks | Finance and Stochastics | Options | Intraday | Price + options | NN-based hedging | PAYWALLED | Theoretical framework for deep hedging; DOI 10.1007/s00780-020-00423-0. |
| 2022 | Volatility forecasting in financial markets with ML methods | Journal of Forecasting | Equities/FX | Daily | Volatility data | ML vs econometric vol forecasting | LIMITED | Benchmarks ML vs GARCH-family; DOI 10.1002/for.2810. |

---

## R) Regime switching / macro

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2013 | Regime-switching in volatility and correlation structure using range-based models with Markov-switching | Economic Modelling | Multi-asset | Not stated | Range-based volatility | Markov-switching regimes | LIMITED | Regime-dependent volatility/correlation; DOI 10.1016/j.econmod.2012.11.013. |
| 2025 | Forecasting realized volatility using regime-switching models | International Review of Economics & Finance | Not stated | Not stated | Realized volatility | Regime-switching forecasting | LIMITED | Compares MS models vs standard; DOI 10.1016/j.iref.2025.104171. |
| 2021 | High-frequency volatility modeling: A Markov-Switching ACI model | Journal of Economic Dynamics and Control | Not stated | HFT | High-frequency data | MS-ACI volatility model | LIMITED | Applies MS-ACI to HF volatility; DOI 10.1016/j.jedc.2021.104077. |

---

## S) Transaction costs / slippage / impact modeling

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2010 | Portfolio choice under transitory price impact | Journal of Economic Dynamics and Control | Not stated | Not stated | Impact models | Optimal portfolio under temporary impact | LIMITED | Establishes transitory impact in portfolio choice; DOI 10.1016/j.jedc.2010.06.005. |
| 2011 | Portfolio choice and the effects of liquidity | SERIEs | Not stated | Not stated | Liquidity proxies | Portfolio choice with liquidity | LIMITED | Shows liquidity effects on portfolio choice; DOI 10.1007/s13209-010-0025-4. |
| 2025 | Markowitz portfolios under transaction costs | QREF | Not stated | Not stated | Transaction cost model | Portfolio optimization with costs | LIMITED | Extends Markowitz with explicit costs; DOI 10.1016/j.qref.2025.101962. |

---

## T) HFT microstructure (queue position / order placement)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2013 | Queue position valuation in a limit order book | Quantitative Finance | Equities | HFT | LOB | Queue position valuation | LIMITED | Models queue priority value; DOI 10.1080/14697688.2013.835320. |
| 2015 | Order placement in limit order markets | Journal of Financial Markets | Equities | HFT | LOB | Order placement strategy | PAYWALLED | Empirical + model; DOI 10.1016/j.finmar.2014.11.001. |
| 2016 | Limit order placement by high-frequency traders | Borsa Istanbul Review | Equities | HFT | Order placement/execution/cancel data | HFT order placement + cancellations | OPEN | HFTs manage cancellations strategically; DOI 10.1016/j.bir.2016.09.006. |
| 2017 | A model for queue position valuation in a limit order book | SSRN | Equities (model) | HFT | LOB | Queue position value (static + dynamic) | LIMITED | Dynamic queue position value; DOI 10.2139/ssrn.2996221. |

---

## T2) Order routing / order placement (multi-venue)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2012 | Optimal order placement in limit order markets | SSRN | Equities | HFT/Intraday | LOB + fees | Optimal split of limit/market across venues | LIMITED | Convex optimization with fee/rebate effects; DOI 10.2139/ssrn.2155218. |
| 2012 | Optimal order placement in limit order markets | arXiv 1210.1625 | Equities | HFT/Intraday | LOB + fees | Optimal split of limit/market across venues | LIMITED | arXiv version of Cont & Kukanov; DOI 10.48550/arXiv.1210.1625. |
| 2013 | Undisclosed orders and optimal submission strategies in a limit order market | Journal of Financial Economics | Equities | HFT/Intraday | LOB | Optimal limit/market/reserve order submission | PAYWALLED | Reserve orders reduce exposure costs; DOI 10.1016/j.jfineco.2013.04.002. |
| 1995 | An Empirical Analysis of the Limit Order Book and the Order Flow in the Paris Bourse | Journal of Finance | Equities | Intraday | Order flow | Preopening order flow dynamics | PAYWALLED | Order flow accelerates toward end of preopening; INSEAD summary. |

---

## T3) Rates / Treasury microstructure

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2023 | The Evolution of Treasury Market Liquidity: Evidence from 30 Years of Limit Order Book Data | FRB New York Staff Report 827 | U.S. Treasuries (on-the-run 2-, 5-, 10-year) | Intraday/Daily | Order book + transactions | Liquidity index from spreads, depth, price impact | OPEN | 1991–2021 LOB + trades; liquidity index sensitive to short-term drivers; PDF available from NY Fed. |
| 2016 | Reducing transaction costs with low-latency trading algorithms | Quantitative Finance | U.S. Treasuries (on-the-run) | Intraday | LOB imbalance + latency | Optimal liquidation vs TWAP under latency | LIMITED | Uses top-of-book imbalance and latency; shows TWAP outperformed by low-latency policy in Treasury liquidation. |

---

## T4) FX microstructure / LOB (EBS, order choice)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2012 | The information content of a limit order book: The case of an FX market | Journal of Financial Markets | FX (Dollar–Sterling) | HFT | Tick + LOB | LOB info content vs price-only | PAYWALLED | LOB variables explain returns in-sample but limited OOS economic gains once costs considered; DOI 10.1016/j.finmar.2011.07.002. |
| 2014 | Order choices under information asymmetry in foreign exchange markets | J. Int. Financial Markets, Institutions & Money | FX (EURUSD, USDJPY) | HFT | EBS order data | Order aggressiveness + price impact | PAYWALLED | Patient limit orders contain more information; DOI 10.1016/j.intfin.2014.01.008. |
| 2016 | Stepping out of the limit order book: Empirical evidence from the EBS FX market | MPRA | FX (EBS) | HFT | Order lifetimes | Cancellations and order exit | OPEN | Limit order lifetimes driven by depth and price moves; MPRA 70291 PDF. |
| 2022 | LSTM forecasting foreign exchange rates using limit order book | Finance Research Letters | FX | Intraday (1‑min) | LOB events | LSTM prediction vs costs | PAYWALLED | Predictive power but no economic gain after bid‑ask spread; DOI 10.1016/j.frl.2021.102517. |

---

## T5) Commodity futures microstructure / LOB

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2021 | Volatility and Depth in Commodity and FX Futures Markets | Journal of Risk and Financial Management | Commodity + FX futures | Intraday | 5‑deep LOB | Volatility–depth relation | OPEN | Finds negative volatility–depth relation; DOI 10.3390/jrfm14110545. |
| 2019 | Limit order books, uninformed traders and commodity derivatives: Insights from the European carbon futures | Economic Modelling | EU carbon futures | Intraday | LOB | Limit orders to reduce adverse selection | PAYWALLED | Uninformed traders use limit orders strategically; DOI 10.1016/j.econmod.2019.07.009. |
| 2022 | Measuring commodity market quality | Journal of Banking & Finance | Commodity futures | Intraday/Daily | LOB + TAS | Liquidity proxies & market quality | PAYWALLED | Volatility‑over‑volume best proxy; 11‑year ms LOB data; DOI 10.1016/j.jbankfin.2022.106658. |

---

## T6) Options microstructure / limit orders

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 1996 | Large Option Trades, Market Makers, and Limit Orders | Review of Financial Studies | Options (US equities) | Intraday | Option trade/quote data | Liquidity supply & adverse selection | PAYWALLED | Evidence of limit orders being picked off after adverse moves; DOI 10.1093/rfs/9.3.977. |

---

## T7) Market quality / data flow measures

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2019 | Extracting information from the limit order book: New measures to evaluate equity data flow | High Frequency (Wiley) | US equities | Intraday | Level‑I LOB | Activity‑weighted spread/return metrics | PAYWALLED | Measures change distribution under external events; DOI 10.1002/hf2.10029. |

---

## U) Infrastructure / deterministic systems / replay

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2011 | Federal Reserve SR 11-7: Supervisory Guidance on Model Risk Management | Fed | Banking models | Not stated | Governance | Model risk governance | OPEN | Sets expectations for validation, governance, and controls. |
| 2017 | FDIC FIL-22-2017: Adoption of SR 11-7 | FDIC | Banking models | Not stated | Governance | Model risk governance | OPEN | Extends SR 11-7 adoption. |
| 2023 | NIST AI RMF 1.0 | NIST | AI systems | Not stated | Governance | AI risk framework | OPEN | Govern/Measure/Manage guidance; reference for auditability. |
| 2024 | FIA Best Practices for Automated Trading Risk Controls and System Safeguards | FIA | Automated trading | Not stated | Controls | Risk controls + safeguards | OPEN | Controls for pre-trade risk, kill switches, and monitoring. |

---

## U2) Causal sentiment / event effects

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2022 | The causal relationship between social media sentiment and stock return: Experimental evidence from an online message forum | Economics Letters | Equities | Daily | Forum sentiment | Causal effect of sentiment on returns | PAYWALLED | Significant same-day causal effect; DOI 10.1016/j.econlet.2022.110598. |

---
## V) Crypto microstructure / liquidity

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2019 | Order flow analysis of cryptocurrency markets | Digital Finance | Crypto (BitMEX XBTUSD perpetual) | Intraday | Trade + quote data | Order flow imbalance vs price change | LIMITED | Trade flow imbalance explains contemporaneous price changes; DOI 10.1007/s42521-019-00007-w. |
| 2025 | Order Book Liquidity on Crypto Exchanges | Journal of Risk and Financial Management | Crypto (multi-exchange) | Intraday | Order book data | Liquidity measures + timing | OPEN | Order book variation explains intraday liquidity; DOI 10.3390/jrfm18030124. |

---

## W) Event risk / options signals

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2025 | Pricing event risk: evidence from concave implied volatility curves | Review of Finance | Equity options | Event windows | Options IV curves | Event risk detection via IV concavity | PAYWALLED | Concave IV curves predict higher EAD returns/volatility; DOI 10.1093/rof/rfaf016. |
| 2023 | Detecting political event risk in the option market | Journal of Banking & Finance | GBPUSD options (Brexit) | Event window | Options RND/IV | Event risk detection | PAYWALLED | W-shaped IV and bimodal RND around referendum; DOI 10.1016/j.jbankfin.2022.106624. |

---

## X) Execution costs / broker evaluation (empirical)

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2007 | Market impact costs of institutional equity trades | Journal of International Money and Finance | Equities (institutional fund) | Intraday | Trade data | Empirical market impact costs | PAYWALLED | Average impact ~20-30bp; DOI 10.1016/j.jimonfin.2007.01.007. |
| 2024 | Optimizing Broker Performance Evaluation through Intraday Modeling of Execution Cost | arXiv 2405.18936 | Not stated | Intraday | Execution cost data | Linear + quadratic cost estimation | LIMITED | Transient impact model; improves cost estimation; DOI 10.48550/arXiv.2405.18936. |

---

## Y) Transaction costs in portfolio construction

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2024 | Cost mitigation of factor investing in emerging equity markets | Journal of Asset Management | Emerging equities | Not stated | Price + liquidity | Cost-aware factor tilts | OPEN | Limits order size vs liquidity to mitigate impact; DOI 10.1057/s41260-024-00353-4. |

---

## Z) GenAI / LLMs for synthetic data generation and agentic models

| Year | Title | Venue | Markets | Horizon | Data | Strategy/Focus | Access | Notes |
|---|---|---|---|---|---|---|---|---|
| 2024 | Generative AI for End-to-End Limit Order Book Simulation | arXiv 2407.13217 | Not stated | HFT | LOB | GAN for synthetic LOB data generation | LIMITED | Models joint dynamics of trades, prices, volumes, and order flow; DOI 10.48550/arXiv.2407.13217. |
| 2024 | Trade Masters: Towards a Unified Framework for Autonomous Trading Agents via Large Language Models | arXiv 2407.13460 | Not stated | Not stated | Price + news + indicators | LLM-based agentic framework | LIMITED | Proposes agent framework with memory, reasoning, and tool use; DOI 10.48550/arXiv.2407.13460. |
| 2023 | FinGPT: Instruction Tuning for Financial Large Language Models | arXiv 2310.04761 | Not stated | Not stated | Financial text | Instruction-tuned LLM for finance | LIMITED | Open-source FinLLM; instruction tuning on financial data; DOI 10.48550/arXiv.2310.04761. |
| 2024 | A Large Language Model for Quantitative Trading | arXiv 2402.09743 | China A-shares | Not stated | Price + text + order flow | LLM for alpha factor generation | LIMITED | LLM extracts insights from text to generate alpha factors; DOI 10.48550/arXiv.2402.09743. |

---

## Access gaps (needs PDF or full-text)
- Microstructure in the Machine Age (RFS): paywalled; need PDF or institutional access.
- Expert Systems with Applications (execution RL 2024): paywalled; need PDF.
- Several ScienceDirect / Wiley papers: paywalled.
- arXiv full PDFs blocked by tool; need to retrieve via accessible mirrors or direct PDFs provided by user.

---

## PDF recovery log (OPEN + LIMITED arXiv/SSRN)

| Title | PDF URL | Access | Status | Notes |
|---|---|---|---|---|
| A Survey of Deep Reinforcement Learning in Financial Markets | https://www.atlantis-press.com/article/125999560.pdf | OPEN | Retrieved | Atlantis Press PDF. |
| Machine Learning Applications in Algorithmic Trading: A Comprehensive Systematic Review | https://www.mecs-press.org/ijeme/ijeme-v13-n6/IJEME-V13-N6-5.pdf | OPEN | Retrieved | IJEME full-text PDF. |
| DeepLOB: Deep Convolutional Neural Networks for Limit Order Books | http://arxiv.org/pdf/1808.03668 | LIMITED | Retrieved | arXiv PDF via EconPapers. |
| HLOB -- Information Persistence and Structure in Limit Order Books | http://arxiv.org/pdf/2405.18938 | LIMITED | Retrieved | arXiv PDF via EconPapers. |
| TLOB: A Novel Transformer Model with Dual Attention for Price Trend Prediction with LOB Data | http://arxiv.org/pdf/2502.15757 | LIMITED | Retrieved | arXiv PDF via EconPapers. |
| FinRL: Deep Reinforcement Learning Framework to Automate Trading in Quantitative Finance | http://arxiv.org/pdf/2111.09395 | LIMITED | Retrieved | arXiv PDF via EconPapers. |
| Reinforcement Learning Pair Trading: A Dynamic Scaling Approach | https://arxiv.org/pdf/2407.16103 | LIMITED | Retrieved | arXiv PDF via listing. |
| Reinforcement Learning for Optimal Execution when Liquidity is Time-Varying | http://arxiv.org/pdf/2402.12049 | LIMITED | Retrieved | arXiv PDF via EconPapers. |

---

## Next batch (in progress)
- Expand to 100+ papers across: LOB deep learning, execution/impact, market making, portfolio RL, FX forecasting, crypto trading, options hedging, and infra/system design.
- Each paper will be tagged with market, horizon, data type, and result claims (if available in full text).
