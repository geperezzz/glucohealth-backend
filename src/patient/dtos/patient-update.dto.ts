import { createZodDto } from 'nestjs-zod';

import { patientCreationDtoSchema } from './patient-creation.dto';

export const patientUpdateDtoSchema = patientCreationDtoSchema.partial();

export class PatientUpdateDto extends createZodDto(patientUpdateDtoSchema) {}