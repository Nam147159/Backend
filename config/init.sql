--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Postgres.app)
-- Dumped by pg_dump version 15.3

-- Started on 2024-10-27 16:46:37 +07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 223 (class 1255 OID 16429)
-- Name: crypt(text, text); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.crypt(text, text) RETURNS text
    LANGUAGE c IMMUTABLE STRICT PARALLEL SAFE
    AS '$libdir/pgcrypto', 'pg_crypt';


ALTER FUNCTION public.crypt(text, text) OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 16430)
-- Name: fn_sign_in(text, text); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.fn_sign_in(p_login_identifier text, p_password text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_info JSONB;
    user_password TEXT;
BEGIN
    -- Validate input parameters
    IF p_login_identifier IS NULL OR p_password IS NULL THEN
        RAISE EXCEPTION 'Invalid input parameters';
        RETURN NULL;
    END IF;

    -- The input appears to be an email, so we look up the user by email
    IF p_login_identifier LIKE '%@%' THEN
        SELECT authentication.password
        INTO user_password
        FROM authentication
        JOIN users ON authentication.user_id = users.id
        WHERE users.email = p_login_identifier;
    ELSE
        SELECT authentication.password
        INTO user_password
        FROM authentication
        JOIN users ON authentication.user_id = users.id
        WHERE users.username = p_login_identifier;
    END IF;

    -- Check if the password is valid
    IF user_password IS NOT NULL AND user_password = crypt(p_password, user_password) THEN
        -- Retrieve user information based on the login identifier
        IF p_login_identifier LIKE '%@%' THEN
            SELECT jsonb_build_object(
                'id', id,
                'username', username,
                'email', email,
				'status', status,
				'birthday', birthday,
				'gender', gender,
				'plan_id', plan_id,
				'created_at', created_at,
				'updated_at', updated_at
            ) INTO user_info
            FROM users
            WHERE email = p_login_identifier;
        ELSE
            SELECT jsonb_build_object(
                'id', id,
                'username', username,
                'email', email,
				'status', status,
				'birthday', birthday,
				'gender', gender,
				'plan_id', plan_id,
				'created_at', created_at,
				'updated_at', updated_at
            ) INTO user_info
            FROM users
            WHERE username = p_login_identifier;
        END IF;

        RETURN user_info;
    ELSE
        RAISE EXCEPTION 'Invalid email address, username, or password';
        RETURN NULL;
    END IF;
EXCEPTION
    -- Handle any exceptions that might occur (e.g., invalid SQL)
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error: %', SQLERRM;
        RETURN NULL;
END;
$$;


ALTER FUNCTION public.fn_sign_in(p_login_identifier text, p_password text) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 16432)
-- Name: gen_salt(text); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.gen_salt(text) RETURNS text
    LANGUAGE c STRICT PARALLEL SAFE
    AS '$libdir/pgcrypto', 'pg_gen_salt';


ALTER FUNCTION public.gen_salt(text) OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 24580)
-- Name: prc_sign_up(text, text, text, timestamp without time zone, boolean); Type: PROCEDURE; Schema: public; Owner: admin
--

CREATE PROCEDURE public.prc_sign_up(IN p_username text, IN p_email text, IN p_password text, IN p_birthday timestamp without time zone, IN p_gender text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_user_id INT;
BEGIN
    -- Start the transaction explicitly
    BEGIN
        -- Insert user information into the users table
        INSERT INTO users (username, email, birthday, gender, status, plan_id, created_at)
        VALUES (p_username, p_email, p_birthday, p_gender, 'activated', 2, NOW())
        RETURNING id INTO new_user_id;

        -- Hash the password and insert authentication information
        INSERT INTO authentication (user_id, password)
        VALUES (new_user_id, crypt(p_password, gen_salt('bf')));

        -- You can perform additional steps here if needed, such as sending a confirmation email

    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback the transaction in case of an exception
            ROLLBACK;
            RAISE EXCEPTION 'Error during sign-up process: %', SQLERRM;
    END;

    -- Commit the transaction
    COMMIT;
END;

$$;


ALTER PROCEDURE public.prc_sign_up(IN p_username text, IN p_email text, IN p_password text, IN p_birthday timestamp without time zone, IN p_gender text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: authentication; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication (
    user_id integer NOT NULL,
    password character varying(255) NOT NULL,
    refresh_token character varying(255),
    verify_token character varying(255)
);


ALTER TABLE public.authentication OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: plan_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.plan_categories (
    id integer NOT NULL,
    status character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    features jsonb NOT NULL
);


ALTER TABLE public.plan_categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16433)
-- Name: plan_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.plan_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plan_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16406)
-- Name: plans; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.plans (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    plan_category_id integer NOT NULL,
    price integer NOT NULL,
    duration integer
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16434)
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.plans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16418)
-- Name: subscription_authentication; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.subscription_authentication (
    subscription_id integer NOT NULL,
    access_token character varying(255) NOT NULL
);


