import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseNumberPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = Number(value);
    if (isNaN(val)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)'
      );
    }
    return val;
  }
}
