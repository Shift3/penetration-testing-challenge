ALTER TABLE "blogapp"."users" ADD COLUMN "forgot_password_token" character(60) DEFAULT null;
ALTER TABLE "blogapp"."users" ADD COLUMN "forgot_password_timestamp" timestamp DEFAULT null;
