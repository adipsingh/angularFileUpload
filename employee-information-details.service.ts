import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import {
    Employee, Department, SubDepartment,
    Designation, Skills, EmployeeDocument, Contract, EmployeePayment
} from './employee-information-details.model';



@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    constructor(private http: HttpClient) { }
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };
    private baseURL = environment.baseServiceURL;

    updateEmployee(employee: Employee) {
        try {
            return this.http.put(environment.baseServiceURL + `UpdateEmployee`, employee, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addEmployee(employee: Employee) {
        try {
            return this.http.post(environment.baseServiceURL + `createEmployee`, employee, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    getSkills() {
        try {
            return this.http.get(environment.baseServiceURL + `GetAllSkillsInformation`, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }
    getDepartments() {
        try {
            return this.http.get(environment.baseServiceURL + `GetDepartment`, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );

        } catch (error) {

        }
    }

    getSubDepartments(departmentCode: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetSubdepartment/` + departmentCode, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    getDesingnations(subDepartmentCode: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetDesignations/` + subDepartmentCode, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addDepartment(department: Department) {
        try {
            return this.http.post(environment.baseServiceURL + `CreateDepartment`, department, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addSubDepartment(subDepartment: SubDepartment) {
        try {
            return this.http.post(environment.baseServiceURL + `Createsubdepartment`, subDepartment, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addDesignation(designation: Designation) {
        try {
            return this.http.post(environment.baseServiceURL + `CreateDesignation`, designation, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addSkill(skill: Skills) {
        try {
            return this.http.post(environment.baseServiceURL + `CreateSkillInformation`, skill, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    saveEmployeeImage(employeeDocument: EmployeeDocument) {
        try {

            const header = new HttpHeaders({
                // 'content-type': 'multipart/form-data; charset=utf-8',
                // "Accept": "application/json",
                'Access-Control-Allow-Origin': '*'
            });
            const formData: FormData = new FormData();
            formData.append(employeeDocument.employeeDocName, employeeDocument.employeeDocDetails);
            return this.http.post(environment.baseServiceURL + `SaveDocument?employeeId=` + employeeDocument.employeeId +
                '&imageName=' + employeeDocument.employeeDocName
                , formData, { headers: header }).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    getDocumentsByEmployeeId(employeeId: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetAllDocumentByEmpId/` + employeeId, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }
    getDocumentByDocumentId(documentId: number) {
        try {
            const header = new HttpHeaders({
                'Content-Type': 'application/octet-stream',
                'Access-Control-Allow-Origin': '*'
            });
            return this.http.get(environment.baseServiceURL + `GetDocumentByDocId/` +
                documentId, { headers: header, responseType: 'blob' }).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    getEmployeeByBiometricId(biometricId: number): Observable<Employee[]> {
        try {
            if (!biometricId) {
                return of([]);
            }
            return this.http.get<Employee[]>(environment.baseServiceURL + `GetEmployeeByBioMetricId/` + biometricId, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }


    getEmployeeByEmployeeName(empName: string): Observable<Employee[]> {
        try {
            if (empName) {
                return this.http.get<Employee[]>(environment.baseServiceURL + `getEmployeeByEmployeeName/` + empName, this.httpOptions).
                    pipe(
                        ((data) => {
                            return data;
                        }), (error => {
                            return (error);
                        })
                    );
            } else {
                return of([]);
            }
        } catch (error) {

        }
    }


    getContracts() {
        try {
            return this.http.get(environment.baseServiceURL + `GetAllContractor`, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    addContract(contract: Contract) {
        try {
            return this.http.post(environment.baseServiceURL + `createContractor`, contract, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    createEmployeePayment(employeePayment: EmployeePayment) {
        try {

            return this.http.post(environment.baseServiceURL + `CreatePayment`, employeePayment, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    updateEmployeePayment(employeePayment: EmployeePayment) {
        try {

            return this.http.put(environment.baseServiceURL + `UpadtePayment`, employeePayment, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    getEmployeePaymentByEmployeeId(employeeId: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetEmployeePayment/` + employeeId, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }

    checkDuplicateBiometricId(biometricId: number) {
        try {
            return this.http.get(environment.baseServiceURL + `CheckDuplicateBiometricId/` + biometricId, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } catch (error) {

        }
    }
}
