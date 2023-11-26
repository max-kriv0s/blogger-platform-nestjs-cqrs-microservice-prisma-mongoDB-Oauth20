import { Module } from '@nestjs/common';
import { AuthController } from './api';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [UserModule, DeviceModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
