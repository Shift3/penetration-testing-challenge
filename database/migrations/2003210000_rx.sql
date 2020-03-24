CREATE SCHEMA IF NOT EXISTS "hijack";

CREATE TABLE hijack.session_log (
    id SERIAL PRIMARY KEY,
    session_key character varying NOT NULL,
    referer character varying NULL,
    user_agent character varying NULL,
    ip_addr character varying NULL,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE "hijack"."session_log" OWNER TO postgres;

CREATE TABLE hijack.keylog (
    id SERIAL PRIMARY KEY,
    instance_id character(36) UNIQUE NOT NULL,
    session_log_id integer NOT NULL REFERENCES "hijack"."session_log"("id"),
    keystrokes character varying,
    mouseclicks character varying,
    dom_actions character varying,
    created_at timestamp NOT NULL default now(),
    updated_at timestamp NOT NULL default now(),
    deleted_at timestamp default null,
    is_deleted boolean DEFAULT false NOT NULL
);

ALTER TABLE "hijack"."keylog" OWNER TO postgres;
