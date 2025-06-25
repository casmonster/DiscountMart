--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: tr_admin
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO tr_admin;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: tr_admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tr_admin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: tr_admin
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: tr_admin
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO tr_admin;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: tr_admin
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO tr_admin;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: tr_admin
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id text NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.cart_items OWNER TO tr_admin;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO tr_admin;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE public.categories OWNER TO tr_admin;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO tr_admin;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO tr_admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO tr_admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    total_amount double precision NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    cart_id text NOT NULL
);


ALTER TABLE public.orders OWNER TO tr_admin;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO tr_admin;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    price double precision NOT NULL,
    discount_price double precision,
    category_id integer NOT NULL,
    in_stock boolean DEFAULT true NOT NULL,
    stock_level integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    is_new boolean DEFAULT false,
    set_pieces integer DEFAULT 1 NOT NULL,
    unit_type text DEFAULT 'piece'::text NOT NULL
);


ALTER TABLE public.products OWNER TO tr_admin;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO tr_admin;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: tr_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO tr_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: tr_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO tr_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tr_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: tr_admin
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: tr_admin
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.cart_items (id, cart_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.categories (id, name, slug, image_url) FROM stdin;
13	Clothing	clothing	https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80
14	Tableware	tableware	https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80
15	Kitchen	kitchen	https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80
16	Home Decor	home-decor	https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
5	3	57	1	49.99
6	3	58	2	50.99
7	4	67	1	49.98
8	4	70	1	129.99
9	5	75	1	34.99
10	6	60	1	179.94
11	6	58	2	35.99
12	7	63	3	24.99
13	8	64	1	69.99
14	8	62	1	319.92
15	9	57	1	29.99
16	10	60	3	179.94
17	10	59	1	49.99
18	11	66	1	59.99
19	11	65	1	19.99
20	11	60	1	179.94
21	12	57	1	29.99
22	13	64	1	69.99
23	14	61	2	69.99
24	15	60	1	179.94
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.orders (id, customer_name, customer_email, customer_phone, total_amount, status, created_at, cart_id) FROM stdin;
6	rrr	jo@gmail.com	1234567890	110.1276	pending	2025-06-22 17:31:54.664	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
7	Income tax	mugbetrinity@gmail.com	0000011111	80.9676	pending	2025-06-22 17:57:35.539	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
8	Mugabe trinity	mugbetrinity@gmail.com	0000011111	118.77839999999999	pending	2025-06-22 20:54:59.482	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
9	Income tax	mugbetrinity@gmail.com	0000011111	32.389199999999995	pending	2025-06-22 21:09:02.918	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
10	In	mugbetrinity@gmail.com	0987654321	151.1568	pending	2025-06-23 11:57:38.47	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
11	John	me@gmail.com	0000011111	118.7676	pending	2025-06-23 12:10:18.205	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
12	Income tax	mugbetrinity@gmail.com	0000011111	32.389199999999995	pending	2025-06-23 12:59:03.619	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
13	ab	mugbetrinity@gmail.com	0000011111	75.58919999999999	processing	2025-06-23 14:24:19.74	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
3	Alice Doe	alice@example.com	+250788528067	100.98	processing	2025-06-20 14:37:15.02	example-cart-id
5	John Due 	mugabe@gmail.com	+25080152723	37.7892	processing	2025-06-22 16:40:59.358	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
4	Income tax	mugbetrinity@gmail.com	+25080152723	167.37840000000003	processing	2025-06-22 15:57:46.631	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
14	Income tax1	mugbetrinity@gmail.com	+2508015272333	151.17839999999998	shipped	2025-06-23 17:27:09.768	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
15	Be	Be@gmail.com	0000011111	32.389199999999995	pending	2025-06-23 21:04:11.589	0e832402-5c1a-4bc7-8c33-96a2f537a6f5
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.products (id, name, slug, description, image_url, price, discount_price, category_id, in_stock, stock_level, is_featured, created_at, is_new, set_pieces, unit_type) FROM stdin;
57	Blue Linen Shirt	blue-linen-shirt	Comfortable blue linen shirt perfect for summer days.	https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	49.99	29.99	13	t	60	t	2025-06-20 14:37:14.776	f	1	piece
58	Knit Sweater	knit-sweater	Warm and cozy knit sweater for cold winter days.	https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	50.99	35.99	13	t	60	t	2025-06-20 14:37:14.776	f	1	piece
59	Ceramic Dinner Plate	ceramic-dinner-plate	Locally made ceramic plate, ideal for modern table settings.	https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	54.99	49.99	14	t	100	t	2025-06-20 14:37:14.776	f	12	set
60	Crystal Glass Set	crystal-glass-set	Elegant crystal glass set for your special occasions.	https://images.unsplash.com/photo-1589365278144-c9e705f843ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	29.99	\N	14	t	100	f	2025-06-20 14:37:14.776	t	6	set
61	Premium Cooking Pot Set	premium-cooking-pot-set	High-quality stainless steel cooking pot set for all your kitchen needs.	https://images.pexels.com/photos/6874235/pexels-photo-6874235.jpeg?auto=compress&cs=tinysrgb&w=500	89.99	69.99	15	t	90	f	2025-06-20 14:37:14.776	f	5	set
62	Glass Drinkware Collection	glass-drinkware-collection	Elegant set of drinking glasses including water, wine, and cocktail glasses.	https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	39.99	\N	15	t	200	f	2025-06-20 14:37:14.776	t	8	set
63	Modern Lamp	modern-lamp	Stylish modern lamp to light up your living space.	https://images.pexels.com/photos/6970077/pexels-photo-6970077.jpeg?auto=compress&cs=tinysrgb&w=500	49.99	24.99	16	t	100	t	2025-06-20 14:37:14.776	f	1	piece
64	Wall Art Canvas Set	wall-art-canvas-set	Modern abstract wall art canvas set of three pieces.	https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	89.99	69.99	16	t	50	t	2025-06-20 14:37:14.776	t	3	set
65	Wool Scarf	wool-scarf	Soft wool scarf to keep you warm during the winter.	https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	19.99	\N	13	t	70	f	2025-06-20 14:37:14.776	t	1	piece
66	Denim Jacket	denim-jacket	Classic denim jacket for a timeless casual look.	https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	79.99	59.99	13	t	50	t	2025-06-20 14:37:14.776	f	1	piece
67	Cotton T-Shirt	cotton-t-shirt	Premium cotton t-shirt for everyday comfort.	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	24.99	\N	13	t	200	f	2025-06-20 14:37:14.776	t	2	pack
68	Leather Belt	leather-belt	Genuine leather belt with classic buckle design.	https://images.unsplash.com/photo-1624222247344-550fb60583dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	39.99	29.99	13	t	150	t	2025-06-20 14:37:14.776	f	1	piece
69	Casual Pants	casual-pants	Comfortable casual pants for relaxed style.	https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	64.99	49.99	13	t	60	t	2025-06-20 14:37:14.776	f	1	piece
70	Winter Coat	winter-coat	Warm winter coat for cold weather protection.	https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	129.99	\N	13	t	50	f	2025-06-20 14:37:14.776	t	1	piece
71	Porcelain Tea Set	porcelain-tea-set	Fine porcelain tea set with elegant floral design.	https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	79.99	59.99	14	t	80	t	2025-06-20 14:37:14.776	f	8	set
72	Stainless Steel Cutlery Set	stainless-steel-cutlery	Professional-grade stainless steel cutlery set.	https://images.pexels.com/photos/175765/pexels-photo-175765.jpeg?auto=compress&cs=tinysrgb&w=500	89.99	69.99	14	t	80	t	2025-06-20 14:37:14.776	f	16	set
73	Bamboo Serving Tray	bamboo-serving-tray	Eco-friendly bamboo serving tray for entertaining.	https://images.unsplash.com/photo-1584473457406-6240486418e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	34.99	\N	14	t	200	f	2025-06-20 14:37:14.776	t	1	piece
74	Wine Glass Collection	wine-glass-collection	Professional wine glass collection for connoisseurs.	https://images.pexels.com/photos/12268571/pexels-photo-12268571.jpeg?auto=compress&cs=tinysrgb&w=500	54.99	39.99	14	t	100	t	2025-06-20 14:37:14.776	f	4	set
75	Ceramic Plate Set	ceramic-plate-set	Beautiful ceramic plates for everyday use or special occasions.	https://images.pexels.com/photos/6270663/pexels-photo-6270663.jpeg?auto=compress&cs=tinysrgb&w=500	49.99	34.99	15	t	400	t	2025-06-20 14:37:14.776	f	6	set
76	Non-Stick Pan Set	non-stick-pan-set	Professional non-stick pan set for perfect cooking.	https://images.pexels.com/photos/7719169/pexels-photo-7719169.jpeg?auto=compress&cs=tinysrgb&w=500	119.99	89.99	15	t	300	t	2025-06-20 14:37:14.776	f	3	set
77	Kitchen Knife Set	kitchen-knife-set	Professional chef knife set with wooden block.	https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80	149.99	\N	15	t	80	f	2025-06-20 14:37:14.776	t	7	set
78	Wooden Cutting Board	wooden-cutting-board	Large bamboo cutting board with groove design.	https://images.pexels.com/photos/32445973/pexels-photo-32445973.jpeg?auto=compress&cs=tinysrgb&w=500	29.99	19.99	15	t	100	t	2025-06-20 14:37:14.776	f	1	piece
79	Electric Coffee Maker	electric-coffee-maker	Programmable coffee maker for perfect morning brew.	https://images.pexels.com/photos/30689451/pexels-photo-30689451.jpeg?auto=compress&cs=tinysrgb&w=500	179.99	\N	15	t	60	f	2025-06-20 14:37:14.776	t	1	piece
80	Ceramic Vase Set	ceramic-vase-set	Beautiful ceramic vase set for your home decor.	https://images.pexels.com/photos/8989514/pexels-photo-8989514.jpeg?auto=compress&cs=tinysrgb&w=500	34.99	\N	16	t	70	f	2025-06-20 14:37:14.776	t	3	set
81	Cotton Throw Blanket	cotton-throw-blanket	Soft cotton throw blanket for your cozy evenings.	https://images.pexels.com/photos/8526713/pexels-photo-8526713.jpeg?auto=compress&cs=tinysrgb&w=500	24.99	\N	16	t	50	f	2025-06-20 14:37:14.776	t	1	piece
82	Decorative Mirror	decorative-mirror	Round decorative mirror with golden frame.	https://images.pexels.com/photos/2203743/pexels-photo-2203743.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80	79.99	59.99	16	t	200	t	2025-06-20 14:37:14.776	f	1	piece
83	Scented Candle Set	scented-candle-set	Luxury scented candle set with relaxing fragrances.	https://images.pexels.com/photos/20419182/pexels-photo-20419182.jpeg?auto=compress&cs=tinysrgb&w=500	44.99	\N	16	t	100	f	2025-06-20 14:37:14.776	t	4	set
84	Indoor Plant Collection	indoor-plant-collection	Set of three low-maintenance indoor plants with pots.	https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=500	54.99	\N	16	t	80	f	2025-06-20 14:37:14.776	t	3	set
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tr_admin
--

COPY public.users (id, name, email, password, phone, created_at) FROM stdin;
5	Alice Doe	alice@example.com	$2b$10$wl3EUTr1NxHsGh/mEcZyp./yuVQ9KHT7r7oGpyxyNpU04RxpYImwq	+250788528067	2025-06-20 16:37:15.006+02
6	Bob Smith	bob@example.com	$2b$10$XXT0IPWFjP8VzKqYh9hffO3.gG6SLlQgsGwu0LvuTM0pv5wYJR.5S	+250788528068	2025-06-20 16:37:15.006+02
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: tr_admin
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 67, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.categories_id_seq', 16, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.order_items_id_seq', 24, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.orders_id_seq', 15, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.products_id_seq', 84, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tr_admin
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: tr_admin
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tr_admin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: tr_admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

