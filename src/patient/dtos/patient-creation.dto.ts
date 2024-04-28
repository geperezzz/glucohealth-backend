import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { patientDtoSchema } from './patient.dto';

export const patientCreationDtoSchema = patientDtoSchema
  .partial()
  .required({
    email: true,
    nationalId: true
  })
  .extend({
    id: patientDtoSchema.shape.id.optional(),
    password: z.string().trim().min(1).optional(),
  });

export class PatientCreationDto extends createZodDto(patientCreationDtoSchema) {}