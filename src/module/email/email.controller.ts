import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('email')
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
