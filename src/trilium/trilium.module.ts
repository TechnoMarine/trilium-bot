import { Module } from '@nestjs/common';
import { TriliumService } from './trilium.service';

@Module({
  providers: [TriliumService],
  exports: [TriliumService],
})
export class TriliumModule {}
