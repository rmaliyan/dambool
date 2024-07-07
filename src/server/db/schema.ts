import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  json,
  boolean
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { GameModel } from "~/game-logic";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dambool_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("createdById", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt"),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

export const rooms = createTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    ownerId: integer("owner_id")
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  }
)

export const roomPlayers = createTable(
  "room_players",
  {
    id: serial("id").primaryKey(),    
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id),    
    peerId: varchar("player_peerId", { length: 64 }),
    playerId: integer("player_id")
      .notNull(),
    playerName: varchar("player_name", { length: 25 })
      .notNull(),
    isReady: boolean("is_ready").notNull().default(false),
    isRemoved: boolean("is_removed").notNull().default(false),
  }
)

export const games = createTable (
  "games",
  {
    id: serial("id").primaryKey(),     
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id), 
    gameJson: json("game_json").$type<GameModel>()
      .notNull(),
    isFinished: boolean("is_finished")
      .notNull(),
    winnerId: integer("winner_id")
  }
)

export const roomsRelations = relations(rooms, ({ many }) => ({
  players: many(roomPlayers),
  games: many(games),
}));

export const roomPlayersRelations = relations(roomPlayers, ({ one }) => ({
  room: one(rooms, {
   fields: [roomPlayers.roomId],
   references: [rooms.id] 
  }),
}));

export const gamesRelations = relations(games, ({one}) => ({
  room: one(rooms, { 
    fields: [games.roomId],
    references: [rooms.id]
  }),
}))


////////////////////////////////////////////////////////////////////////////////////////////


export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});


export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
