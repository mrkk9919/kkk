import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
export interface AdminUser {
    id: string;
    username: string;
    role: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        admin: AdminUser;
    }>;
    validate(payload: AdminUser): Promise<AdminUser>;
}
