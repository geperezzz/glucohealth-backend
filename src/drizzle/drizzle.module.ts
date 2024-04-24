import { Module } from '@nestjs/common';

import { drizzleClient } from './drizzle.client';

@Module({
  providers: [
    {
      provide: 'DRIZZLE_CLIENT',
      useValue: drizzleClient,
    },
  ],
  exports: ['DRIZZLE_CLIENT'],
})
export class DrizzleModule {}