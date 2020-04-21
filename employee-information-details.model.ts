export class Department {
    Id: number;
    departmentCode: string;
    departMentName: string;
    SubDepartments: string;
}
export class SubDepartment {
    Id: number;
    subDepartmentCode: string;
    subDepartmentName: string;
    departmentCode: string;
    Designations: string;
}

export class Designation {
    Id: number;
    designationCode: string;
    designattionName: string;
    departmentCode: string;
    subDepartmentCode: string;
    Employees: string;
}
export class Skills {
    Id: number;
    skillsCode: string;
    skillsName: string;
    departmentCode: string;
}

export class Employee {
    employeeId: string;
    employeeName: string;
    employeeCreationDate: string;
    empCreatedId: string;
    empUnder: string;
    contractorCode: string;
    empBiometricId: string;
    employeePicture: string;
    employeeGender: string;
    employeeDivision: string;
    employeeDOB: string;
    employeeFatherSpouseName: string;
    employeeRelationship: string;
    employeeContactNo: number;
    employeeAltContactNo: number;
    employeeMailId: string;
    employeeMaritalStatus: string;
    employeeNoOfDependents: number;
    employeePresentAddress: string;
    employeePermanentAddress: string;
    employeeBloodGroup: string;
    departmentCode: string;
    subDepartmentCode: string;
    designationCode: string;
    skillsCode: string;
    employeeDOJ: string;
    employeeIHExp: number;
    employeeTOTExp: number;
    employeePFNo: string;
    employeeEsiNo: string;
    employeeAadharNo: string;
    employeePassportNo: string;
    employeePan: string;
    employeeStatusAsOn: string;
}

export class EmployeeDocument {
    docId?: number;
    employeeId: string;
    employeeDocName: string;
    employeeDocDetails: any;
}

export class Contract {
    Id: number;
    contractorCode: string;
    contractorName: string;
    contractorLocation: string;
}

export class EmployeePayment {
    ID: number;
    employeeId: string;
    employeePaymentCategory: string;
    employeeBasicSalary: number;
    employeeHRA: number;
    employeeDA: number;
    employeeCA: number;
    employeeMA: number;
    employeeIncentives: number;
    employeeOA: number;
    employeeGrossSalary: number;
}

