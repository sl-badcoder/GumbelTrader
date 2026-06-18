import type { Db } from "../../db/db.js";
import type { UserRecord } from "./user.types.js";

type UserRow = {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  created_at: Date;
};

export interface UserRepository {
  create(input: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
}

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly db: Db) {}

  async create(input: {
    email: string;
    displayName: string;
    passwordHash: string;
  }): Promise<UserRecord> {
    const result = await this.db.query<UserRow>(
      `
        insert into users (email, display_name, password_hash)
        values ($1, $2, $3)
        returning id, email, display_name, password_hash, created_at
      `,
      [input.email, input.displayName, input.passwordHash]
    );
    return mapUserRow(result.rows[0]);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `
        select id, email, display_name, password_hash, created_at
        from users
        where email = $1
      `,
      [email]
    );
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `
        select id, email, display_name, password_hash, created_at
        from users
        where id = $1
      `,
      [id]
    );
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  }
}

function mapUserRow(row: UserRow | undefined): UserRecord {
  if (!row) {
    throw new Error("Expected user row");
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    passwordHash: row.password_hash,
    createdAt: row.created_at.toISOString()
  };
}
