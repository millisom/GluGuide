--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.9 (Homebrew)

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
-- Name: test; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA test;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alerts (
    alert_id integer NOT NULL,
    user_id integer NOT NULL,
    reminder_frequency character varying(50),
    reminder_time time without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: alerts_alert_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alerts_alert_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alerts_alert_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alerts_alert_id_seq OWNED BY public.alerts.alert_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    post_id integer,
    author_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    likes integer DEFAULT 0,
    dislikes integer DEFAULT 0,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: dislikes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dislikes (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: dislikes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dislikes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dislikes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dislikes_id_seq OWNED BY public.dislikes.id;


--
-- Name: food_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.food_logs (
    food_log_id integer NOT NULL,
    user_id integer NOT NULL,
    food_id integer NOT NULL,
    quantity_in_grams numeric NOT NULL,
    log_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_calories numeric,
    total_proteins numeric,
    total_fats numeric,
    total_carbs numeric
);


--
-- Name: food_logs_food_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.food_logs_food_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: food_logs_food_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.food_logs_food_log_id_seq OWNED BY public.food_logs.food_log_id;


--
-- Name: foods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.foods (
    food_id integer NOT NULL,
    name character varying(250) NOT NULL,
    calories integer,
    carbs double precision,
    proteins double precision,
    fats double precision
);


--
-- Name: foods_food_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.foods_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: foods_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.foods_food_id_seq OWNED BY public.foods.food_id;


--
-- Name: glucose_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glucose_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    glucose_level numeric(5,2) NOT NULL
);


--
-- Name: glucose_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.glucose_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: glucose_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.glucose_logs_id_seq OWNED BY public.glucose_logs.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: meal_food_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_food_items (
    id integer NOT NULL,
    meal_id integer,
    food_id integer,
    quantity_in_grams numeric NOT NULL
);


--
-- Name: meal_food_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_food_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_food_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_food_items_id_seq OWNED BY public.meal_food_items.id;


--
-- Name: meals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meals (
    meal_id integer NOT NULL,
    user_id integer,
    meal_type character varying(20),
    meal_time timestamp without time zone DEFAULT now(),
    notes text,
    total_calories numeric DEFAULT 0,
    total_proteins numeric DEFAULT 0,
    total_fats numeric DEFAULT 0,
    total_carbs numeric DEFAULT 0,
    food_snapshot jsonb,
    recipe_snapshot jsonb,
    recipe_id integer
);


--
-- Name: meals_meal_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meals_meal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meals_meal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meals_meal_id_seq OWNED BY public.meals.meal_id;


--
-- Name: post_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_tags (
    id integer NOT NULL,
    post_id integer,
    tag_id integer
);


--
-- Name: post_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_tags_id_seq OWNED BY public.post_tags.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer,
    post_picture character varying(255),
    likes integer[]
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: recipe_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_logs (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    user_id integer NOT NULL,
    action character varying(50) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_calories numeric,
    total_proteins numeric,
    total_fats numeric,
    total_carbs numeric
);


--
-- Name: recipe_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_logs_id_seq OWNED BY public.recipe_logs.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    ingredients jsonb NOT NULL,
    instructions jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_calories numeric,
    total_proteins numeric,
    total_fats numeric,
    total_carbs numeric
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_bio text,
    profile_picture character varying(255),
    terms_accepted boolean NOT NULL,
    password_reset_token character varying(255),
    password_reset_expires timestamp without time zone,
    is_admin boolean DEFAULT false NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: test_table; Type: TABLE; Schema: test; Owner: -
--

CREATE TABLE test.test_table (
    id integer NOT NULL,
    age integer,
    quality character varying(255),
    pronoun character varying(2) NOT NULL,
    CONSTRAINT age_check CHECK ((age >= 18))
);


--
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: test; Owner: -
--

ALTER TABLE test.test_table ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.test_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alerts alert_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts ALTER COLUMN alert_id SET DEFAULT nextval('public.alerts_alert_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: dislikes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dislikes ALTER COLUMN id SET DEFAULT nextval('public.dislikes_id_seq'::regclass);


--
-- Name: food_logs food_log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_logs ALTER COLUMN food_log_id SET DEFAULT nextval('public.food_logs_food_log_id_seq'::regclass);


--
-- Name: foods food_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foods ALTER COLUMN food_id SET DEFAULT nextval('public.foods_food_id_seq'::regclass);


--
-- Name: glucose_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glucose_logs ALTER COLUMN id SET DEFAULT nextval('public.glucose_logs_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: meal_food_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_food_items ALTER COLUMN id SET DEFAULT nextval('public.meal_food_items_id_seq'::regclass);


--
-- Name: meals meal_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meals ALTER COLUMN meal_id SET DEFAULT nextval('public.meals_meal_id_seq'::regclass);


--
-- Name: post_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags ALTER COLUMN id SET DEFAULT nextval('public.post_tags_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: recipe_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_logs ALTER COLUMN id SET DEFAULT nextval('public.recipe_logs_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alerts (alert_id, user_id, reminder_frequency, reminder_time, created_at, updated_at) FROM stdin;
6	42	daily	11:02:00	2025-04-17 09:02:32.381864	2025-04-17 09:02:32.381864
49	26	weekly	02:12:00	2025-04-30 00:12:57.953557	2025-04-30 00:14:24.343314
50	26	daily	10:00:00	2025-04-30 16:01:27.357579	2025-04-30 16:01:27.357579
51	63	daily	11:09:00	2025-05-02 09:54:37.203265	2025-05-03 09:08:07.706741
53	26	daily	03:27:00	2025-05-14 01:27:56.427583	2025-05-14 01:27:56.427583
54	26	daily	16:30:00	2025-05-18 14:30:17.239587	2025-05-18 14:30:17.239587
55	41	weekly	10:00:00	2025-05-18 16:55:57.542569	2025-05-18 16:55:57.542569
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, post_id, author_id, content, created_at, likes, dislikes, updated_at) FROM stdin;
55	84	41	Coolio!	2024-11-16 19:48:12.990623	1	0	2025-03-30 18:22:33.417761
92	133	41	<p>Test</p>	2025-05-18 15:34:28.362955	1	0	2025-05-18 15:34:28.362955
35	78	41	this is a comment from me!	2024-11-16 20:28:42.360567	1	0	2025-03-30 18:22:33.417761
7	\N	23	hi	2024-11-06 20:39:19.729122	0	0	2025-03-30 18:22:33.417761
8	\N	40	hi	2024-11-07 10:55:59.514977	0	0	2025-03-30 18:22:33.417761
9	\N	40	hi	2024-11-07 11:06:44.619814	0	0	2025-03-30 18:22:33.417761
10	\N	40	no way	2024-11-07 11:08:12.868975	0	0	2025-03-30 18:22:33.417761
11	\N	40	hi	2024-11-07 11:12:25.926808	0	0	2025-03-30 18:22:33.417761
12	\N	40	hi	2024-11-07 11:18:14.90614	0	0	2025-03-30 18:22:33.417761
13	\N	40	hi	2024-11-07 11:19:18.659241	0	0	2025-03-30 18:22:33.417761
14	\N	40	hey	2024-11-07 11:19:28.353254	0	0	2025-03-30 18:22:33.417761
15	\N	40	hi	2024-11-07 11:21:26.166007	0	0	2025-03-30 18:22:33.417761
16	\N	40	No	2024-11-07 11:24:05.023873	0	0	2025-03-30 18:22:33.417761
17	\N	40	asd	2024-11-07 11:30:06.814895	0	0	2025-03-30 18:22:33.417761
18	\N	40	asd	2024-11-07 11:33:59.22901	0	0	2025-03-30 18:22:33.417761
19	\N	40	Hey	2024-11-07 11:45:15.50545	0	0	2025-03-30 18:22:33.417761
20	\N	40	ughhhh	2024-11-07 11:45:40.538891	0	0	2025-03-30 18:22:33.417761
21	73	40	hi is it working	2024-11-07 11:59:42.369277	0	0	2025-03-30 18:22:33.417761
22	73	40	this is a comment	2024-11-07 12:03:54.842174	0	0	2025-03-30 18:22:33.417761
25	74	40	this is my comment	2024-11-07 15:55:16.112022	0	0	2025-03-30 18:22:33.417761
26	74	40	new comment to check	2024-11-07 16:14:51.441655	0	0	2025-03-30 18:22:33.417761
65	29	42	Wow, Thank you so much. It looks really delicious! 	2024-11-20 02:13:48.647301	1	0	2025-03-30 18:22:33.417761
32	55	26	test123	2024-11-09 10:43:09.491248	0	0	2025-03-30 18:22:33.417761
79	125	41	Test comment	2025-04-27 16:02:38.634765	0	0	2025-04-27 16:02:38.634765
80	126	41	Cool comment	2025-04-27 16:11:25.884271	1	0	2025-04-27 16:11:25.884271
45	73	40	why	2024-11-10 14:22:48.312364	0	0	2025-03-30 18:22:33.417761
81	109	61	<h2><strong>cute cat</strong></h2>	2025-04-29 23:16:03.518862	0	0	2025-04-29 23:14:05.326109
29	75	40	My comments	2024-11-07 18:42:21.851601	1	0	2025-03-30 18:22:33.417761
68	109	42	nice	2024-11-21 08:48:25.504898	0	0	2025-03-30 18:22:33.417761
52	84	40	hello	2024-11-16 15:47:34.830215	1	0	2025-03-30 18:22:33.417761
82	109	61	<p><strong><u>this is a test comment ...</u></strong></p>	2025-04-29 23:17:21.982192	0	0	2025-05-14 01:43:12.262148
87	113	42	<p><strong>test 123</strong></p>	2025-04-29 23:49:21.336644	1	0	2025-05-14 02:19:00.434125
90	131	26	<p>nice</p>	2025-05-17 13:54:46.414801	0	0	2025-05-17 13:54:46.414801
27	22	26	do we want to do the comments also with Quill?\n	2024-11-17 17:23:22.85305	0	0	2025-03-30 18:22:33.417761
59	79	42	Test comment\nEdit works!\nnice	2024-11-16 22:32:29.300668	1	0	2025-03-30 18:22:33.417761
53	81	40	Hi test... ...	2024-11-16 16:14:03.977501	1	0	2025-03-30 18:22:33.417761
40	81	26	Hello, test command	2024-11-10 12:04:47.856319	1	0	2025-03-30 18:22:33.417761
91	121	39	<p>hmmm</p>	2025-05-17 14:59:14.719073	0	0	2025-05-17 14:59:14.719073
34	77	39	hmmm	2024-11-09 17:33:27.367036	0	0	2025-03-30 18:22:33.417761
64	103	26	xyz	2024-11-18 16:23:01.75535	1	0	2025-03-30 18:22:33.417761
\.


--
-- Data for Name: dislikes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dislikes (id, post_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: food_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.food_logs (food_log_id, user_id, food_id, quantity_in_grams, log_time, total_calories, total_proteins, total_fats, total_carbs) FROM stdin;
3	7	2	2	2025-04-28 20:17:51.54	\N	\N	\N	\N
4	7	2	100	2025-04-29 10:17:52.149	\N	\N	\N	\N
5	7	2	100	2025-04-29 10:22:30.001	89	1.1	0.3	22.8
6	7	2	100	2025-04-29 10:23:29.711	89	1.1	0.3	22.8
7	7	2	300	2025-04-29 10:24:47.191	267	3.3000000000000003	0.9	68.4
\.


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.foods (food_id, name, calories, carbs, proteins, fats) FROM stdin;
1	Apple	52	13.8	0.3	0.2
2	Banana	89	22.8	1.1	0.3
3	Chicken Breast	165	0	31	3.6
4	Almonds	575	21.6	21.2	49.4
5	Salmon	208	0	20	13.4
6	Broccoli	34	6.6	2.8	0.4
7	Egg	155	1.1	13	11
8	Milk	42	5	3.4	1
9	Beef	250	0	26	15
10	Yogurt	59	3.6	10	0.4
11	Brown Rice	123	25.6	2.7	0.9
12	Avocado	160	8.5	2	14.7
13	Bread, whole wheat	247	41.4	13	3.4
14	Butter	717	0.1	0.9	81.1
15	Cheddar Cheese	402	1.3	25	33.1
16	Coffee, brewed	1	0	0.1	0
17	Green Tea	0	0	0	0
18	White Rice	130	28.6	2.7	0.3
19	Pasta, cooked	158	30.9	5.8	1.1
20	Corn, sweet yellow	86	19	3.2	1.2
21	Spinach	23	3.6	2.9	0.4
22	Carrot	41	9.6	0.9	0.2
23	Sweet Potato	86	20.1	1.6	0.1
24	Olive Oil	884	0	0	100
25	Walnuts	654	13.7	15.2	65.2
26	Quinoa	120	21.3	4.4	1.9
27	Black Beans	339	63.3	21.6	0.9
28	Garlic	149	33.1	6.4	0.5
29	Onion	40	9.3	1.1	0.1
30	Mushroom	22	3.3	3.1	0.3
31	Tofu	76	1.9	8	4.8
32	Blueberries	57	14.5	0.7	0.3
33	Greek Yogurt	59	3.6	10	0.4
34	Cottage Cheese	98	3.4	11.1	4.3
35	Peanut Butter	588	20	25	50
36	Lentils	116	20.1	9	0.4
37	Pork Chops	231	0	27.3	13.9
38	Cod	82	0	18	0.7
39	Turkey Breast	135	0	30	1.7
40	Sardines	208	0	24.6	11.5
41	Rye Bread	259	48.3	8.5	3.3
42	Ricotta Cheese	174	3	11.3	13
43	Venison	158	0	30.2	3.2
44	Halibut	111	0	20.8	2.3
45	Maple Syrup	261	67.1	0	0.1
46	Flaxseed	534	28.9	18.3	42.2
47	Edamame	121	8.9	11.9	5.2
48	Artichoke	47	10.5	3.3	0.2
49	Cranberries	46	12.2	0.4	0.1
50	Pomegranate	83	18.7	1.7	1.2
51	Goat Cheese	364	0.1	21.6	29.8
52	Seaweed	45	9.6	1.7	0.6
53	Tempeh	193	7.6	20.3	10.8
54	Buckwheat	343	71.5	13.3	3.4
55	Soy Milk	54	6.3	3.3	1.8
56	Chia Seeds	486	42.1	16.5	30.7
57	Pistachios	562	27.5	20.3	45.4
58	Truffle	284	5	7.6	29
59	Kombucha	19	4.7	0	0
60	Matcha Tea	3	0.4	0.1	0
61	Acai Berry	70	4	2	5
62	Kale	49	8.8	4.3	0.9
63	Mustard Greens	27	4.7	2.7	0.2
64	Oysters	68	3.9	7	2.3
65	Parsnips	75	18	1.2	0.3
66	Quail	134	0	21.8	4.5
67	Rabbit	173	0	20.1	10.2
68	Snapper	100	0	20.5	1.5
69	Tahini	595	21	17	53
70	Wasabi	109	23.5	4.8	0.6
71	Yam	118	27.9	1.5	0.2
72	Zucchini	17	3.1	1.2	0.3
73	Black Rice	356	76.2	8.5	3.3
74	Dandelion Greens	45	9.2	2.7	0.7
75	Elderberries	73	18.4	0.7	0.5
76	Fennel Seeds	345	52.3	15.8	14.9
77	Guava	68	14.3	2.6	0.9
78	Jackfruit	95	23.3	1.7	0.6
79	Kohlrabi	27	6.2	1.7	0.1
80	Lotus Root	74	17.2	2.6	0.1
81	Pork	242	0	27.4	14.1
82	Turkey	189	0	29.2	7.7
83	Lamb	294	0	25.6	21
84	Tuna	132	0	28.1	1.9
86	Green Peas	81	14.5	5.4	0.4
88	Cucumber	16	3.6	0.7	0.2
89	Celery	16	2.97	0.69	0.17
90	Cauliflower	25	4.97	1.92	0.28
91	Pumpkin	26	6.5	1	0.1
92	Watermelon	30	7.55	0.61	0.15
93	Raspberries	52	11.94	1.2	0.65
94	Blackberries	43	9.61	1.39	0.49
96	Sunflower Seeds	584	20	20.78	51.46
98	Soy Sauce	53	4.93	8.14	0.57
99	Honey	304	82.4	0.3	0
100	Ginger	80	17.77	1.82	0.75
103	Chicken	239	0	27.3	13.6
104	Potatoes	77	17.5	2	0.1
105	Wheat Flour	364	76	10	1
106	Cabbage	25	5.8	1.3	0.1
107	Sauerkraut	19	4.3	0.9	0.1
108	Apples	52	13.8	0.3	0.2
109	Carrots	41	9.6	0.9	0.2
110	Onions	40	9.3	1.1	0.1
111	Mustard	67	8.5	4.4	3.3
112	Bread	265	49	9	3.2
113	Beer	43	3.6	0.5	0
115	Cheese	402	1.3	25	33.1
116	Pretzels	380	80	10	2
117	Bratwurst	333	2	14	29
118	Pork Sausage	300	2	13	26
119	Eggs	155	1.1	12.6	11
141	Sour Cream	198	4.3	2.1	19.7
142	Rye	335	75.9	9.7	1.6
143	Asparagus	20	3.88	2.2	0.12
144	White Beans	333	60.3	23.4	0.8
145	Black Pepper	251	64	10.4	3.3
147	Sausages	301	2.9	12.3	27.8
148	Dill	43	7	3.5	1.1
149	Apple Cider Vinegar	21	0.9	0	0
151	Pecans	691	13.9	9.2	72
152	Whole Wheat Bread	247	41	13	3.4
153	Barley	354	73.5	12.5	2.3
154	Mustard Seeds	508	28.1	26.1	36.2
155	Beef Liver	135	3.9	20.4	3.6
157	Canola Oil	884	0	0	100
159	Molasses	290	74.7	0	0.1
160	Corned Beef	250	0	18	19
161	Dark Chocolate	546	45.9	5.1	31.3
162	Milk Chocolate	535	59.4	7.6	29.7
163	White Chocolate	539	59.3	5.9	32.1
164	Chocolate Truffle	582	42.3	4.5	41.9
165	Bittersweet Chocolate	512	61.2	4.9	28.8
166	Semisweet Chocolate Chips	480	63.3	3.5	28.2
167	Chocolate Syrup	262	64.7	1.6	0.7
168	Cocoa Powder	228	57.9	19.6	13.7
169	Chocolate Mousse	368	19.6	4.3	32.2
170	Chocolate Fudge	411	76.2	2.2	10.8
171	Chocolate Ice Cream	216	28.2	3.8	11
172	Chocolate Liqueur	350	11	0.3	0
173	Chocolate Cake	367	53	5.3	14.5
174	Chocolate Croissant	406	50.8	8.4	22.1
175	Chocolate Brownie	405	52.3	4.9	24.5
176	Hazelnut Chocolate	546	49	8.2	31
177	Belgian Chocolate	546	49.8	7.6	36.1
178	Dutch Processed Cocoa	200	57	20	14
179	Chocolate Gelato	216	25	4	11
180	Chocolate Mint	350	56	3	10
181	Ritter Sport Milk Chocolate	530	57.5	8.4	31
182	Milka Alpine Milk Chocolate	530	56	6.8	30.2
183	Kinder Schokolade	566	53.5	8.7	35
184	Toblerone Swiss Milk Chocolate	535	60.5	5.6	29.5
185	Lindt Excellence Dark Chocolate	540	46	7	39
186	Ferrero Rocher	603	44.4	8.2	42.7
187	Haribo Gummies (chocolate-covered)	350	77.5	4.5	0.5
188	Zotter Chocolate Bar	580	44.1	7.6	41
189	Halloren Kugeln	486	64.3	5.2	22.4
190	Sarotti Tiamo Fine Marzipan	488	54.1	7.1	28.6
191	Moser Roth Dark Chocolate	580	42.2	7.5	41.2
192	Reber Mozart-Kugeln	470	55.7	6.9	25.1
193	Asbach Uralt Brandy Chocolates	480	50.2	3.8	24.9
194	Lebkuchen (chocolate-covered)	395	76	6	8
195	Niederegger Marzipan	520	48	10	31
196	Viba Nougat Pralines	550	48.9	8.2	34.5
197	Stollwerck Dark Chocolate	512	48	7.9	30.8
198	Schogetten Chocolate Pieces	541	54	6	33
199	Alpia Milk Chocolate	528	56.9	6.2	30.1
200	Espresso	9	1.7	0.6	0.2
201	Cappuccino	74	7.7	3.4	4.1
202	Latte Macchiato	135	13.5	6.5	7
203	Filtered Coffee	2	0	0.3	0
204	Americano	15	3	1	0
205	Flat White	120	11.4	6.6	6.5
206	Cold Brew Coffee	3	0	0.3	0
207	Turkish Coffee	2	0	0.1	0
208	Doppio	10	2	0.6	0.2
209	Espresso Macchiato	13	1.5	0.8	0.8
210	Ristretto	5	1	0.4	0.1
211	Mocha Coffee	180	26	8	7
212	Affogato	200	18	3	10
213	Irish Coffee	130	10	0.1	0
214	Viennese Coffee	180	9	1	15
215	Frappuccino	200	31	3	3
216	Coffee with Cream	50	1	0.5	5
217	Iced Coffee	100	16	3	4
218	Coffee Liqueur	175	11	0	0
219	Nespresso Original	2	0	0.1	0
220	Whole Milk	61	4.8	3.2	3.3
221	Skim Milk	34	5	3.4	0.1
222	Buttermilk	62	4.8	3.3	3.3
223	Heavy Cream	340	2.8	2.1	36
227	Regular Yogurt	61	7.7	5.2	1.7
229	Mozzarella Cheese	280	3.1	28	17
230	Swiss Cheese	380	5	27.6	27.8
231	Gouda Cheese	356	2.2	25	27.4
232	Blue Cheese	353	2.3	21.4	28.7
233	Feta Cheese	264	4.1	14	21
234	Parmesan Cheese	431	4.1	38	29
235	Ice Cream	207	24	3.5	11
237	Margarine	717	0.1	0.2	80.5
238	Kefir	55	4.9	3	2
243	Veal	172	0	24	7
244	Goat Meat	143	0	27	3
246	Chicken Thigh	209	0	25	11
248	Duck	337	0	19	28
249	Goose	305	0	22.8	23.5
252	Bacon	541	1.4	37	42
253	Sausage	301	2.9	12.3	27.8
254	Salami	336	1.6	22.6	26.4
256	Frankfurter	290	1.5	11.3	27.2
257	Ham	145	1.5	20	6.3
258	Meatballs	263	4.3	16.5	19.3
259	Ground Beef	254	0	17.2	20
261	Chicken Liver	119	1.1	16.9	4.8
262	Kidney (Beef)	103	0.3	17.4	3.1
263	Liverwurst	326	2	14.5	28
264	Smoked Turkey	117	1	18.6	4
266	Pastrami	147	0.2	21	6
267	Duck Breast	337	0	27.5	28
268	Goose Liver	410	1.1	14	38
269	Chicken Sausage	172	1.4	14.5	11
272	Sunflower Oil	884	0	0	100
273	Vegetable Oil	884	0	0	100
274	Corn Oil	884	0	0	100
275	Soybean Oil	884	0	0	100
276	Peanut Oil	884	0	0	100
277	Sesame Oil	884	0	0	100
278	Coconut Oil	862	0	0	100
279	Palm Oil	884	0	0	100
280	Avocado Oil	884	0	0	100
281	Flaxseed Oil	884	0	0	100
282	Hemp Seed Oil	884	0	0	100
283	Grapeseed Oil	884	0	0	100
284	Walnut Oil	884	0	0	100
285	Almond Oil	884	0	0	100
286	Pumpkin Seed Oil	884	0	0	100
287	Rice Bran Oil	884	0	0	100
289	Ghee (Clarified Butter)	900	0	0	100
290	All-Purpose Flour	364	76.3	10.3	0.98
291	Whole Wheat Flour	340	72	13.2	2.5
292	Bread Flour	361	72	12	1.5
293	Cake Flour	357	76	8	1
294	Pastry Flour	352	74	9	1.5
295	Self-Rising Flour	354	72	9	1
296	Rye Flour	325	69.8	8.6	2
297	Spelt Flour	338	70	13	2.5
298	Barley Flour	354	73.5	12.5	2.3
299	Oat Flour	404	66.3	14.7	9.1
300	Cornmeal (Maize Flour)	370	73.4	9.2	3.8
301	Corn Flour	361	76.9	6.9	3.9
302	Rice Flour	366	80.1	6	1
303	Brown Rice Flour	363	76.5	7.2	2.8
304	Chickpea Flour (Gram/Besan)	387	57.8	22.4	6.7
305	Lentil Flour	360	60	25	2
306	Almond Flour	571	21.4	21.4	50
307	Coconut Flour	400	60	20	14
308	Buckwheat Flour	335	70.6	12.6	3.1
309	Potato Flour	357	83.1	7	0.3
\.


--
-- Data for Name: glucose_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.glucose_logs (id, user_id, date, "time", glucose_level) FROM stdin;
1	42	2025-04-03	13:45:00	10.00
2	42	2025-04-03	13:50:00	30.00
3	42	2025-04-03	13:56:00	25.00
4	42	2025-04-03	14:05:00	20.00
5	42	2025-04-03	17:10:00	15.00
6	42	2025-04-03	17:14:00	12.00
7	42	2025-04-03	17:29:00	50.00
8	42	2025-04-03	17:55:00	20.00
9	42	2025-04-04	08:49:00	20.00
11	26	2025-04-04	09:04:00	30.00
12	42	2025-04-04	16:15:00	100.00
13	42	2025-04-04	16:17:00	80.00
14	42	2025-04-04	16:23:00	50.00
15	42	2025-04-04	16:42:00	30.00
16	42	2025-04-04	16:57:00	30.00
17	42	2025-04-04	16:58:00	100.00
18	42	2025-04-04	17:06:00	20.00
19	42	2025-04-05	13:33:00	50.00
20	42	2025-04-05	13:53:00	100.00
21	42	2025-04-06	11:14:00	50.00
22	42	2025-04-07	15:06:00	60.00
23	42	2025-04-06	15:06:00	20.00
24	42	2025-04-06	15:07:00	-100.00
25	42	2025-04-06	16:46:00	75.00
26	42	2025-04-06	17:12:00	80.00
27	42	2025-04-06	17:20:00	50.00
28	42	2025-04-08	16:13:00	50.00
29	61	2025-04-13	03:11:00	50.00
30	61	2025-04-13	03:00:00	60.00
34	26	2025-04-13	06:21:00	60.00
35	42	2025-04-15	09:23:00	70.00
36	42	2025-04-14	18:23:00	60.00
32	26	2025-04-12	04:15:00	50.21
31	26	2025-04-12	04:11:00	30.00
38	63	2025-05-03	10:46:00	70.00
39	63	2025-04-29	10:46:00	75.00
40	63	2025-05-02	10:47:00	50.00
41	26	2025-05-04	13:32:00	70.00
42	41	2025-05-11	15:00:00	1.00
44	41	2025-05-08	09:00:00	8.00
45	42	2025-05-14	04:19:00	60.00
47	26	2025-05-18	10:27:00	40.00
48	67	2025-05-02	10:00:00	120.00
49	26	2025-05-18	10:30:00	60.00
50	26	2025-05-18	10:31:00	70.00
46	26	2025-05-16	10:27:00	100.00
51	41	2025-05-18	11:00:00	8.00
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.likes (id, post_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: meal_food_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_food_items (id, meal_id, food_id, quantity_in_grams) FROM stdin;
1	1	2	150
3	11	2	30
4	12	2	45
5	12	1	150
6	12	2	50
7	14	1	150
8	14	2	50
9	15	2	56
10	16	2	4444
11	16	1	150
12	16	2	50
13	17	1	150
14	17	2	50
21	20	12	111
22	20	29	111
23	20	119	111
24	21	35	123
25	21	12	11
26	22	86	150
27	22	104	400
29	24	12	90
30	25	12	50
31	25	13	90
32	25	14	9
33	26	2	3
34	26	12	50
35	26	13	90
36	26	14	9
37	28	24	101
38	29	12	20
39	29	12	50
40	29	13	90
41	29	14	9
42	30	61	50
43	30	12	50
44	30	13	90
45	30	14	9
\.


--
-- Data for Name: meals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meals (meal_id, user_id, meal_type, meal_time, notes, total_calories, total_proteins, total_fats, total_carbs, food_snapshot, recipe_snapshot, recipe_id) FROM stdin;
17	26	breakfast	2025-04-30 15:38:32.481	smoothie	122.5	1	0.44999999999999996	32.1	[{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}]	{"id": 3, "name": "Avocado Toast", "user_id": 7, "created_at": "2025-04-29T08:46:20.632Z", "total_fats": "0.44999999999999996", "updated_at": "2025-04-29T06:46:20.983Z", "ingredients": [{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}], "total_carbs": "32.1", "instructions": ["Cut avocado", "Toast bread", "Spread avocado on toast", "Serve and enjoy"], "total_calories": "122.5", "total_proteins": "1"}	\N
15	39	breakfast	2025-04-30 13:20:04.703	\N	49.84	0.6160000000000001	0.168	12.768	[{"fats": 0.3, "name": "Banana", "carbs": 22.8, "food_id": 2, "calories": 89, "proteins": 1.1, "quantity_in_grams": 56}]	\N	\N
1	7	lunch	2025-04-29 11:54:18.701	Post-gym meal	133.5	1.6500000000000001	0.45	34.2	\N	\N	\N
2	39	breakfast	2025-04-30 11:50:47.179	\N	0	0	0	0	\N	\N	\N
3	39	breakfast	2025-04-30 11:53:55.62	\N	0	0	0	0	\N	\N	\N
4	39	dinner	2025-04-30 11:54:19.241	gym	0	0	0	0	\N	\N	\N
5	39	breakfast	2025-04-30 12:12:15.847	ji	0	0	0	0	\N	\N	\N
6	39	breakfast	2025-04-30 12:21:20.616	\N	0	0	0	0	\N	\N	\N
7	39	breakfast	2025-04-30 12:22:06.159	\N	0	0	0	0	\N	\N	\N
8	39	breakfast	2025-04-30 12:23:08.592	\N	0	0	0	0	\N	\N	\N
9	39	lunch	2025-04-30 12:24:02.182	\N	0	0	0	0	\N	\N	\N
10	39	dinner	2025-04-30 12:33:22.046	hhhh	0	0	0	0	\N	\N	\N
11	39	dinner	2025-04-30 12:36:01.315	hhjhjjh	26.7	0.33	0.09	6.84	\N	\N	\N
13	39	breakfast	2025-04-30 13:18:56.501	\N	0	0	0	0	[]	\N	\N
16	39	breakfast	2025-04-30 13:52:17.562	ggggg	4077.66	49.88400000000001	13.782000000000002	1045.332	[{"fats": 0.3, "name": "Banana", "carbs": 22.8, "food_id": 2, "calories": 89, "proteins": 1.1, "quantity_in_grams": 4444}, {"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}]	{"id": 3, "name": "Avocado Toast", "user_id": 7, "created_at": "2025-04-29T08:46:20.632Z", "total_fats": "0.44999999999999996", "updated_at": "2025-04-29T06:46:20.983Z", "ingredients": [{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}], "total_carbs": "32.1", "instructions": ["Cut avocado", "Toast bread", "Spread avocado on toast", "Serve and enjoy"], "total_calories": "122.5", "total_proteins": "1"}	\N
14	39	lunch	2025-04-30 13:19:27.416	fghfhfhf	122.5	1	0.44999999999999996	32.1	[{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}]	{"id": 3, "name": "Avocado Toast", "user_id": 7, "created_at": "2025-04-29T08:46:20.632Z", "total_fats": "0.44999999999999996", "updated_at": "2025-04-29T06:46:20.983Z", "ingredients": [{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}], "total_carbs": "32.1", "instructions": ["Cut avocado", "Toast bread", "Spread avocado on toast", "Serve and enjoy"], "total_calories": "122.5", "total_proteins": "1"}	\N
20	39	breakfast	2025-05-02 17:39:52.133	notes	394.05000000000007	17.427	28.638	20.979000000000003	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "quantity_in_grams": 111}, {"fats": 0.1, "name": "Onion", "carbs": 9.3, "food_id": 29, "calories": 40, "proteins": 1.1, "quantity_in_grams": 111}, {"fats": 11, "name": "Eggs", "carbs": 1.1, "food_id": 119, "calories": 155, "proteins": 12.6, "food_name": "Eggs", "quantity_in_grams": 111}]	{"id": 6, "name": "new recipe", "user_id": 39, "created_at": "2025-05-02T16:44:01.664Z", "total_fats": "12.21", "updated_at": "2025-05-02T14:44:01.872Z", "ingredients": [{"fats": 11, "name": "Eggs", "carbs": 1.1, "food_id": 119, "calories": 155, "proteins": 12.6, "food_name": "Eggs", "quantity_in_grams": 111}], "total_carbs": "1.221", "instructions": ["cook", "eat", "sleep"], "total_calories": "172.05", "total_proteins": "13.986"}	6
12	39	lunch	2025-04-30 13:18:07.951	hhhg	162.55	1.495	0.585	42.36	[{"fats": 0.3, "name": "Banana", "carbs": 22.8, "food_id": 2, "calories": 89, "proteins": 1.1, "quantity_in_grams": 45}, {"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}]	{"id": 3, "name": "Avocado Toast", "user_id": 7, "created_at": "2025-04-29T08:46:20.632Z", "total_fats": "0.44999999999999996", "updated_at": "2025-04-29T06:46:20.983Z", "ingredients": [{"food_id": 1, "food_name": "Apple", "quantity_in_grams": 150}, {"food_id": 2, "food_name": "Banana", "quantity_in_grams": 50}], "total_carbs": "32.1", "instructions": ["Cut avocado", "Toast bread", "Spread avocado on toast", "Serve and enjoy"], "total_calories": "122.5", "total_proteins": "1"}	\N
21	39	breakfast	2025-05-02 22:52:03.858	asdfgh	740.84	30.97	63.117	25.535	[{"fats": 50, "name": "Peanut Butter", "carbs": 20, "food_id": 35, "calories": 588, "proteins": 25, "quantity_in_grams": 123}, {"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 11}]	{"id": 7, "name": "man", "user_id": 39, "created_at": "2025-05-02T17:25:35.078Z", "total_fats": "1.617", "updated_at": "2025-05-02T15:25:35.493Z", "ingredients": [{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 11}], "total_carbs": "0.935", "instructions": ["cook"], "total_calories": "17.6", "total_proteins": "0.22"}	7
22	26	lunch	2025-05-04 11:32:13.371	\N	429.5	16.1	1	91.75	[{"fats": 0.4, "name": "Green Peas", "carbs": 14.5, "food_id": 86, "calories": 81, "proteins": 5.4, "quantity_in_grams": 150}, {"fats": 0.1, "name": "Potatoes", "carbs": 17.5, "food_id": 104, "calories": 77, "proteins": 2, "quantity_in_grams": 400}]	\N	\N
24	41	lunch	2025-05-11 18:56:53.315	Tasty	144	1.8	13.229999999999999	7.65	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "quantity_in_grams": 90}]	\N	\N
25	41	dinner	2025-05-11 18:59:07.295	Tasty	366.83000000000004	12.781	17.709	41.519	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}]	{"id": 9, "name": "Avocado Toast", "user_id": 41, "created_at": "2025-05-11T18:58:45.179Z", "total_fats": "17.709", "updated_at": "2025-05-11T16:58:45.838Z", "ingredients": [{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}], "total_carbs": "41.519", "instructions": ["Toast bread", "Make avocado small", "put butter on toast", "put avocado on toast"], "total_calories": "366.83000000000004", "total_proteins": "12.781"}	9
26	39	breakfast	2025-05-17 16:18:38.156	\N	369.5	12.814	17.718	42.202999999999996	[{"fats": 0.3, "name": "Banana", "carbs": 22.8, "food_id": 2, "calories": 89, "proteins": 1.1, "quantity_in_grams": 3}, {"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}]	{"id": 9, "name": "Avocado Toast", "user_id": 41, "created_at": "2025-05-11T20:58:45.179Z", "total_fats": "17.709", "updated_at": "2025-05-11T18:58:45.838Z", "ingredients": [{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}], "total_carbs": "41.519", "instructions": ["Toast bread", "Make avocado small", "put butter on toast", "put avocado on toast"], "total_calories": "366.83000000000004", "total_proteins": "12.781"}	9
27	67	dinner	2025-05-17 17:06:34.43	Salad with chicken	0	0	0	0	[]	\N	\N
28	26	breakfast	2025-05-18 08:33:32.793	\N	892.84	0	101	0	[{"fats": 100, "name": "Olive Oil", "carbs": 0, "food_id": 24, "calories": 884, "proteins": 0, "food_name": "Olive Oil", "quantity_in_grams": 101}]	{"id": 11, "name": "something", "user_id": 26, "created_at": "2025-05-18T08:33:06.414Z", "total_fats": "101", "updated_at": "2025-05-18T06:33:01.006Z", "ingredients": [{"fats": 100, "name": "Olive Oil", "carbs": 0, "food_id": 24, "calories": 884, "proteins": 0, "food_name": "Olive Oil", "quantity_in_grams": 101}], "total_carbs": "0", "instructions": ["something"], "total_calories": "892.84", "total_proteins": "0"}	11
29	41	breakfast	2025-05-18 18:00:10.554	My Breakfast	398.83000000000004	13.181000000000001	20.649	43.219	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "quantity_in_grams": 20}, {"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}]	{"id": 9, "name": "Avocado Toast", "user_id": 41, "created_at": "2025-05-11T18:58:45.179Z", "total_fats": "17.709", "updated_at": "2025-05-11T16:58:45.838Z", "ingredients": [{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}], "total_carbs": "41.519", "instructions": ["Toast bread", "Make avocado small", "put butter on toast", "put avocado on toast"], "total_calories": "366.83000000000004", "total_proteins": "12.781"}	9
30	41	lunch	2025-05-18 18:23:47.323	Lunch	401.83000000000004	13.781	20.209	43.519	[{"fats": 5, "name": "Acai Berry", "carbs": 4, "food_id": 61, "calories": 70, "proteins": 2, "quantity_in_grams": 50}, {"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}]	{"id": 9, "name": "Avocado Toast", "user_id": 41, "created_at": "2025-05-11T18:58:45.179Z", "total_fats": "17.709", "updated_at": "2025-05-11T16:58:45.838Z", "ingredients": [{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "food_name": "Avocado", "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "food_name": "Bread, whole wheat", "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "food_name": "Butter", "quantity_in_grams": 9}], "total_carbs": "41.519", "instructions": ["Toast bread", "Make avocado small", "put butter on toast", "put avocado on toast"], "total_calories": "366.83000000000004", "total_proteins": "12.781"}	9
\.


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.post_tags (id, post_id, tag_id) FROM stdin;
10	78	4
11	78	5
12	78	6
48	126	2
49	126	1
50	126	3
51	126	6
52	126	7
53	126	8
54	126	9
55	126	10
56	126	11
57	126	12
58	126	13
59	126	14
60	126	15
61	126	16
62	126	17
67	103	20
77	127	3
78	127	6
79	127	19
80	127	1
81	127	23
82	130	24
83	130	1
84	130	21
85	130	22
86	130	25
87	130	26
88	125	1
89	125	3
90	125	2
91	132	2
92	132	4
93	132	27
94	134	2
95	134	1
96	134	23
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, user_id, title, content, created_at, updated_at, category_id, post_picture, likes) FROM stdin;
61	29	title is again	<p>cute</p>	2024-11-06 20:54:03.375446	2024-11-06 20:54:03.375446	\N	\N	\N
77	39	long	<p>Alright, listen up. You've got <em>three weeks</em> left—just 21 days—and every single one of them counts. Right now, you’re probably way behind, trying to keep up, but guess what? No one's coming to bail you out. Those exams don’t care if you’re tired, unmotivated, or distracted. You either put in the work <em>now</em>, or you’ll be staring at that failed grade wondering why you didn’t just pull it together when you had the chance.</p><p>Every hour you waste scrolling, every time you "take a break," you're letting that success slip further away. This is your future on the line, not just another assignment. Three weeks to push yourself harder than you ever have. Either grind now, put everything else on hold, and actually walk out of these exams proud of what you achieved, or keep slacking and live with the regrets.</p>	2024-11-07 19:37:55.05964	2024-11-07 19:37:55.05964	\N	\N	{39}
71	29	creating	<p>post</p>	2024-11-06 21:25:03.538151	2024-11-06 21:25:03.538151	\N	\N	\N
62	29	new post test	<p>design thinking content</p>	2024-11-06 20:58:13.585681	2024-11-06 20:58:13.585681	\N	1730926692696.PNG	\N
63	29	posting 	<p>this is test</p>	2024-11-06 21:00:18.106136	2024-11-06 21:00:18.106136	\N	1730926817176.PNG	\N
64	29	creating 	<p>again</p>	2024-11-06 21:01:46.646382	2024-11-06 21:01:46.646382	\N	\N	\N
65	29	test20	<p>testing path</p>	2024-11-06 21:04:00.607804	2024-11-06 21:04:00.607804	\N	\N	\N
66	29	new	<p>posting</p>	2024-11-06 21:06:08.825023	2024-11-06 21:06:08.825023	\N	\N	\N
81	26	test 123	<p>hallo</p><p>hallo</p><p>hallo</p><p>hallo</p><p>hallo</p><p><br></p>	2024-11-10 10:31:20.043412	2024-11-10 10:31:20.043412	\N	1731234679214.png	{42,26}
19	26	hello w.	<p>this is a test</p><p>is it working now?</p><p>??</p><p>...</p>	2024-11-03 13:08:28.781983	2024-11-09 00:44:36.082207	\N	1731860250777-placeholder.png	{26}
121	61	This is my first Post	<h1>Hi, im <strong>Bear</strong> and im so nervous.</h1><p>This is my first post ever.</p><p>Here you can see my home. </p><p>Thank you for reading</p><p>CU</p>	2025-04-13 01:08:45.673703	2025-04-13 01:08:45.673703	\N	1744506525950-iceland-2111810_1280.jpg	{61,42,63,26,39}
78	41	This is a test 123	<p>This is my content my blog post :)</p><p><br></p><p>:))</p>	2024-11-09 16:07:14.939457	2025-04-27 16:06:59.757154	\N	1743973081127-thumb-1920-540880 copy.jpg	{41}
67	29	again	<p>test</p>	2024-11-06 21:12:46.020482	2024-11-06 21:12:46.020482	\N	\N	\N
37	23	test	<p>test</p>	2024-11-05 18:06:36.858234	2024-11-05 18:06:36.858234	\N	\N	\N
127	41	Final Tag Test	<p>cool tags yay</p>	2025-04-27 17:53:11.292325	2025-05-11 19:00:29.945087	\N	\N	{41}
68	29	smh	<p>asmh</p>	2024-11-06 21:14:12.030899	2024-11-06 21:14:12.030899	\N	\N	\N
69	29	ho	<p>go</p>	2024-11-06 21:19:10.188498	2024-11-06 21:19:10.188498	\N	\N	\N
70	29	testing	<p>the link again</p>	2024-11-06 21:19:46.077133	2024-11-06 21:19:46.077133	\N	\N	\N
50	26	Test Edit Picture	<p>In this post, I want to test the feature: Edit Picture.</p><p>Before, here was a grey picture.</p><p>After editing it I should see a jellyfish.</p><p>Let's see...</p>	2024-11-06 14:31:28.608348	2024-11-09 23:41:14.708075	\N	1731847929175-Free-download-Jellyfish-Wallpaper-HD.jpg	{26,42}
57	29	new post	<p>Hello HobbyDevs Team, Your choice of tech stack seems solid, and I wish you the best of luck with your project! As far as I know, the chosen stack can be challenging to manage as the project grows in complexity. I’d recommend documenting everything carefully, including your structure and where each component is used. Right now, our projects may not be that complex, so you won’t encounter many issues, but having solid documentation will be invaluable later on. I also have a couple of tips: We’re using&nbsp;Vitest&nbsp;for unit testing in our Vue.js setup, and it’s been fantastic for isolating component functionality and running fast, efficient tests. Vitest focuses on unit and component testing, making it super quick and easy to integrate with Vue. Since Vitest doesn’t cover end-to-end (e2e) testing, we’re combining it with&nbsp;Selenium&nbsp;for our e2e requirements, which is part of our task. This setup allows us to catch issues at multiple levels, covering both isolated component tests and full end-to-end scenarios. To streamline our workflow, we’re also using&nbsp;concurrently&nbsp;to run both the Laravel and Vue.js servers together with a single command. This small addition has made our development process much more efficient and more good</p>	2024-11-06 18:59:07.450175	2024-11-06 18:59:07.450175	\N	1730919546075.webp	\N
72	19	I am testing	<p>Tesing comments</p>	2024-11-06 22:30:36.449801	2024-11-06 22:30:36.449801	\N	\N	\N
58	23	This is a new blog	<p>I am trying out this blog but I want to see where it gets posted</p>	2024-11-06 20:10:36.228869	2024-11-06 20:10:36.228869	\N	\N	\N
60	29	Title	<p>rabbits are cute</p>	2024-11-06 20:47:48.836339	2024-11-06 20:47:48.836339	\N	1730926067962.jpeg	\N
73	40	Hi	<p>Hi</p>	2024-11-07 08:25:27.519095	2024-11-07 08:25:27.519095	\N	\N	\N
55	26	Hello world	<p>This is a test post.</p><p>I want to test it.</p>	2024-11-06 18:36:37.173536	2024-11-09 23:40:10.665241	\N	1744503149553-snail-1612895_1280.jpg	{}
74	40	tryim	<p>lkrj;hlwregb;fregbgtuk</p>	2024-11-07 15:55:05.025217	2024-11-07 15:55:05.025217	\N	1732099104152-Login post draw.io.png	\N
80	26	Css Styling test	<p><span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?""Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?""Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?""Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?""Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?""Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</span></p>	2024-11-10 09:50:25.043011	2024-11-10 09:50:25.043011	\N	1731232224185.jpg	\N
79	26	This is a test	<h3><strong style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</strong></h3>	2024-11-10 09:49:30.826985	2024-11-10 09:49:30.826985	\N	1731232169980.jpg	{42}
130	41	SonarCube Test	<p>Hello</p>	2025-05-11 19:03:12.962761	2025-05-11 19:03:12.962761	\N	1746990192474-cat-icon-symbol-isolated-illustration-vector.jpg	\N
131	42	Testing with Deployed Website	<p>Hello, and Thank you! Bye</p>	2025-05-14 02:22:40.044787	2025-05-14 02:22:40.044787	\N	1747189359912-Lieselotte5_Innentitel-3270089328.jpg	{26}
22	26	This is a test	<p>does is work?</p><p><br></p><h2><strong><em><u>Yep it DOES</u></em></strong></h2>	2024-11-03 14:53:35.618292	2024-11-09 02:57:01.573651	\N	1731864188502-Lorem-Ipsum-alternatives-2885578578.png	{26}
83	26	Exploring the Wonders of the Northern Lights	<p>The Northern Lights, also known as the Aurora Borealis, are a breathtaking natural phenomenon that light up the polar skies with vibrant colors. This incredible display occurs when charged particles from the sun collide with Earth's atmosphere, resulting in shimmering waves of green, pink, purple, and blue.</p><p>For centuries, people have marveled at the beauty of the auroras. The experience of witnessing the lights in person is described by many as otherworldly and deeply moving. Popular destinations to observe the Northern Lights include Norway, Iceland, Finland, and parts of Canada.</p><p>Planning a trip to see the auroras involves careful timing, as the lights are best viewed in winter months and on clear, dark nights far from city lights. The Northern Lights are truly a reminder of the incredible beauty our planet holds.</p>	2024-11-10 12:02:34.315399	2024-11-10 12:02:34.315399	\N	1731847112528-Northern-Lights-Wallpaper-creating-a-magical-scene-over-a-winter-forest-1.jpg	{41,26,42}
84	40	hi	<p>hi</p>	2024-11-16 00:52:25.945844	2024-11-16 00:52:25.945844	\N	\N	{41}
90	42	What A Day	<p><span style="background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);">Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues. Li nov lingua franca va esser plu simplic e regulari quam li existent Europan lingues. It va esser tam simplic quam Occidental in fact, it va esser Occidental. A un Angleso it va semblar un simplificat Angles, quam un skeptic Cambridge amico dit me que Occidental es.Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.</span></p>	2024-11-17 10:14:59.660577	2024-11-17 10:14:59.660577	\N	1743585672690-Backgrounds-Download-Grey-Wallpaper-HD.png	{41,26,42}
112	39	hmm	<p>gmgfmdjge</p>	2024-11-18 12:51:17.287239	2024-11-18 12:51:17.287239	\N	\N	{}
110	39	smh	<h2>Select an authentication source</h2><p>The selected authentication source will be used to authenticate you and and to create a valid session.</p><ul><li><br></li><li><br></li><li>Mitarbeiter/-innen verwenden bitte auf der folgenden Seite die Zugangsdaten für das DHBW-Portal.</li><li><br></li><li><br></li><li>Studierende nutzen für die Anmeldung die Zugangsdaten für den DUALIS-Webclient.</li><li>Alle anderen nutzen bitte die ihnen bekannten Anmeldedaten ihrer Studienakademie.</li></ul><p><br></p>	2024-11-18 12:39:03.709403	2024-11-18 12:39:03.709403	\N	1731933542210-output.png	{39}
132	67	Why keeping an eye on glucose 	<p>Alright, let's talk about why keeping an eye on glucose levels during pregnancy is so important.</p><p>Pregnancy is such a transformative time, bringing incredible changes to a woman's body. One of the less talked-about but absolutely crucial aspects of a healthy pregnancy is managing blood sugar levels, or glucose.</p><p>Think of glucose as the fuel that powers both you and your growing baby. Normally, your body does a fantastic job of regulating this fuel. However, pregnancy hormones can sometimes interfere with how your body uses insulin, the key that unlocks your cells to let glucose in. This can lead to a condition called gestational diabetes (GD), which develops during pregnancy and usually disappears after birth.</p><p>Now, you might be thinking, "So what if my blood sugar is a little high?" Well, uncontrolled high blood sugar during pregnancy can pose risks for both you and your baby. For the baby, it can lead to excessive growth (macrosomia), making delivery more complicated and potentially increasing the risk of birth injuries. There's also a higher chance of preterm birth, breathing difficulties at birth, and even an increased risk of developing type 2 diabetes later in life. For you, gestational diabetes increases your risk of developing preeclampsia (high blood pressure during pregnancy) and also raises your likelihood of developing type 2 diabetes down the road.</p><p>That's where glucose tracking comes in! Regular monitoring, often done with a simple finger-prick test at home, provides valuable insights into how your body is processing glucose. This information empowers your healthcare team to make informed decisions about your care. If your levels are consistently high, they can recommend lifestyle changes like dietary adjustments and exercise, or in some cases, prescribe medication like insulin to help keep things in balance.</p><p>Early detection and management of gestational diabetes through glucose tracking can significantly reduce these risks, leading to healthier outcomes for both you and your precious little one. It's all about being proactive and working closely with your healthcare providers to ensure a safe and healthy pregnancy journey. So, if your doctor recommends glucose monitoring, know that it's a powerful tool in ensuring the well-being of you and your baby.</p><p><br></p>	2025-05-17 18:31:49.916139	2025-05-17 18:31:49.916139	\N	1747506709542-diabetesmagazijn-nl-7pomsk3sj6w-unsplash.jpg	{}
111	39	another smh	<p><span style="background-color: rgb(255, 255, 255); color: rgb(113, 119, 125);">ChatGPT helps you get answers, find inspiration and be more productive. It is free to use and easy to try. Just ask and ChatGPT can help with writing, learning, brainstorming and more.</span></p>	2024-11-18 12:39:41.528043	2024-11-18 12:39:41.528043	\N	1731933581020-dbD.png	{40}
109	39	1234	<p>new</p>	2024-11-18 11:35:47.011834	2024-11-18 11:35:47.011834	\N	1731929746664-cat-7667234_1280.webp	{}
29	26	Quinoa, Avocado & Chickpea Salad over Mixed Greens	<p>Hungry but you dont know, what to eat? Im here for you!</p><h2>Lets have <strong>Quinoa, Avocado &amp; Chickpea Salad over Mixed Greens</strong></h2><p><br></p><p><strong>Prep Time:</strong></p><p>20 mins</p><p><strong>Total Time:</strong></p><p>25 mins</p><p><strong>Servings:</strong></p><p>2</p><p><br></p><h2><strong>Ingredients</strong></h2><p><br></p><ul><li class="ql-indent-1">⅔&nbsp;cup&nbsp;water</li><li class="ql-indent-1">⅓&nbsp;cup&nbsp;quinoa</li><li class="ql-indent-1">¼&nbsp;teaspoon&nbsp;kosher salt or other coarse salt</li><li class="ql-indent-1">1&nbsp;clove&nbsp;garlic, crushed and peeled</li><li class="ql-indent-1">2&nbsp;teaspoons&nbsp;grated lemon zest</li><li class="ql-indent-1">3&nbsp;tablespoons&nbsp;lemon juice</li><li class="ql-indent-1">3&nbsp;tablespoons&nbsp;olive oil</li><li class="ql-indent-1">¼&nbsp;teaspoon&nbsp;ground pepper</li><li class="ql-indent-1">1&nbsp;cup&nbsp;rinsed no-salt-added canned chickpeas</li><li class="ql-indent-1">1&nbsp;medium&nbsp;carrot, shredded (1/2 cup)</li><li class="ql-indent-1">½&nbsp;avocado, diced</li><li class="ql-indent-1">1&nbsp;(5 ounce) package&nbsp;prewashed mixed greens, such as spring mix or baby kale-spinach blend (8 cups packed)</li></ul><h3><br></h3><h2><strong>Directions</strong></h2><ol><li>Bring water to a boil in a small saucepan. Stir in quinoa. Reduce heat to low, cover, and simmer until all the liquid is absorbed, about 15 minutes. Use a fork to fluff and separate the grains; let cool for 5 minutes.</li><li>Meanwhile, sprinkle salt over garlic on a cutting board. Mash the garlic with the side of a spoon until a paste forms. Scrape into a medium bowl. Whisk in lemon zest, lemon juice, oil, and pepper. Transfer 3 Tbsp. of the dressing to a small bowl and set aside.</li><li>Add chickpeas, carrot, and avocado to the bowl with the remaining dressing; gently toss to combine. Let stand for 5 minutes to allow flavors to blend. Add the quinoa and gently toss to coat.</li><li>Place greens in a large bowl and toss with the reserved 3 Tbsp. dressing. Divide the greens between 2 plates and top with the quinoa mixture.</li></ol><p><br></p><p>This is my go to food and it never disapoints me.</p><p><br></p><h2><strong>Nutrition Facts&nbsp;(per serving)</strong></h2><p><strong>501</strong></p><p>Calories</p><p><strong>32g</strong></p><p>Fat</p><p><strong>47g</strong></p><p>Carbs</p><p><strong>12g</strong></p><p>Protein</p>	2024-11-04 20:38:45.568064	2024-11-04 20:38:45.568064	\N	1731848453550-Cute-Avocado-Wallpaper-Free-Download.jpg	{42}
75	40	Wee 8 update.	<h3>1.&nbsp;<strong>Frontend: React</strong></h3><ul><li><strong>React</strong>&nbsp;is a popular JavaScript library. It’s component-based, meaning that our UI is split into independent, reusable pieces, which can be thought of as “components.”</li><li>We are using&nbsp;<strong>React Hooks</strong>&nbsp;(<code>useState</code>,&nbsp;<code>useEffect</code>) to manage state and side effects (like fetching data).</li><li>React allows us to create dynamic, interactive UIs, and our use of the&nbsp;<code>useNavigate</code>&nbsp;and&nbsp;<code>useParams</code>&nbsp;hooks helps manage routing and navigation within the app.</li><li>In our case,&nbsp;<strong>React Router</strong>&nbsp;is used for routing (to navigate between different components or views), and&nbsp;<strong>Axios</strong>&nbsp;is being used to make HTTP requests to the backend API (such as fetching posts, creating or deleting posts).</li></ul>	2024-11-07 18:42:15.273762	2024-11-07 18:42:15.273762	\N	1731004934775.jpeg	{}
118	41	Edited by Admin1 + TestUser	<p>Cool :)</p><p>Test works.</p>	2025-04-06 19:38:12.741329	2025-04-15 08:56:09.608904	\N	1744707367511-coyote-1730060_1280.jpg	\N
125	41	Test tags	<p>My cool tags</p>	2025-04-27 16:01:54.367327	2025-05-14 02:21:20.770129	\N	\N	\N
133	66	Test with deployed version	<p>This is a Test again. </p>	2025-05-18 14:27:35.677237	2025-05-18 14:27:35.677237	\N	1747578455473-iceland-2111810_1280.jpg	{41}
113	42	Test Blog Post	<p>I write something to test</p>	2024-11-21 08:47:48.308067	2024-11-21 08:47:48.308067	\N	1744043555760-Backgrounds-Download-Grey-Wallpaper-HD.png	{}
126	41	Test Tags	<p>Cool Tags</p>	2025-04-27 16:06:37.270079	2025-04-27 17:52:44.226908	\N	1745769996911-thumb-1920-540880 copy.jpg	\N
103	26	Yellowstone	<p>Yellowstone National Park, located in Idaho, Montana, and Wyoming, was established as the first national park in the United States. The park is a popular destination for visitors who enjoy ecological tourism as it offers forests, mountains, and abundant ecosystems to explore. Some of Yellowstone’s most well-known landmarks are its geothermal hot springs and geysers, the most famous of which is named Old Faithful.</p><p>Last fall, Lisa and her friends decided to take a camping trip to Yellowstone National Park. They arranged to stay at one of the park’s many convenient campsites. For their camping trip, they brought their backpacks, sleeping bags, and a cooler of food and drinks. They pitched their tents immediately upon arriving to their campsite.</p><p>During their trip, Lisa and her friends hiked the many trails of the park, exploring its natural surroundings. In the forest, they saw a lot of local wildlife. Lisa was surprised to see a family of grizzly bears, some gray wolves, and even bald eagles flying overhead. Outside of the woods, they admired the beauty of some of Yellowstone’s natural cascades.</p><p>Since Yellowstone contains many hot springs and the world’s largest area of active geysers, Lisa and her friends visited many different geyser sites. They even spent an afternoon swimming in Yellowstone’s Boiling River. Of all of the sites, Lisa and her friends agreed that Old Faithful was the most impressive. Lisa and her friends waited patiently for the geyser to erupt. After about 40 minutes, a stream of boiling water over 100 feet tall sprayed from the ground and up into the air. Fortunately, no one got wet!</p>	2024-11-17 20:56:58.435085	2025-04-29 15:32:38.498035	\N	1732067565213-Yellowstone-1452599710.jpg	{26,42}
134	41	Testpost	<h1>HEy</h1><p><strong>:)</strong></p><p><em>Test</em></p>	2025-05-18 19:04:27.256362	2025-05-18 19:04:27.256362	\N	1747595066965-il_794xN.5113899271_1ncb.webp	\N
\.


--
-- Data for Name: recipe_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_logs (id, recipe_id, user_id, action, "timestamp", total_calories, total_proteins, total_fats, total_carbs) FROM stdin;
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, user_id, name, ingredients, instructions, created_at, updated_at, total_calories, total_proteins, total_fats, total_carbs) FROM stdin;
4	39	man	[{"fats": 100, "name": "Avocado Oil", "carbs": 0, "food_id": 280, "calories": 884, "proteins": 0, "quantity_in_grams": 111}]	["cook", ""]	2025-05-02 18:38:41.888	2025-05-02 16:38:42.055487	981.24	0	111	0
5	39	again	[{"fats": 11, "name": "Eggs", "carbs": 1.1, "food_id": 119, "calories": 155, "proteins": 12.6, "quantity_in_grams": 12}]	["cook again"]	2025-05-02 18:41:39.073	2025-05-02 16:41:39.239508	18.6	1.512	1.32	0.132
6	39	new recipe	[{"fats": 11, "name": "Eggs", "carbs": 1.1, "food_id": 119, "calories": 155, "proteins": 12.6, "quantity_in_grams": 111}]	["cook", "eat", "sleep"]	2025-05-02 18:44:01.664	2025-05-02 16:44:01.872055	172.05	13.986	12.21	1.221
7	39	man	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "quantity_in_grams": 11}]	["cook"]	2025-05-02 19:25:35.078	2025-05-02 17:25:35.493195	17.6	0.22	1.617	0.935
8	39	new recipe	[{"fats": 100, "name": "Avocado Oil", "carbs": 0, "food_id": 280, "calories": 884, "proteins": 0, "quantity_in_grams": 123}]	["cook"]	2025-05-03 00:49:08.86	2025-05-02 22:49:09.085718	1087.32	0	123	0
9	41	Avocado Toast	[{"fats": 14.7, "name": "Avocado", "carbs": 8.5, "food_id": 12, "calories": 160, "proteins": 2, "quantity_in_grams": 50}, {"fats": 3.4, "name": "Bread, whole wheat", "carbs": 41.4, "food_id": 13, "calories": 247, "proteins": 13, "quantity_in_grams": 90}, {"fats": 81.1, "name": "Butter", "carbs": 0.1, "food_id": 14, "calories": 717, "proteins": 0.9, "quantity_in_grams": 9}]	["Toast bread", "Make avocado small", "put butter on toast", "put avocado on toast"]	2025-05-11 20:58:45.179	2025-05-11 18:58:45.838325	366.83000000000004	12.781	17.709	41.519
10	39	new recipe live	[{"fats": 0.1, "name": "Lotus Root", "carbs": 17.2, "food_id": 80, "calories": 74, "proteins": 2.6, "quantity_in_grams": 100}, {"fats": 0.2, "name": "Carrot", "carbs": 9.6, "food_id": 22, "calories": 41, "proteins": 0.9, "quantity_in_grams": 13}]	["nice and cook"]	2025-05-17 14:58:03.197	2025-05-17 14:58:03.339234	79.33	2.717	0.126	18.448
11	26	something	[{"fats": 100, "name": "Olive Oil", "carbs": 0, "food_id": 24, "calories": 884, "proteins": 0, "quantity_in_grams": 101}]	["something"]	2025-05-18 10:33:06.414	2025-05-18 08:33:01.006451	892.84	0	101	0
12	41	Eggs and Bacon	[{"fats": 11, "name": "Eggs", "carbs": 1.1, "food_id": 119, "calories": 155, "proteins": 12.6, "quantity_in_grams": 120}, {"fats": 42, "name": "Bacon", "carbs": 1.4, "food_id": 252, "calories": 541, "proteins": 37, "quantity_in_grams": 60}]	["Fry Bacon", "Add Eggs", "Enjoy"]	2025-05-18 20:25:06.875	2025-05-18 18:25:07.202472	510.6	37.32	38.4	2.16
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tags (id, name) FROM stdin;
1	test
2	pregnancy
3	tags
4	health
5	diet
6	cool
7	thats
8	a
9	lot
10	of
11	very
12	different
13	tagies
14	I
15	have
16	got
17	here
18	apple
19	final
20	nature
21	this
22	is
23	avocado
24	sonar
25	my
26	blog
27	glucose
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password_hash, created_at, profile_bio, profile_picture, terms_accepted, password_reset_token, password_reset_expires, is_admin) FROM stdin;
7	imran	imran.salam.24@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$lqUexhCnwf/SLQ5EEq8Smg$nrzFmPp9j0RlGvTX3P7WfwtupjnTzaRjlqcD/F+++xc	2024-10-28 17:13:24.022793	\N	\N	t	\N	\N	f
9	HASDASDA	ASDFASD@ASD.COM	$argon2id$v=19$m=65536,t=3,p=4$hSCnmDHBfb3Ep4hUqmYBrQ$n9hKxarkLyrl+yzZfkqwOWSIJWeg4WkbR4yVKyJKR0I	2024-10-28 17:49:49.548462	\N	\N	t	\N	\N	f
12	imran2222222	imran@imran.com	$argon2id$v=19$m=65536,t=3,p=4$hcIQQg4YuI7/c1TQjjHTFw$SrbtSg8CoSbZdbFXr2Ibny2WWNAHi3qq0dG6QXQeHGU	2024-10-28 17:51:51.537454	\N	\N	t	\N	\N	f
18	newUser	new@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$SdOmA8T4pQEneeQdFb2wHA$ZVTTXMGtCjKYI6bikIRHpt2GaPw4xvf2gF4qVwgG3oU	2024-10-30 23:23:16.893125	\N	\N	t	\N	\N	f
19	test	test@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$sQj/qQYgfCFNX9vyg7ZQcA$rHofXBFyB+HI8ZvEKsXwjerUyF9hmi/hpk6KnAgN4H0	2024-10-31 02:03:15.729972	\N	\N	t	\N	\N	f
35	testuser	test@example.com	$argon2id$v=19$m=65536,t=3,p=4$Q3rP3aP+jLkcQDMvNWBkfA$CRFylQJOfY1nh/WgXNcxKQMbSQxDuLB4CxI7mUgmv4E	2024-11-06 16:37:21.536407	\N	\N	t	\N	\N	f
36	existing name	existinguser@example.com	$argon2id$v=19$m=65536,t=3,p=4$2VM7wfPkiOwJxXn566Eqtg$LzO+kG7j3zUDNgbWlxe/UiERj8znNyKGpr2Akeb6vtI	2024-11-06 18:22:43.559825	\N	\N	t	\N	\N	f
14	anything	hussay@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$idvTEtpczE1lMAwpkMjd4Q$73hzSjOLiE+GZDaGfHaCf7KrurMiZzD0EscbJTvMT88	2024-10-28 22:18:41.052033	hmm its also a bio	\N	t	\N	\N	f
13	ooga	ooga@ooga.com	$argon2id$v=19$m=65536,t=3,p=4$EkdTQMjfTUtx7Gx+ESvBYQ$5pGsiZ9rx6CXjSqG9t+kNlhagrhioqkx4dkuTayZoXE	2024-10-28 20:47:01.309602	just another test bio	C:\\Users\\asifi\\Documents\\gde\\GluGuide\\gluGuideSetup\\server\\uploads\\1730501553944-3.PNG	t	\N	\N	f
22	testingagain	testing@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$72vegUKMnBVBkMHN0C1H2A$bus7dSKn/diFAa12I/qOKadt7tGeMfihRqzZFtwYB4o	2024-11-02 14:43:49.011122	this is for testing	\N	t	\N	\N	f
38	123	w@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$SOMxnIn9tYVJXrWG6BJRtw$rCa9+feHLtvPNUO9NBM08sJxCp7iBJ+K93KS4bq0BcY	2024-11-06 21:56:46.403376	\N	\N	t	\N	\N	f
24	laederach	qwe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$SZHGtn4qZDCZ35gRyuPeXQ$1Nr7SOgMFSA8v35BF/054Q2sYnCrRyWJdS2ynC1Xxqw	2024-11-02 17:50:31.547595	\N	\N	t	\N	\N	f
25	uuuu	uuuu@uuuu.com	$argon2id$v=19$m=65536,t=3,p=4$oxD7hGpIi02DJEIRtkzLPg$tiiuLZVpWJ3eH3IPH5/qSUaGpXCn4qI3rNzDN4jRgAQ	2024-11-02 17:56:17.645128	\N	\N	t	\N	\N	f
31	hafsajabeen	hafsajabeen30@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$AeysT/vvplVzEe/70SscEw$19oia0pgEgUqigQJ2Zjy+KbCP3ymA6YRRclS1w3zjJs	2024-11-05 18:02:12.107203	\N	\N	t	\N	\N	f
27	newf	fl@gmail.de	$argon2id$v=19$m=65536,t=3,p=4$StUMaaBsLobfyacoqGjP+w$eHoOBG4+PQNehBxKtPAgSR31PWZyd6ieuBCJySpohZ8	2024-11-03 09:50:11.600408	\N	\N	t	\N	\N	f
23	hafsa	jabeen@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$psD3jGHEqCcGrBC/9lJMPA$i3g3P5E8uHTs62m6Dhizv98bfyWoXeQvzs0BN3sXllw	2024-11-02 17:04:33.120266	\N	/Users/hafsajabeen/Documents/software_engineering/GluGuide/gluGuideSetup/server/uploads/1730830096750-IMG_4705.jpeg	t	\N	\N	f
45	test2	test2@example.com	$argon2id$v=19$m=65536,t=3,p=4$RxmAC8W/7fJ+aj9Dx6Lf8Q$O0eyp4H/AMVr3W+LWvu25h+2ivfspqhC3ReWycdKM6A	2025-03-30 19:55:27.280747	\N	\N	t	\N	\N	f
29	hossayji	hossay@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ewywpMB65E7mzXYRhOZxlw$lvDyNna7uI+PZnjNwFNp52JkMTWEO2wALRnqjzVBxrk	2024-11-04 13:51:06.21579	im editing in beautiful interface\n	C:\\Users\\asifi\\Documents\\gde\\GluGuide\\gluGuideSetup\\server\\uploads\\1730848469357-cat-7667234_1280.webp	t	\N	\N	f
40	luna	luna@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$SjULY84px/mwygj2ehDqTA$Q/XlX55jEIWpET9I1g1XA3pDZaC1MOhNZCjCUpYOPps	2024-11-07 08:24:43.191232	<p>This is luna's bio.</p>	/Users/hafsajabeen/Documents/software_engineering/GluGuide/gluGuideSetup/server/uploads/1730974832566-IMG_4705.jpeg	t	6ed1886abfaf428a463f849fd165cec54a8682d8	2024-11-20 04:09:59.145	f
34	stan.nmixx	orzalaasifi@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$nw1d6cwtW1hyyLBMqVZiAQ$DEv7UeltJ9oPw+h2arjRlM9fgjKpwRG/3VU9j5eY+lg	2024-11-06 16:26:04.859783	edit your bio	C:\\Users\\asifi\\Documents\\gde\\GluGuide\\gluGuideSetup\\server\\uploads\\1730910424067-task.PNG	t	\N	\N	f
55	johnNotAdmin	aaaaaaaa@a.de	$argon2id$v=19$m=65536,t=3,p=4$2rpMM/j1J1f/VqBrbVC5tw$GSRrcN3jRJwtQEfNI4YNeuGIGKVHzVl3AJw2aPyJaL4	2025-04-06 18:36:37.934718	this my bio	\N	t	\N	\N	f
43	newUser123	newuser@example.com	$argon2id$v=19$m=65536,t=3,p=4$XJu/A1jSG2QMOpK9tFPJXA$dNOhRQNREy4tBlpvQ4GXcFy57y6JVyKNnbdRFSqihXw	2025-03-30 17:58:54.094362	\N	\N	t	\N	\N	f
46	Admin	admin@example.com	$argon2id$v=19$m=65536,t=3,p=4$nIM4HNIOyCVHzXs9c4Cm8A$BCrJnYeE8k795n5S64bBP1Yjpq+iUmA2Sz2AKxtuv6w	2025-03-31 14:42:35.091989	\N	\N	t	\N	\N	t
49	admin123	admin123@example.com	$argon2id$v=19$m=65536,t=3,p=4$wOuTeJR59bBtAY88BQ+2UA$OpW2IFaKiVq+mxuyKiZs3SHGqJBUJ2dub+ArHt/k2cw	2025-04-06 16:40:50.569143	\N	\N	t	\N	\N	t
50	test123333	dsf@awd.de	$argon2id$v=19$m=65536,t=3,p=4$vnqhAbLectHlhj1HsX+uAQ$Pvg/t2WZYPW//9eSkwe7+koffNHaY/3mBmAGQkHA6co	2025-04-06 17:31:54.847495	\N	\N	t	\N	\N	f
26	emili	e@web.de	$argon2id$v=19$m=65536,t=3,p=4$JosZ+MjssKqhFQZ7V6RQjg$5Q+UFbQzYcB/rStD9wYXYmhQ+WEsajTIwCkeExVP3U0	2024-11-02 18:27:53.633828	This is my bio	1744503173568-snail-1612895_1280.jpg	t	\N	\N	f
41	maja-test	test@test.de	$argon2id$v=19$m=65536,t=3,p=4$wkah/P3ERbpAD9MizzXviw$EMnIydGbxZKOQsrPt1CyEbm8dOfZik4mvRdOoo8NUjM	2024-11-09 16:06:10.205842	<p>This is a bio about me.</p>	1747587789357-il_794xN.5113899271_1ncb.webp	t	\N	\N	t
59	cooladmin	aaa@aaaa.dddd	$argon2id$v=19$m=65536,t=3,p=4$o2hyt2CywKkmWUhTarNzrQ$8hbenAT+LthQdBkMjeXxeF/nRx8Vr89+6Vn02xitg4Y	2025-04-06 23:48:41.044785	\N	\N	t	\N	\N	f
42	TestUser	TestUser@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$XvFMJ1O8r5n43pICJRGLaA$9WEpu0tDGsaLsvTdMldeWG2rPVYJCEcjsGpjLbYcCok	2024-11-16 21:54:33.426361	<p>This is my bio hallo test</p>	C:\\Users\\Emi\\OneDrive\\Desktop\\GluGuide\\GluGuide\\gluGuideSetup\\server\\uploads\\1732068645007-Yellowstone-1452599710.jpg	t	\N	\N	t
60	newuser	add@a.dad	$argon2id$v=19$m=65536,t=3,p=4$v0vOBGVIcLs3preBpeXvhQ$jNt3OJsbZvAypGXAmzsvqPk59ZaDxA+Hy27cQfsAt1A	2025-04-07 00:06:05.511717	\N	\N	t	\N	\N	t
61	AnotherTestUser	s@web.de	$argon2id$v=19$m=65536,t=3,p=4$W5WT0bWY2vK/XYshbhZmcA$rGbjxRa8mow8c74BYpiT+NYQo1UWDOPpnHdeq0aF998	2025-04-08 14:26:20.551123	<h1><strong>hello,choose me</strong></h1>	1744506450641-bear-5142209_1280.jpg	t	\N	\N	f
63	Emili2	eliza.liebt.sommer@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6UWHpqUHOi2ifv1MAkHT+w$E27VIfjq2JA50vAR5v++F07RvXpjQElROOCMTwjab/M	2025-04-30 00:52:45.702885	\N	\N	t	cb446afb8750b8ddc22903ee60e457cd9e5a0a7b	2025-04-30 18:28:38.826	f
66	emili2	gluguide01@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$hBMSJju9Rj7klunhWxg8dQ$SzhtEqyVAsLymSKhcnpoU8FUWPwIsTU6oWU1brpaTxc	2025-05-17 15:15:47.710178	\N	\N	t	\N	\N	f
39	hossaynew	hossayaqobzai@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$8CZyDnpr0f/ubdQwctnOvQ$Qa/GdgMxEEd9tbGU2uQGv9weYhr5Kk7NQGnOQ6Zhm20	2024-11-06 23:21:56.380481	<p><strong>some information</strong></p>	C:\\Users\\asifi\\Documents\\gde\\GluGuide\\gluGuideSetup\\server\\uploads\\1731875559091-cat-7667234_1280.webp	t	092c2a918219c95807afbb0bbb6c466752261159	2025-04-30 18:59:23.144	f
67	NiKu	nilgunworks@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$X90Ty0jSCO53R9PxfSJb2A$Al7w8KAde/Yv7e+U3NE3CeXeq57IuPNOx/NB/TOryVI	2025-05-17 16:59:40.272256		1747501503315-LokUm.jpg	t	\N	\N	f
\.


