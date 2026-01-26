CREATE TABLE IF NOT EXISTS "alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" text,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"message" text NOT NULL,
	"dismissed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"prop_firm_id" text,
	"type" text NOT NULL,
	"challenge_type" text NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"entry_fee" integer,
	"currency" text DEFAULT 'USD',
	"refundable" boolean DEFAULT false,
	"refund_conditions" text,
	"account_size" integer NOT NULL,
	"scaling_potential" integer,
	"profit_split" text NOT NULL,
	"rules" text NOT NULL,
	"payout_speed" text NOT NULL,
	"first_payout_delay" integer,
	"markets" text NOT NULL,
	"platforms" text,
	"status" text DEFAULT 'active' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"recurring" boolean DEFAULT false,
	"frequency" text,
	"description" text,
	"pros" text,
	"cons" text,
	"best_for" text,
	"official_url" text,
	"logo_url" text,
	"popularity" integer DEFAULT 0,
	"success_rate" integer,
	"average_pass_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "challenges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prop_firms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"founded" integer,
	"total_paid" bigint,
	"reputation" integer,
	"logo_url" text,
	"website_url" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prop_firms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signal_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"watchlist" text DEFAULT '[]' NOT NULL,
	"min_confidence" integer DEFAULT 70 NOT NULL,
	"max_risk_per_trade" integer DEFAULT 100 NOT NULL,
	"min_risk_reward" integer DEFAULT 150 NOT NULL,
	"timeframes" text DEFAULT '["H1","H4"]' NOT NULL,
	"indicators" text NOT NULL,
	"notifications" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "signal_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"user_name" text NOT NULL,
	"user_email" text NOT NULL,
	"user_phone" text,
	"user_locale" text NOT NULL,
	"inquiry_type" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"closed_at" timestamp,
	"assigned_to" text,
	"source" text DEFAULT 'contact_form' NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"follow_up_sent_at" timestamp,
	"follow_up_count" integer DEFAULT 0 NOT NULL,
	"feedback_rating" integer,
	"feedback_comment" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracked_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" text,
	"name" text NOT NULL,
	"account_size" integer NOT NULL,
	"phase" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"days_remaining" integer,
	"starting_balance" integer NOT NULL,
	"current_balance" integer NOT NULL,
	"high_water_mark" integer NOT NULL,
	"total_pnl" integer DEFAULT 0 NOT NULL,
	"today_pnl" integer DEFAULT 0 NOT NULL,
	"rules" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"violations" text DEFAULT '[]',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trades" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" text,
	"signal_id" text,
	"symbol" text NOT NULL,
	"direction" text NOT NULL,
	"entry_price" integer NOT NULL,
	"exit_price" integer,
	"stop_loss" integer NOT NULL,
	"take_profit" integer NOT NULL,
	"position_size" integer NOT NULL,
	"risk_amount" integer NOT NULL,
	"entry_time" timestamp NOT NULL,
	"exit_time" timestamp,
	"pnl" integer,
	"pnl_percentage" integer,
	"r_multiple" integer,
	"status" text DEFAULT 'open' NOT NULL,
	"notes" text,
	"tags" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trading_signals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"symbol" text NOT NULL,
	"direction" text NOT NULL,
	"generated_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"entry" integer NOT NULL,
	"stop_loss" integer NOT NULL,
	"take_profit" integer NOT NULL,
	"risk_reward" integer NOT NULL,
	"confidence" integer NOT NULL,
	"indicators" text NOT NULL,
	"reasoning" text NOT NULL,
	"market_condition" text NOT NULL,
	"timeframe" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"executed_trade_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alerts" ADD CONSTRAINT "alerts_challenge_id_tracked_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."tracked_challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_prop_firm_id_prop_firms_id_fk" FOREIGN KEY ("prop_firm_id") REFERENCES "public"."prop_firms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracked_challenges" ADD CONSTRAINT "tracked_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trades" ADD CONSTRAINT "trades_challenge_id_tracked_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."tracked_challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
