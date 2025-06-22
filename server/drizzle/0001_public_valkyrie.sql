ALTER TABLE "products" ALTER COLUMN "discount_price" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "set_pieces" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "unit_type" text DEFAULT 'piece' NOT NULL;