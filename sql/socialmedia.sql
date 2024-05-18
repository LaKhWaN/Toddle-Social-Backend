--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-05-18 16:18:07

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16422)
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    cmt_active boolean DEFAULT true,
    cmt_post integer NOT NULL,
    cmt_author integer NOT NULL,
    cmt_text text NOT NULL
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16421)
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.comment ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16412)
-- Name: content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content (
    id integer NOT NULL,
    c_author integer NOT NULL,
    c_active boolean DEFAULT true NOT NULL,
    c_text text NOT NULL,
    c_image text,
    c_video text
);


ALTER TABLE public.content OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.content ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16433)
-- Name: followings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.followings (
    id integer NOT NULL,
    followerid integer NOT NULL,
    followingid integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.followings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16432)
-- Name: followings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.followings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.followings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16440)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    like_active boolean DEFAULT true,
    liked_by integer NOT NULL,
    liked_content integer NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16439)
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.likes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    firstname text,
    lastname text,
    email text,
    followers integer DEFAULT 0,
    following integer DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16401)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
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
-- TOC entry 4814 (class 0 OID 16422)
-- Dependencies: 220
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, cmt_active, cmt_post, cmt_author, cmt_text) FROM stdin;
2	t	8	3	I am user 3 and did this comment
4	t	23	3	I am user 3 and did this comment
5	t	8	5	I am user 3 and did this comment
6	t	8	5	I am user 3 and did this comment
3	f	23	3	I am user 3 and did this comment
1	t	8	3	I am the first comment on post 8!
\.


--
-- TOC entry 4812 (class 0 OID 16412)
-- Dependencies: 218
-- Data for Name: content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content (id, c_author, c_active, c_text, c_image, c_video) FROM stdin;
1	4	f	This is my first content of GraphQL API	\N	\N
2	2	t	Hi there I am new to this website	\N	\N
4	3	t	First content	\N	\N
5	3	t	Second content	\N	\N
6	4	t	This is my first	\N	\N
7	5	t	This is my first	\N	\N
8	5	t	This is my sec	\N	\N
9	4	t	This is my sec	\N	\N
10	4	t	i m 4	\N	\N
11	5	f	i m 5	\N	\N
3	3	f	Hi guys	\N	\N
\.


--
-- TOC entry 4816 (class 0 OID 16433)
-- Dependencies: 222
-- Data for Name: followings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.followings (id, followerid, followingid, "timestamp") FROM stdin;
2	5	6	2024-05-18 04:18:06.982205
4	4	5	2024-05-18 04:20:31.055075
5	3	4	2024-05-18 04:45:51.808701
6	2	3	2024-05-18 04:52:30.247511
\.


--
-- TOC entry 4818 (class 0 OID 16440)
-- Dependencies: 224
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, like_active, liked_by, liked_content) FROM stdin;
1	t	6	8
\.


--
-- TOC entry 4809 (class 0 OID 16398)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, firstname, lastname, email, followers, following) FROM stdin;
4	upender	upender	lakhwan	upender	upender	0	0
5	shriya	shriya	shriya	lakhwan	shriya	0	0
6	prince	prince	prince	lakhwan	prince	0	0
7	hema	hema	hema	lakhwan	hema	0	0
8	abc	abc	abc	abc	abc	0	0
\.


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 219
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 6, true);


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 217
-- Name: content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.content_id_seq', 11, true);


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 221
-- Name: followings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.followings_id_seq', 6, true);


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 223
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, true);


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 4663 (class 2606 OID 16416)
-- Name: content content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT content_pkey PRIMARY KEY (id);


--
-- TOC entry 4665 (class 2606 OID 16437)
-- Name: followings followings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.followings
    ADD CONSTRAINT followings_pkey PRIMARY KEY (id);


--
-- TOC entry 4661 (class 2606 OID 16406)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2024-05-18 16:18:07

--
-- PostgreSQL database dump complete
--

