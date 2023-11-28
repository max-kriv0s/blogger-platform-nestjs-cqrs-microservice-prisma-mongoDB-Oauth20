import { Module } from '@nestjs/common';
import { AuthController } from './api';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';
import { STRATEGIES } from './strategies/idex';
import { JWTModule } from '../../core/jwt-adapter/jwt.module';

@Module({
  imports: [UserModule, DeviceModule, JWTModule],
  controllers: [AuthController],
  providers: [...STRATEGIES],
})
export class AuthModule {}
