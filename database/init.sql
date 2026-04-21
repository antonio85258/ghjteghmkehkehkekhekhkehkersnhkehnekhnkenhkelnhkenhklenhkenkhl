create table if not exists users (
  id serial primary key,
  full_name varchar(120) not null,
  email varchar(120) unique not null,
  password_hash text not null,
  role varchar(20) not null default 'user',
  created_at timestamp default now()
);

create table if not exists flights (
  id serial primary key,
  airline varchar(120) not null,
  flight_number varchar(40) not null,
  from_city varchar(120) not null,
  to_city varchar(120) not null,
  departure_time timestamp not null,
  arrival_time timestamp not null,
  price numeric(10,2) not null,
  seats_total int not null,
  seats_left int not null,
  created_at timestamp default now()
);

create table if not exists bookings (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  flight_id int not null references flights(id) on delete cascade,
  passengers_count int not null default 1,
  total_price numeric(10,2) not null,
  status varchar(30) not null default 'confirmed',
  created_at timestamp default now()
);

insert into users (full_name, email, password_hash, role)
values
('Main Admin', 'admin@example.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
('Test User', 'user@example.com', 'e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446', 'user')
on conflict (email) do nothing;

insert into flights (
  airline, flight_number, from_city, to_city, departure_time, arrival_time, price, seats_total, seats_left
)
values
('Air Baltic', 'BT101', 'Riga', 'Berlin', '2026-04-25 08:30:00', '2026-04-25 10:10:00', 79.99, 180, 53),
('Turkish Airlines', 'TK550', 'Riga', 'Istanbul', '2026-04-25 13:20:00', '2026-04-25 17:10:00', 149.50, 180, 90),
('Lufthansa', 'LH893', 'Vilnius', 'Frankfurt', '2026-04-26 09:00:00', '2026-04-26 10:45:00', 134.00, 160, 44),
('Ryanair', 'FR221', 'Warsaw', 'Milan', '2026-04-26 18:40:00', '2026-04-26 20:35:00', 61.00, 189, 77),
('Wizz Air', 'W6221', 'Riga', 'Rome', '2026-04-27 06:10:00', '2026-04-27 09:00:00', 96.90, 180, 60),
('Finnair', 'AY112', 'Tallinn', 'Helsinki', '2026-04-27 11:15:00', '2026-04-27 12:05:00', 58.20, 120, 40)
on conflict do nothing;
