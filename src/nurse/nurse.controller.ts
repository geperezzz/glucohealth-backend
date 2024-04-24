import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Patch, Post, Query } from '@nestjs/common';

import { NurseNotFoundError, NurseRepository } from './nurse.repository';
import { NurseCreationDto } from './dtos/nurse-creation.dto';
import { NurseDto } from './dtos/nurse.dto';
import { NurseUpdateDto } from './dtos/nurse-update.dto';
import { NurseUniqueTraitDto, OptionalNurseUniqueTraitDto } from './dtos/nurse-unique-trait.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('nurses')
@ApiTags('Nurses')
export class NurseController {
  constructor(
    private readonly nurseRepository: NurseRepository,
  ) {}
  
  @Post()
  async create(
    @Body() nurseCreationDto: NurseCreationDto,
  ): Promise<NurseDto> {
    const nurse = await this.nurseRepository.create(nurseCreationDto);
    return NurseDto.fromModel(nurse);
  }
  
  @Get()
  async findOneOrMany(
    @Query() optionalNurseUniqueTraitDto: OptionalNurseUniqueTraitDto,
  ): Promise<NurseDto | NurseDto[]> {
    const nurseUniqueTraitDto = OptionalNurseUniqueTraitDto.toNonOptional(optionalNurseUniqueTraitDto);
    if (!nurseUniqueTraitDto) {
      return await this.findMany();
    }
    return await this.findOne(nurseUniqueTraitDto);
  }

  private async findMany(): Promise<NurseDto[]> {
    const nurses = await this.nurseRepository.findMany();
    return nurses.map(NurseDto.fromModel);
  }

  private async findOne(nurseUniqueTraitDto: NurseUniqueTraitDto): Promise<NurseDto> {
    const nurse = await this.nurseRepository.findOne(
      NurseUniqueTraitDto.toModel(nurseUniqueTraitDto),
    );
    if (!nurse) {
      throw new NotFoundException(
        'Nurse not found',
        `There is no nurse who complies with the given constraints`
      );
    }
    return NurseDto.fromModel(nurse);
  }

  @Patch()
  async update(
    @Body() nurseUpdateDto: NurseUpdateDto,
    @Query() nurseUniqueTraitDto: NurseUniqueTraitDto,
  ): Promise<NurseDto> {
    try {
      const nurse = await this.nurseRepository.update(
        NurseUniqueTraitDto.toModel(nurseUniqueTraitDto),
        nurseUpdateDto
      );
      return NurseDto.fromModel(nurse);
    } catch (error) {
      if (error instanceof NurseNotFoundError) {
        throw new NotFoundException(
          'Nurse not found',
          {
            description: `There is no nurse who complies with the given constraints`,
            cause: error,
          },
        );
      }
      throw error;
    }
  }

  @Delete()
  async delete(
    @Query() nurseUniqueTraitDto: NurseUniqueTraitDto,
  ): Promise<NurseDto> {
    try {
      const nurse = await this.nurseRepository.delete(
        NurseUniqueTraitDto.toModel(nurseUniqueTraitDto),
      );
      return NurseDto.fromModel(nurse);
    } catch (error) {
      if (error instanceof NurseNotFoundError) {
        throw new NotFoundException(
          'Nurse not found',
          {
            description: `There is no nurse who complies with the given constraints`,
            cause: error,
          },
        );
      }
      throw error;
    }
  }
}