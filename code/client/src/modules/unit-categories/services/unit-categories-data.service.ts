import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { UnitCategory } from '../models/unit-category.model';
import { environment } from 'environments/environment';
import { MessageType } from '@common/models/message.type.model';
import { MessageService } from '@common/services';
import { catchError, tap } from 'rxjs/operators';

const LOG_PREFIX: string = "[Unit categories Data Service]";
const API_PREFIX: string = "api/v1/unit_categories";
const HEADERS = { 'Content-Type': 'application/json' };


@Injectable({
  providedIn: 'root'
})
export class UnitCategoriesDataService {

  private _baseUrl: string = environment.baseUrl;
  private _cache: { unitCategories: UnitCategory[] } = { unitCategories: [] };
  private _subject$ = new BehaviorSubject<UnitCategory[]>([]);

  readonly unitCategories$ = this._subject$.asObservable();

  constructor(
    private http: HttpClient,
    private log: NGXLogger,
    private messageService: MessageService) {

  }

  /**
   * Creates and adds an instance of a new Unit category record to the local cache and then broadcasts the changes to all subscribers
   * 
   * @param unitCategory The details of the Unit category record to be created - with the id and version details missing
   */
  public createUnitCategory(unitCategory: UnitCategory): Observable<UnitCategory> {

    this.log.trace(`${LOG_PREFIX} Entering createUnitCategory()`);
    this.log.debug(`${LOG_PREFIX} UnitCategory = ${JSON.stringify(unitCategory)}`);

    // Make a HTTP POST Request to create the record
    this.log.debug(`${LOG_PREFIX} Making a HTTP POST Request to ${this._baseUrl}/${API_PREFIX} to create the record`);

    return this.http.post<UnitCategory>(`${this._baseUrl}/${API_PREFIX}`, JSON.stringify(unitCategory), { headers: new HttpHeaders(HEADERS) })
      .pipe(

        tap((data: UnitCategory) => {

          // Unit category record Creation was successful
          this.log.trace(`${LOG_PREFIX} Record Creation was successful`);
          this.log.debug(`${LOG_PREFIX} Created Unit category record = ${JSON.stringify(data)}`);

          // Add the newly created Unit category record to the Local Cache
          this.log.trace(`${LOG_PREFIX} Adding the newly created Unit category record to the Local Cache`);
          this._cache.unitCategories.push(data);

          // Push a copy of the newly updated Unit categories records to all Subscribers
          this.log.trace(`${LOG_PREFIX} Pushing a copy of the newly updated Unit categories records to all Subscribers`);
          this._subject$.next(Object.assign({}, this._cache).unitCategories);

          // Send a message that states that the Unit category record Creation was successful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Creation was successful`);
          this.messageService.sendMessage({ "type": MessageType.Success, "message": "The Unit category record Creation was successful" });

        }),

        catchError((error: any) => {

          // Unit category record Creation was unsuccessful
          this.log.error(`${LOG_PREFIX} Unit category record Creation was unsuccessful: ${error.statusText || "See Server Logs for more details"}`);

          // Send a message that states that the Unit category record Creation was unsuccessful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Creation was unsuccessful`);
          this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit category record Creation was unsuccessful" });

          return throwError(error);
        }));
  }


