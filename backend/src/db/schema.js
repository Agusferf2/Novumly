import {
  check,
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 320 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  feedKey: text('feed_key').notNull().default('global'),
  interests: jsonb('interests').notNull().default([]),
  feedKeyAppliesDate: date('feed_key_applies_date', { mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex('users_email_unique').on(table.email),
]);

export const dailyTopics = pgTable('daily_topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: date('date', { mode: 'string' }).notNull(),
  feedKey: text('feed_key').notNull().default('global'),
  topicKey: varchar('topic_key', { length: 250 }).notNull(),
  primaryTag: varchar('primary_tag', { length: 100 }).notNull(),
  title: text('title').notNull(),
  resume: text('resume').notNull(),
  keyPoints: jsonb('key_points').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex('daily_topics_date_feed_unique').on(table.date, table.feedKey),
  index('daily_topics_feed_date_idx').on(table.feedKey, table.date),
]);

export const userDays = pgTable('user_days', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date', { mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex('user_days_user_date_unique').on(table.userId, table.date),
  index('user_days_user_date_idx').on(table.userId, table.date),
]);

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date', { mode: 'string' }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  index('chat_messages_user_date_created_idx').on(table.userId, table.date, table.createdAt),
  check('chat_messages_role_check', sql`${table.role} in ('user', 'assistant')`),
]);
