CREATE DATABASE integratedpernapp;

create schema users;

create schema todos;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users.users(
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwd VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE todos.todos(
  id SERIAL,
  user_id UUID,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users.users(id)
);