import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { nurseDtoSchema } from './nurse.dto';

export const nurseUniqueTraitDtoSchema = nurseDtoSchema
  .pick({
    id: true,
    email: true,
    nationalId: true,
  })
  .partial()
  .refine(
    ({ id, email, nationalId }) =>
      [!!id, !!email, !!nationalId].filter(trait => trait).length === 1,
    {
      message: "Must specify only one of the following query params: id, email, nationalId",
    },
  );

export class NurseUniqueTraitDto extends createZodDto(nurseUniqueTraitDtoSchema) {
  id?: z.infer<typeof nurseUniqueTraitDtoSchema>['id'] = super.id;
  email?: z.infer<typeof nurseUniqueTraitDtoSchema>['email'] = super.email;
  nationalId?: z.infer<typeof nurseUniqueTraitDtoSchema>['nationalId'] = super.nationalId;
}