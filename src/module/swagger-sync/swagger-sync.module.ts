import { Global, Module } from '@nestjs/common';
import { SwaggerSyncService } from '@/module/swagger-sync/swagger-sync.service';

@Global()
@Module({
  imports: [],
  providers: [SwaggerSyncService],
  exports: [SwaggerSyncService],
})
export class SwaggerSyncModule {
}
