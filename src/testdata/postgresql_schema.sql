--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 14.12 (Homebrew)

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
-- Name: dataset_values; Type: TABLE; Schema: public; Owner: taoli
--

CREATE TABLE public.dataset_values (
    id integer NOT NULL,
    dataset_id integer NOT NULL,
    column_name character varying(255) NOT NULL,
    row_index integer NOT NULL,
    value text
);


ALTER TABLE public.dataset_values OWNER TO taoli;

--
-- Name: dataset_values_id_seq; Type: SEQUENCE; Schema: public; Owner: taoli
--

CREATE SEQUENCE public.dataset_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dataset_values_id_seq OWNER TO taoli;

--
-- Name: dataset_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taoli
--

ALTER SEQUENCE public.dataset_values_id_seq OWNED BY public.dataset_values.id;


--
-- Name: uploaded_datasets; Type: TABLE; Schema: public; Owner: taoli
--

CREATE TABLE public.uploaded_datasets (
    id integer NOT NULL,
    dataset_name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    upload_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.uploaded_datasets OWNER TO taoli;

--
-- Name: uploaded_datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: taoli
--

CREATE SEQUENCE public.uploaded_datasets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uploaded_datasets_id_seq OWNER TO taoli;

--
-- Name: uploaded_datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taoli
--

ALTER SEQUENCE public.uploaded_datasets_id_seq OWNED BY public.uploaded_datasets.id;


--
-- Name: dataset_values id; Type: DEFAULT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.dataset_values ALTER COLUMN id SET DEFAULT nextval('public.dataset_values_id_seq'::regclass);


--
-- Name: uploaded_datasets id; Type: DEFAULT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.uploaded_datasets ALTER COLUMN id SET DEFAULT nextval('public.uploaded_datasets_id_seq'::regclass);


--
-- Data for Name: dataset_values; Type: TABLE DATA; Schema: public; Owner: taoli
--

COPY public.dataset_values (id, dataset_id, column_name, row_index, value) FROM stdin;
11	4	name	1	Alice
12	4	age	1	25
13	4	name	2	Bob
14	4	age	2	30
15	4	name	3	Charlie
16	4	age	3	35
17	4	name	4	David
18	4	age	4	40
19	4	name	5	Eve
20	4	age	5	45
\.


--
-- Data for Name: uploaded_datasets; Type: TABLE DATA; Schema: public; Owner: taoli
--

COPY public.uploaded_datasets (id, dataset_name, file_name, upload_time) FROM stdin;
4	taoliDatasets	one.csv	2024-05-22 16:36:35.191487
\.


--
-- Name: dataset_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taoli
--

SELECT pg_catalog.setval('public.dataset_values_id_seq', 20, true);


--
-- Name: uploaded_datasets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taoli
--

SELECT pg_catalog.setval('public.uploaded_datasets_id_seq', 4, true);


--
-- Name: dataset_values dataset_values_pkey; Type: CONSTRAINT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.dataset_values
    ADD CONSTRAINT dataset_values_pkey PRIMARY KEY (id);


--
-- Name: dataset_values unique_column_row_per_dataset; Type: CONSTRAINT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.dataset_values
    ADD CONSTRAINT unique_column_row_per_dataset UNIQUE (dataset_id, column_name, row_index);


--
-- Name: uploaded_datasets uploaded_datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.uploaded_datasets
    ADD CONSTRAINT uploaded_datasets_pkey PRIMARY KEY (id);


--
-- Name: dataset_values dataset_values_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taoli
--

ALTER TABLE ONLY public.dataset_values
    ADD CONSTRAINT dataset_values_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.uploaded_datasets(id);


--
-- PostgreSQL database dump complete
--

