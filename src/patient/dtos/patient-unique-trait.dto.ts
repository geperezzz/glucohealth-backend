import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { patientDtoSchema } from './patient.dto';

export const patientUniqueTraitDtoSchema = patientDtoSchema
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

export class PatientUniqueTraitDto extends createZodDto(patientUniqueTraitDtoSchema) {
  id?: z.infer<typeof patientUniqueTraitDtoSchema>['id'] = super.id;
  email?: z.infer<typeof patientUniqueTraitDtoSchema>['email'] = super.email;
  nationalId?: z.infer<typeof patientUniqueTraitDtoSchema>['nationalId'] = super.nationalId;
}