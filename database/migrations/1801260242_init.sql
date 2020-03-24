
CREATE SCHEMA IF NOT EXISTS "blogapp";

CREATE TABLE blogapp.posts (
    id SERIAL NOT NULL,
    title character varying NOT NULL,
    post character varying NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "blogapp"."posts" ADD CONSTRAINT post_pkey PRIMARY KEY (id);
ALTER TABLE "blogapp"."posts" OWNER TO postgres;

CREATE TABLE blogapp.users (
    id SERIAL NOT NULL,
    username character varying NOT NULL UNIQUE,
    email character varying NOT NULL UNIQUE,
    password character(60) NOT NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "blogapp"."users" ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE "blogapp"."users" OWNER TO postgres;

ALTER TABLE "blogapp"."posts" ADD FOREIGN KEY ("user_id") REFERENCES "blogapp"."users"("id");
