import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';

import { DrizzleClient } from 'src/drizzle/drizzle.client';
import { nurseTable } from './nurse.table';

export type Nurse = typeof nurseTable.$inferSelect;
export type NurseUniqueTrait = {
  id?: Nurse['id'];
  nationalId?: Nurse['nationalId'];
};
export type NurseCreation = Omit<typeof nurseTable.$inferInsert, 'password'> & {
  password?: (typeof nurseTable.$inferInsert)['password'];
};
export type NurseUpdate = Partial<NurseCreation>;

export class NurseNotFoundError extends Error {}

@Injectable()
export class NurseRepository {
  constructor(
    @Inject('DRIZZLE_CLIENT')
    private readonly drizzleClient: DrizzleClient,
  ) {}
  
  generateRandomPassword(): string {
    return generator.generate({
      length: 10,
      numbers: true,
    });
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
  
  async create(nurseCreation: NurseCreation): Promise<Nurse> {
    return await this.drizzleClient.transaction(async transaction => {
      const [nurse] = await transaction
        .insert(nurseTable)
        .values({
          ...nurseCreation,
          password: this.hashPassword(nurseCreation.password ?? this.generateRandomPassword()),
        })
        .returning();
      
      return nurse;
    });
  }

  async findMany(): Promise<Nurse[]> {
    return await this.drizzleClient.transaction(async transaction => {
      const nurses = await transaction
        .select()
        .from(nurseTable);
      
      return nurses;
    });
  }

  private buildFilterConditionFromUniqueTrait(nurseUniqueTrait: NurseUniqueTrait) {
    if (nurseUniqueTrait.id) {
      return eq(nurseTable.id, nurseUniqueTrait.id);
    }
    return eq(nurseTable.nationalId, nurseUniqueTrait.nationalId!);
  }
  
  async findOne(nurseUniqueTrait: NurseUniqueTrait): Promise<Nurse | null> {
    return await this.drizzleClient.transaction(async transaction => {
      const [nurse = null] = await transaction
        .select()
        .from(nurseTable)
        .where(this.buildFilterConditionFromUniqueTrait(nurseUniqueTrait));

      return nurse;
    });
  }

  async update(nurseUniqueTrait: NurseUniqueTrait, nurseUpdate: NurseUpdate): Promise<Nurse> {
    return await this.drizzleClient.transaction(async transaction => {
      if (!(await this.findOne(nurseUniqueTrait))) {
        throw new NurseNotFoundError();
      }
      
      const [nurse] = await transaction
        .update(nurseTable)
        .set({
          ...nurseUpdate,
          password: nurseUpdate.password ? this.hashPassword(nurseUpdate.password) : undefined,
        })
        .where(this.buildFilterConditionFromUniqueTrait(nurseUniqueTrait))
        .returning();
      
      return nurse;
    });
  }

  async delete(nurseUniqueTrait: NurseUniqueTrait): Promise<Nurse> {
    return await this.drizzleClient.transaction(async transaction => {
      if (!(await this.findOne(nurseUniqueTrait))) {
        throw new NurseNotFoundError();
      }
      
      const [nurse] = await transaction
        .delete(nurseTable)
        .where(this.buildFilterConditionFromUniqueTrait(nurseUniqueTrait))
        .returning();
      
        return nurse;
    });
  }
}