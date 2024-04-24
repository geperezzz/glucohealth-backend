import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { nurseDtoSchema } from './nurse.dto';
import { NurseUniqueTrait } from '../nurse.repository';

export const optionalNurseUniqueTraitDtoSchema = z.object({
  id: nurseDtoSchema.shape.id.optional(),
  'national-id': nurseDtoSchema.shape.nationalId.optional(),
});

export class OptionalNurseUniqueTraitDto extends createZodDto(optionalNurseUniqueTraitDtoSchema) {
  id?: z.infer<typeof optionalNurseUniqueTraitDtoSchema>['id'] = super.id;
  'national-id'?: z.infer<typeof optionalNurseUniqueTraitDtoSchema>['national-id'] = super['national-id'];
  
  static toNonOptional(dto: OptionalNurseUniqueTraitDto): NurseUniqueTraitDto | null {
    if (dto.id || dto['national-id']) {
      return nurseUniqueTraitDtoSchema.parse(dto);
    }
    return null;
  }
}

export const nurseUniqueTraitDtoSchema = optionalNurseUniqueTraitDtoSchema
  .refine(
    ({ id, ['national-id']: nationalId }) => !!id != !!nationalId, // Logical XOR
    {
      message: "Must specify only one of the following query params: id, national-id",
    },
  );

export class NurseUniqueTraitDto extends createZodDto(nurseUniqueTraitDtoSchema) {
  id?: z.infer<typeof nurseUniqueTraitDtoSchema>['id'] = super.id;
  'national-id'?: z.infer<typeof nurseUniqueTraitDtoSchema>['national-id'] = super['national-id'];

  static toModel(dto: NurseUniqueTraitDto): NurseUniqueTrait {
    return {
      id: dto.id,
      nationalId: dto['national-id'],
    };
  }
}