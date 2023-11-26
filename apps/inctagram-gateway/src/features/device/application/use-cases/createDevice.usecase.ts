import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateDeviceCommand {
  constructor(public deviceDto) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase
  implements ICommandHandler<CreateDeviceCommand>
{
  constructor() {}

  async execute({ deviceDto }: CreateDeviceCommand) {}
}
