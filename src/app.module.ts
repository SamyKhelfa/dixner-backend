import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, GroupsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