ALTER TABLE public.subscription_authentication OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16423)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    plan_id integer NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    status character varying(20) NOT NULL,
    amount double precision NOT NULL,
    updated_at timestamp with time zone,
    description character varying(255),
    payment_status character varying(20),
    created_at timestamp with time zone
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16392)
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    gender text,
    birthday timestamp with time zone,
    status character varying(20),
    created_at timestamp with time zone,
    updated_at time without time zone,
    plan_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24577)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3648 (class 0 OID 16411)
-- Dependencies: 217
-- Data for Name: authentication; Type: TABLE DATA; Schema: public; Owner: admin
--

-- COPY public.authentication (user_id, password, refresh_token, verify_token) FROM stdin;
-- 1	$2a$06$cm4.vh13KEuxwzBygnhwPuIjo6EP8T1v1xZJhfvcXI/LeCbWE6z/.	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImlhdCI6MTcxOTk3MDY5NSwiZXhwIjoxNzIwMDU3MDk1fQ.j4moZdonwztM9_LM3fUphLlAcTlJ5A_K-aQ9xVDLny8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfZW1haWwiOiJ0cnVvbmdkdWNxdW9jNTg4MUBnbWFpbC5jb20iLCJfY3VycmVudCI6IjIwMjQtMDctMDFUMTQ6NDU6MzYuNzY3WiIsImlhdCI6MTcxOTg0NTEzNiwiZXhwIjoxNzE5ODQ1MTk2fQ.jvqTTF8UD4LkCWxDqt9pZcJ_o-JpRTJ62jXMaiCg0xc
-- \.


--
-- TOC entry 3646 (class 0 OID 16399)
-- Dependencies: 215
-- Data for Name: plan_categories; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.plan_categories (id, status, name, features)
VALUES
    (1, 'activated', 'Mini', '{"features": ["1 mobile-only Premium account", "Offline listening of up to 30 songs on 1 device", "One-time payment", "Basic audio quality"]}'),
    (2, 'activated', 'Individual', '{"features": ["1 Premium account", "Cancel anytime", "Subscribe or one-time payment"]}'),
    (3, 'activated', 'Free', '{"features": []}');


--
-- TOC entry 3647 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.plans (id, name, plan_category_id, price, duration)
VALUES
    (2, 'Free', 3, 0, NULL),
    (3, '1 Day', 1, 2300, 1),
    (4, '1 Week', 1, 8900, 7),
    (5, '1 Month', 2, 65000, 30),
    (6, '3 Month', 2, 195000, 90),
    (7, '6 Month', 2, 354000, 180),
    (8, '1 Year', 2, 590000, 365);


--
-- TOC entry 3649 (class 0 OID 16418)
-- Dependencies: 218
-- Data for Name: subscription_authentication; Type: TABLE DATA; Schema: public; Owner: admin
--

-- COPY public.subscription_authentication (subscription_id, access_token) FROM stdin;
-- \.


--
-- TOC entry 3650 (class 0 OID 16423)
-- Dependencies: 219
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: admin
--

-- COPY public.subscriptions (id, user_id, plan_id, start_date, end_date, status, amount, updated_at, description, payment_status, created_at) FROM stdin;
-- \.


--
-- TOC entry 3645 (class 0 OID 16392)
-- Dependencies: 214
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--


--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 220
-- Name: plan_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

-- SELECT pg_catalog.setval('public.plan_categories_id_seq', 3, true);


--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 221
-- Name: plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

-- SELECT pg_catalog.setval('public.plans_id_seq', 8, true);


--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 222
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

-- SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 3496 (class 2606 OID 16417)
-- Name: authentication authentication_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication
    ADD CONSTRAINT authentication_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3491 (class 2606 OID 16405)
-- Name: plan_categories plan_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plan_categories
    ADD CONSTRAINT plan_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3494 (class 2606 OID 16410)
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- TOC entry 3498 (class 2606 OID 16422)
-- Name: subscription_authentication subscription_authentication_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.subscription_authentication
    ADD CONSTRAINT subscription_authentication_pkey PRIMARY KEY (subscription_id);


--
-- TOC entry 3500 (class 2606 OID 16427)
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3489 (class 2606 OID 16398)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3492 (class 1259 OID 16440)
-- Name: fki_fk_plan_ref_plancategories; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fki_fk_plan_ref_plancategories ON public.plans USING btree (plan_category_id);


--
-- TOC entry 3487 (class 1259 OID 16446)
-- Name: fki_fk_user_ref_plan; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX fki_fk_user_ref_plan ON public.users USING btree (plan_id);


--
-- TOC entry 3502 (class 2606 OID 16435)
-- Name: plans fk_plan_ref_plancategories; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT fk_plan_ref_plancategories FOREIGN KEY (plan_category_id) REFERENCES public.plan_categories(id);


--
-- TOC entry 3501 (class 2606 OID 16441)
-- Name: users fk_user_ref_plan; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_ref_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id);


-- Completed on 2024-10-27 16:46:37 +07

--
-- PostgreSQL database dump complete
--

create table playlists(
    id  text not null primary key,
    owner_id text,
    name text,
    description text,
    public boolean
);

create table playlist_tracks(
    playlist_id text,
    track_id text,
    primary key(playlist_id, track_id)
);

