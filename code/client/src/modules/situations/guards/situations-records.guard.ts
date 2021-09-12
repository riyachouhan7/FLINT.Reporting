import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class SituationsRecordsGuard implements CanActivate {
    canActivate(): Observable<boolean> {
        return of(true);
    }
}