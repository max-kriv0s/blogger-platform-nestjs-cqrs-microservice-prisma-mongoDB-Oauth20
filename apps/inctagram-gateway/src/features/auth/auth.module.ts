import { Module } from '@nestjs/common';
import { AuthController } from './api';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