--
-- Data for Name: test_table; Type: TABLE DATA; Schema: test; Owner: -
--

COPY test.test_table (id, age, quality, pronoun) FROM stdin;
1	20	good	w
\.


--
-- Name: alerts_alert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.alerts_alert_id_seq', 55, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 92, true);


--
-- Name: dislikes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dislikes_id_seq', 1, false);


--
-- Name: food_logs_food_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.food_logs_food_log_id_seq', 7, true);


--
-- Name: foods_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.foods_food_id_seq', 316, true);


--
-- Name: glucose_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.glucose_logs_id_seq', 51, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, false);


--
-- Name: meal_food_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_food_items_id_seq', 45, true);


--
-- Name: meals_meal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meals_meal_id_seq', 30, true);


--
-- Name: post_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_tags_id_seq', 96, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 134, true);


--
-- Name: recipe_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_logs_id_seq', 4, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 12, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 27, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 67, true);


--
-- Name: test_table_id_seq; Type: SEQUENCE SET; Schema: test; Owner: -
--

SELECT pg_catalog.setval('test.test_table_id_seq', 1, false);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (alert_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: dislikes dislikes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dislikes
    ADD CONSTRAINT dislikes_pkey PRIMARY KEY (id);


--
-- Name: food_logs food_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_pkey PRIMARY KEY (food_log_id);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (food_id);


--
-- Name: glucose_logs glucose_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glucose_logs
    ADD CONSTRAINT glucose_logs_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: meal_food_items meal_food_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_food_items
    ADD CONSTRAINT meal_food_items_pkey PRIMARY KEY (id);


--
-- Name: meals meals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meals
    ADD CONSTRAINT meals_pkey PRIMARY KEY (meal_id);


--
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: recipe_logs recipe_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_logs
    ADD CONSTRAINT recipe_logs_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: foods unique_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT unique_name UNIQUE (name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: test_table primary_key; Type: CONSTRAINT; Schema: test; Owner: -
--

ALTER TABLE ONLY test.test_table
    ADD CONSTRAINT primary_key PRIMARY KEY (id);


--
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: dislikes dislikes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dislikes
    ADD CONSTRAINT dislikes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: dislikes dislikes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dislikes
    ADD CONSTRAINT dislikes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: meals fk_recipe; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meals
    ADD CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE SET NULL;


--
-- Name: alerts fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: food_logs food_logs_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id);


--
-- Name: food_logs food_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: glucose_logs glucose_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glucose_logs
    ADD CONSTRAINT glucose_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: meal_food_items meal_food_items_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_food_items
    ADD CONSTRAINT meal_food_items_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id);


--
-- Name: meal_food_items meal_food_items_meal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_food_items
    ADD CONSTRAINT meal_food_items_meal_id_fkey FOREIGN KEY (meal_id) REFERENCES public.meals(meal_id) ON DELETE CASCADE;


--
-- Name: meals meals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meals
    ADD CONSTRAINT meals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_tags post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: recipe_logs recipe_logs_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_logs
    ADD CONSTRAINT recipe_logs_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_logs recipe_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_logs
    ADD CONSTRAINT recipe_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

