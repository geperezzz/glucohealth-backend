import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { patientDtoSchema } from './patient.dto';

export const patientCreationDtoSchema = patientDtoSchema
  .partial()
  .required({
    email: true,
    nationalId: true
  });

export class PatientCreationDto extends createZodDto(patientCreationDtoSchema) {}