  /**
   * Retrieves and adds a single Unit category record to the local cache and then broadcasts the changes to all subscribers
   * 
   * @param unitCategoryId The Unique Identifier of the Unit category record
   */
  getUnitCategory(unitCategoryId: number): Observable<UnitCategory> {

    this.log.trace(`${LOG_PREFIX} Entering getUnitCategory()`);
    this.log.debug(`${LOG_PREFIX} UnitCategory Id = ${unitCategoryId}`);

    // Make a HTTP GET Request to retrieve the record
    this.log.debug(`${LOG_PREFIX} Making a HTTP GET Request to ${this._baseUrl}/${API_PREFIX}/ids/${unitCategoryId} to retrieve the record`);

    return this.http.get<UnitCategory>(`${this._baseUrl}/${API_PREFIX}/ids/${unitCategoryId}`, { headers: new HttpHeaders(HEADERS) })
      .pipe(

        tap((data: UnitCategory) => {

          // Unit category record Retrieval was successful
          this.log.trace(`${LOG_PREFIX} Unit category record Retrieval was successful`);
          this.log.debug(`${LOG_PREFIX} Retrieved Unit category record = ${JSON.stringify(data)}`);

          // Search for the Unit category record in the Local Cache and return its index
          this.log.trace(`${LOG_PREFIX} Searching for the Unit category record in the Local Cache and returning its index`);
          let index = this._cache.unitCategories.findIndex(d => d.id === data.id);
          this.log.debug(`${LOG_PREFIX} Unit category record Index = ${index}`);

          // If the record was found (index != -1), update it, else, add it to the Local Storage
          if (index != -1) {

            // The Unit category record was found in the Local Cache
            this.log.trace(`${LOG_PREFIX} The Unit category record was found in the Local Cache`);

            // Update the local Unit category record
            this.log.trace(`${LOG_PREFIX} Updating the local Unit category record`);
            this._cache.unitCategories[index] = data;

          } else {

            // The Unit category record was not found in the Local Cache
            this.log.trace(`${LOG_PREFIX} The Unit category record was not found in the Local Cache`);

            // Add the Unit category record to the Local Cache
            this.log.trace(`${LOG_PREFIX} Adding the Unit category record to the Local Cache`);
            this._cache.unitCategories.push(data);
          }

          // Push a copy of the newly updated Unit categories records to all Subscribers
          this.log.trace(`${LOG_PREFIX} Pushing a copy of the newly updated Unit categories records to all Subscribers`);
          this._subject$.next(Object.assign({}, this._cache).unitCategories);

          // Send a message that states that the Unit category record Retrieval was successful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Retrieval was successful`);
          this.messageService.sendMessage({ "type": MessageType.Success, "message": "The Unit category record Retrieval was successful" });

        }),

        catchError((error: any) => {

          // Unit category record Retrieval was unsuccessful
          this.log.error(`${LOG_PREFIX} Unit category record Retrieval was unsuccessful: ${error.statusText || "See Server Logs for more details"}`);

          // Send a message that states that the Unit category record Retrieval was unsuccessful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Retrieval was unsuccessful`);
          this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit category record Retrieval was unsuccessful" });

          return throwError(error);
        }));
  }


  /**
   * Retrieves and adds all or a subset of all Unit categories records to the local cache and then broadcasts the changes to all subscribers
   * 
   * @param filters Optional query parameters used in filtering the retrieved records
   */
  getAllUnitCategories(filters?: any): Observable<UnitCategory[]> {

    this.log.trace(`${LOG_PREFIX} Entering getAllUnitCategories()`);
    this.log.debug(`${LOG_PREFIX} Filters = ${JSON.stringify(filters)}`);

    // Make a HTTP GET Request to retrieve the records
    this.log.debug(`${LOG_PREFIX} Making a HTTP GET Request to ${this._baseUrl}/${API_PREFIX}/all to retrieve the records`);

    return this.http.get<UnitCategory[]>(`${this._baseUrl}/${API_PREFIX}/all`, { headers: new HttpHeaders(HEADERS), params: filters == null ? {} : filters })
      .pipe(

        tap((data: UnitCategory[]) => {

          // Unit categories records Retrieval was successful
          this.log.trace(`${LOG_PREFIX} Unit categories records Retrieval was successful`);
          this.log.debug(`${LOG_PREFIX} Retrieved Unit categories records = ${JSON.stringify(data)}`);

          // Update the Unit categories records in the Local Cache to the newly pulled Unit categories records
          this.log.trace(`${LOG_PREFIX} Updating the Unit categories records in the Local Cache to the newly pulled Unit categories records`);
          this._cache.unitCategories = data;

          // Push a copy of the newly updated Unit categories records to all Subscribers
          this.log.trace(`${LOG_PREFIX} Pushing a copy of the newly updated Unit categories records to all Subscribers`);
          this._subject$.next(Object.assign({}, this._cache).unitCategories);

          // Send a message that states that the Unit categories records Retrieval was successful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit categories records Retrieval was successful`);
          this.messageService.sendMessage({ "type": MessageType.Success, "message": "The Unit categories records Retrieval was successful" });

        }),

        catchError((error: any) => {

          // Unit categories records Retrieval was unsuccessful
          this.log.error(`${LOG_PREFIX} Unit categories records Retrieval was unsuccessful: ${error.statusText || "See Server Logs for more details"}`);

          // Send a message that states that the Unit categories records Retrieval was unsuccessful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit categories records Retrieval was unsuccessful`);
          this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit categories records Retrieval was unsuccessful" });

          return throwError(error);
        }));
  }


