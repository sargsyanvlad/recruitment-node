import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { FindOptionsWhere } from 'typeorm';
import { CertificateSchema } from './schemas/certificate-schema';
import { Certificate } from './entities/certificate.entity';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Certificates')
@Controller({
  path: 'certificate',
  version: '1',
})
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiResponse({
    description: 'List of Certificates',
    type: CertificateSchema,
    isArray: true,
  })
  async findAll(
    @Request() request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50;
    }
    const onlyPublic = !request.user;

    return infinityPagination(
      await this.certificateService.findManyWithPagination(
        {
          page,
          limit,
        },
        onlyPublic,
      ),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findOne(@Request() request, @Param('id') id: string) {
    const fields: FindOptionsWhere<Certificate> = { id: +id };

    const certificate = await this.certificateService.findOne(fields);
    return certificate || { result: null };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/transfer')
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async transfer(
    @Body() transferBody: TransferCertificateDto,
    @Request() request,
  ) {
    const ownerId = request.user.id;
    const { userId: newOwnerId, certificateId } = transferBody;

    if (ownerId === newOwnerId) {
      return null;
    }

    const fields: FindOptionsWhere<Certificate> = { id: +certificateId };

    const certificate = await this.certificateService.findOne(fields);
    if (certificate.ownerId !== ownerId) {
      return null;
    }
    return this.certificateService.transfer(newOwnerId, ownerId, certificateId);
  }
}
