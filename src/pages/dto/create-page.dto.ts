import { IsNotEmpty } from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  path: string;
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  sha: string;
}
