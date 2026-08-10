ALTER TABLE "daily_topics" ALTER COLUMN "feed_key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "daily_topics" ALTER COLUMN "feed_key" SET DEFAULT 'global';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "feed_key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "feed_key" SET DEFAULT 'global';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "interests" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "feed_key_applies_date" date;