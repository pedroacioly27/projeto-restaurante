


create table usuarios(
id serial primary key,
nome text,
email text not null unique,
senha text not null,
);

create table transacoes (
  id serial primary key,
  tipo text,
  descricao text,
  valor integer not null,
  data date default now(),
  usuario_id int references usuarios(id)
  
);

create table insumos(
  id serial primary key,
  usuario_id int references usuarios(id),
  nome text not null,
  peso int not null,
  valor int not null,
);

create table preparos(
  id serial primary key,
  usuario_id int references usuarios(id),
  nome text not null,
  peso int not null,
);


create table receitas(
  id serial primary key,
  usuario_id int references usuarios(id),
  nome text not null
);

create table insumo_receita(
  id serial primary key,
  usuario_id int references usuarios(id),
  insumo_id int references insumos(id),
  receita_id int references receitas(id),
  peso_utilizado int not null
 
);


create table preparo_receita(
  id serial primary key,
  usuario_id int references usuarios(id),
  preparo_id int references preparos(id),
  receita_id int references receitas(id),
  peso_utilizado int not null
 
);


create table insumo_preparo(
  id serial primary key,
  usuario_id int references usuarios(id),
  insumo_id int references insumos(id),
  preparo_id int references preparos(id),
  peso_utilizado int not null
);



