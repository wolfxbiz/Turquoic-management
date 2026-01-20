import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { DataSource } from 'typeorm';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class RlsInterceptor implements NestInterceptor {
    constructor(private dataSource: DataSource) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.tenantId) {
            return next.handle();
        }

        const tenantId = user.tenantId;

        // Set the tenant ID for RLS on the current connection
        // Note: In a real production app with connection pooling, you'd want to ensure
        // this is set for every query or use a more robust RLS library.
        return from(this.dataSource.query(`SET app.current_tenant = '${tenantId}'`)).pipe(
            switchMap(() => next.handle()),
        );
    }
}