  /**
   * Updates a single Unit category record and its corresponding counterpart in the local cache and then broadcasts the changes to all subscribers
   * 
   * @param unitCategory The details of the Unit category record to be updated
   */
  updateUnitCategory(unitCategory: UnitCategory): Observable<UnitCategory> {

    this.log.trace(`${LOG_PREFIX} Entering updateUnitCategory()`);
    this.log.debug(`${LOG_PREFIX} UnitCategory = ${JSON.stringify(unitCategory)}`);

    // Make a HTTP POST Request to retrieve the records
    this.log.debug(`${LOG_PREFIX} Making a HTTP POST Request to ${this._baseUrl}/${API_PREFIX} to update the record`);

    return this.http.put<UnitCategory>(`${this._baseUrl}/${API_PREFIX}`, JSON.stringify(unitCategory), { headers: new HttpHeaders(HEADERS) })
      .pipe(

        tap((data: UnitCategory) => {

          // Unit category record Update was successful
          this.log.trace(`${LOG_PREFIX} Unit category record Update was successful`);
          this.log.debug(`${LOG_PREFIX} Updated Unit category record = ${JSON.stringify(data)}`);

          // Search for the locally stored Unit category record
          this.log.trace(`${LOG_PREFIX} Searching for the locally stored Unit category record`);
          let index = this._cache.unitCategories.findIndex(d => d.id === data.id);
          this.log.debug(`${LOG_PREFIX} Updated Unit category record Index = ${index}`);

          // If the record was found (index != -1), update it in the Local Cache
          if (index != -1) {

            // Update the local Unit category record
            this.log.trace(`${LOG_PREFIX} Updating the locally stored Unit category record`);
            this._cache.unitCategories[index] = data;

            // Push a copy of the newly updated Unit categories records to all Subscribers
            this.log.trace(`${LOG_PREFIX} Pushing a copy of the newly updated Unit categories records to all Subscribers`);
            this._subject$.next(Object.assign({}, this._cache).unitCategories);

            // Send a message that states that the Unit category record Update was successful
            this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Update was successful`);
            this.messageService.sendMessage({ "type": MessageType.Success, "message": "The Unit category record Update was successful" });

          } else {

            // Local Cache Update was unsuccessful
            this.log.error(`${LOG_PREFIX} Local Cache Update was unsuccessful: Unit category record is missing in the Local Cache`);

            // Send a message that states that the Local Cache Update was unsuccessful
            this.log.trace(`${LOG_PREFIX} Sending a message that states that the Local Cache Update was unsuccessful`);
            this.messageService.sendMessage({ "type": MessageType.Error, "message": "Unit categories records Local Cache Update was unsuccessful" });
          }

        }),

        catchError((error: any) => {

          // Unit category record Update was unsuccessful
          this.log.error(`${LOG_PREFIX} Unit category record Update was unsuccessful: ${error.statusText || "See Server Logs for more details"}`);

          // Send a message that states that the Unit category record Update was unsuccessful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Update was unsuccessful`);
          this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit category record Update was unsuccessful" });

          return throwError(error);

        }));
  }


