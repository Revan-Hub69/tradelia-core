// NASA-Grade Prompts
// Separated by brick, no contamination, schema-only (no examples)

export const SYSTEM_PROMPT = `You are Tradelia Desk Analyst (internal). You must be deterministic, concise, and auditable.

CRITICAL RULES:
- Output MUST be valid JSON only (no markdown, no extra text)
- Do not invent data. Use only provided inputs
- Never change the schema. Never rename keys
- Provide numeric thresholds and discrete states
- Use only the provided inputs. No external assumptions
- Every claim must reference an input field path in "evidence"
- If contradictions exist, set state to "REVIEW" and explain conflicts`;

export function getBrick1Prompt(inputCanon: any, auditResult: any): string {
  return `TASK: BRICK1_ONLY - Market State Analysis

INPUT_CANON: ${JSON.stringify(inputCanon)}
AUDIT: ${JSON.stringify(auditResult)}

Analyze the market state and generate trading policy. Return ONLY this JSON structure:

{
  "meta": {
    "mode": "BRICK1_ONLY",
    "engine": {"name": "groq-analyst", "version": "1.0.0"},
    "ts": ${Date.now()},
    "input_hash": "${auditResult.input_hash}",
    "notes": ""
  },
  "status": {
    "state": "ACTIVE|REVIEW|HOLD|NEEDS_DATA",
    "go_no_go": "GO|NO_GO",
    "confidence": 0,
    "blocking_reasons": []
  },
  "brick1": {
    "market_state": {
      "regime": "TREND|RANGE|TRANSITION",
      "vol_state": "LOW|NORMAL|HIGH|EXTREME",
      "liquidity_state": "GOOD|THIN|DETERIORATING",
      "stress_flag": false,
      "timeframe_anchor": "4h",
      "risk_window_days": [0, 0]
    },
    "policy": {
      "allowed_playbooks": [],
      "blocked_playbooks": [],
      "max_risk_r": 0.0,
      "notes": []
    },
    "evidence": []
  },
  "brick2": {},
  "brick1_plus_brick2": {},
  "audit": {
    "input_coverage_pct": ${auditResult.input_coverage_pct},
    "assumptions": ${JSON.stringify(auditResult.assumptions)},
    "conflicts": ${JSON.stringify(auditResult.conflicts)},
    "sanity_checks": ${JSON.stringify(auditResult.sanity_checks)}
  }
}

INSTRUCTIONS:
- Use INPUT_CANON.brick1 data to determine market_state
- Set policy based on regime and stress conditions
- Reference input paths in evidence array (must start with "INPUT.")
- Use AUDIT data for coverage and conflicts
- Set confidence as integer 0-100 based on data quality and conflicts
- If sanity checks fail, set state to "NEEDS_DATA" and go_no_go to "NO_GO"`;
}

export function getBrick2Prompt(inputCanon: any, auditResult: any): string {
  return `TASK: BRICK2_ONLY - Universe Screening

INPUT_CANON: ${JSON.stringify(inputCanon)}
AUDIT: ${JSON.stringify(auditResult)}

Analyze universe candidates and rank opportunities. Return ONLY this JSON structure:

{
  "meta": {
    "mode": "BRICK2_ONLY",
    "engine": {"name": "groq-analyst", "version": "1.0.0"},
    "ts": ${Date.now()},
    "input_hash": "${auditResult.input_hash}",
    "notes": ""
  },
  "status": {
    "state": "ACTIVE|REVIEW|HOLD|NEEDS_DATA",
    "go_no_go": "GO|NO_GO",
    "confidence": 0,
    "blocking_reasons": []
  },
  "brick1": {},
  "brick2": {
    "universe": {
      "asof_ts": ${Date.now()},
      "top": [],
      "avoid": []
    },
    "evidence": []
  },
  "brick1_plus_brick2": {},
  "audit": {
    "input_coverage_pct": ${auditResult.input_coverage_pct},
    "assumptions": ${JSON.stringify(auditResult.assumptions)},
    "conflicts": ${JSON.stringify(auditResult.conflicts)},
    "sanity_checks": ${JSON.stringify(auditResult.sanity_checks)}
  }
}

INSTRUCTIONS:
- Use INPUT_CANON.brick2.candidates to populate top array
- Categorize each candidate: A_TREND_CLEAN|B_VOL_EXPANSION|C_MEAN_REVERT|D_AVOID
- Include tradability metrics from input
- Move D_AVOID candidates to avoid array
- Reference input paths in evidence array`;
}

export function getBrick1Plus2Prompt(inputCanon: any, auditResult: any): string {
  return `TASK: BRICK1_PLUS_BRICK2 - Integrated Analysis

INPUT_CANON: ${JSON.stringify(inputCanon)}
AUDIT: ${JSON.stringify(auditResult)}

Combine market state policy with universe screening. Return ONLY this JSON structure:

{
  "meta": {
    "mode": "BRICK1_PLUS_BRICK2",
    "engine": {"name": "groq-analyst", "version": "1.0.0"},
    "ts": ${Date.now()},
    "input_hash": "${auditResult.input_hash}",
    "notes": ""
  },
  "status": {
    "state": "ACTIVE|REVIEW|HOLD|NEEDS_DATA",
    "go_no_go": "GO|NO_GO",
    "confidence": 0,
    "blocking_reasons": []
  },
  "brick1": {
    "market_state": {
      "regime": "TREND|RANGE|TRANSITION",
      "vol_state": "LOW|NORMAL|HIGH|EXTREME",
      "liquidity_state": "GOOD|THIN|DETERIORATING",
      "stress_flag": false,
      "timeframe_anchor": "4h",
      "risk_window_days": [0, 0]
    },
    "policy": {
      "allowed_playbooks": [],
      "blocked_playbooks": [],
      "max_risk_r": 0.0,
      "notes": []
    },
    "evidence": []
  },
  "brick2": {
    "universe": {
      "asof_ts": ${Date.now()},
      "top": [],
      "avoid": []
    },
    "evidence": []
  },
  "brick1_plus_brick2": {
    "filtered_top": [],
    "evidence": []
  },
  "audit": {
    "input_coverage_pct": ${auditResult.input_coverage_pct},
    "assumptions": ${JSON.stringify(auditResult.assumptions)},
    "conflicts": ${JSON.stringify(auditResult.conflicts)},
    "sanity_checks": ${JSON.stringify(auditResult.sanity_checks)}
  }
}

INSTRUCTIONS:
- First analyze brick1 data for market state and policy
- Then analyze brick2 candidates for universe screening
- Finally filter brick2.top through brick1.policy to create filtered_top
- Each filtered_top item needs: symbol, action (FOCUS|WATCH|IGNORE), playbook, reason
- Only recommend FOCUS if both regime allows and candidate scores high
- Reference input paths in all evidence arrays`;
}