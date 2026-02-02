CREATE TABLE public.data (
  data_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  datetime timestamp with time zone DEFAULT now(),
  name text,
  type text,
  speed bigint,
  accuracy bigint,
  service text,
  comment text,
  CONSTRAINT data_pkey PRIMARY KEY (data_id)
);
CREATE TABLE public.users (
  user_id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  fullname text NOT NULL,
  position text,
  email text UNIQUE,
  image text,
  id text,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);