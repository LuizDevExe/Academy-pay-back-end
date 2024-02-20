create table users (
    id serial primary key,
    name text not null,
    email text not null unique,
    password text not null,
    cpf text unique,
    phone text
);

create sequence billing_seq
start with 8150108;

create sequence clients_seq
start with 265915;

create table clients(
    id integer primary key default nextval('clients_seq'),
    user_id integer not null references users(id),
    name text not null,
    cpf text not null,
    email text not null,
    phone text not null,
    zip_code text,
    address text,
    complementary_address text,
    neighborhood text,
    city text,
    state text
);

create table billing(
   id integer primary key default nextval('billing_seq'),
    client_id integer not null references clients(id),
    user_id integer not null references users(id),
    status text not null,
    value integer not null,
    due_date date not null,
    payment_date date,
    description text
);