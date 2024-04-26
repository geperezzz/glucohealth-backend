import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { nurseDtoSchema } from './nurse.dto';

export const nurseUniqueTraitDtoSchema = nurseDtoSchema
  .pick({
    id: true,
    nationalId: true,
  })
  .partial()
  .refine(
    ({ id, nationalId }) => !!id != !!nationalId, // Logical XOR
    {
      message: "Must specify only one of the following query params: id, nationalId",
    },
  );

export class NurseUniqueTraitDto extends createZodDto(nurseUniqueTraitDtoSchema) {
  id?: z.infer<typeof nurseUniqueTraitDtoSchema>['id'] = super.id;
  nationalId?: z.infer<typeof nurseUniqueTraitDtoSchema>['nationalId'] = super['nationalId'];
}