  /**
   * Deletes a single Unit category record and its corresponding counterpart in the local cache and then broadcasts the changes to all subscribers
   *
   * @param unitCategoryId The Unique Identifier of the record
   * @returns The total count of deleted records - which should be 1 in this case if the delete operation was successful
   */
  deleteUnitCategory(unitCategoryId: number): Observable<number> {

    this.log.trace(`${LOG_PREFIX} Entering deleteUnitCategory()`);
    this.log.debug(`${LOG_PREFIX} UnitCategory Id = ${unitCategoryId}`);

    // Make a HTTP DELETE Request to retrieve the records
    this.log.debug(`${LOG_PREFIX} Making a HTTP DELETE Request to ${this._baseUrl}/${API_PREFIX}/ids/${unitCategoryId} to delete the record`);

    return this.http.delete<number>(`${this._baseUrl}/${API_PREFIX}/ids/${unitCategoryId}`, { headers: new HttpHeaders(HEADERS) })
      .pipe(

        tap((count: number) => {

          // Mark the deletion successful if and only if exactly 1 record was deleted
          if (count == 1) {

            // Unit category record Deletion was successful
            this.log.trace(`${LOG_PREFIX} Unit category record Deletion was successful`);

            // Search for the deleted Unit category record in the Local Cache
            this.log.trace(`${LOG_PREFIX} Searching for the deleted Unit category record in the Local Cache`);
            let index = this._cache.unitCategories.findIndex(d => d.id == unitCategoryId);
            this.log.debug(`${LOG_PREFIX} Deleted Unit category record Index = ${index}`);

            // If the record was found (index != -1), remove it from the Local Cache
            if (index != -1) {

              // Remove the deleted Unit category record from the Local Cache
              this.log.trace(`${LOG_PREFIX} Removing the deleted Unit category record from the Local Cache`);
              this._cache.unitCategories.splice(index, 1);

              // Push a copy of the newly updated Unit categories records to all Subscribers
              this.log.trace(`${LOG_PREFIX} Pushing a copy of the newly updated Unit categories records to all Subscribers`);
              this._subject$.next(Object.assign({}, this._cache).unitCategories);

              // Send a message that states that the Unit category record Deletion was successful
              this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Deletion was successful`);
              this.messageService.sendMessage({ "type": MessageType.Success, "message": "The Unit category record Deletion was successful" });

            } else {

              // Local Cache Update was unsuccessful
              this.log.error(`${LOG_PREFIX} Local Cache Update was unsuccessful: Unit category record is missing in the Local Cache`);

              // Send a message that states that the Local Cache Update was unsuccessful
              this.log.trace(`${LOG_PREFIX} Sending a message that states that the Local Cache Update was unsuccessful`);
              this.messageService.sendMessage({ "type": MessageType.Error, "message": "Unit categories records Local Cache Update was unsuccessful" });
            }
          } else {

            // Unit category record Deletion was unsuccessful
            this.log.error(`${LOG_PREFIX} Unit category record Deletion was unsuccessful: Expecting 1 record to be deleted instead of ${count}`);

            // Send a message that states that the Unit category record Deletion was unsuccessful
            this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Deletion was unsuccessful`);
            this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit category record Deletion was unsuccessful" });

          }


        }),

        catchError((error: any) => {

          // Unit category record Deletion was unsuccessful
          this.log.error(`${LOG_PREFIX} Unit category record Deletion was unsuccessful: ${error.statusText || "See Server Logs for more details"}`);

          // Send a message that states that the Unit category record Deletion was unsuccessful
          this.log.trace(`${LOG_PREFIX} Sending a message that states that the Unit category record Deletion was unsuccessful`);
          this.messageService.sendMessage({ "type": MessageType.Error, "message": "The Unit category record Deletion was unsuccessful" });

          return throwError(error);
        }));
  }


  /**
   * Use BehaviorSubject's getter property named value to get the most recent value passed through it.
   */
  public get records() {
    return this._subject$.value;
  }
}