import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import {
  Department, SubDepartment, Designation,
  Employee, Skills, EmployeeDocument, Contract, EmployeePayment
} from './employee-information-details.model';
import { EmployeeService } from './employee-information-details.service';
import { MatDialog, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker, MatInput } from '@angular/material';
import { CameraCaptureDialogComponent } from 'src/app/corecomponents/camera-capture-dialog/camera-capture-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Observable, concat, forkJoin } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { RegexMaster } from 'src/app/shared/regex.master';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-employee-information-details',
  templateUrl: './employee-information-details.component.html',
  styleUrls: ['./employee-information-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeInformationDetailsComponent implements OnInit {

  @ViewChild('dateOfCreation', { static: false }) dateOfCreation: ElementRef;
  @ViewChild('biometric', { static: false }) biometric: ElementRef;
  @ViewChild('documentName', { static: false }) documentName: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('modifyButton', { static: false }) modifyButton: ElementRef;

  employeeInformationForm = new FormGroup({
    CreationDate: new FormControl('', [Validators.required]),
    LoginUserName: new FormControl('', [Validators.required]),
    Comployee: new FormControl('', [Validators.required]),
    Contractor: new FormControl(),
    BioMetricId: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    EmployeeNmae: new FormControl('', [Validators.required]),
    Gender: new FormControl('', [Validators.required]),
    EmployeeDivision: new FormControl('', [Validators.required]),
    DOB: new FormControl('', [Validators.required]),
    FatherSpouseName: new FormControl('', [Validators.required]),
    RelationShip: new FormControl('', [Validators.required]),
    ContactNumber: new FormControl('', [Validators.required, Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    AlternateContactNumber: new FormControl('', [Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    // tslint:disable-next-line: max-line-length
    Email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]),
    MaritalStatus: new FormControl('', [Validators.required]),
    NoOfDependends: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    PresentAddress: new FormControl('', [Validators.required]),
    PermanantAddress: new FormControl('', [Validators.required]),
    BloodGroup: new FormControl('', [Validators.required]),
    Department: new FormControl('', [Validators.required]),
    SubDepartment: new FormControl('', [Validators.required]),
    Designation: new FormControl('', [Validators.required]),
    Skills: new FormControl('', [Validators.required]),
    EmpJoiningDate: new FormControl('', [Validators.required]),
    InHouseExperience: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    TotalExperience: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    PfNumber: new FormControl('', [Validators.required]),
    ESINumer: new FormControl('', [Validators.required]),
    AadharNumber: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
    PassportNumber: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
    PanNumber: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
    PermanantDesc: new FormControl('', [Validators.required]),
    PaymentTenure: new FormControl('', [Validators.required]),
    Basic: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]),
    HRA: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    DearnessAllowance: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    ConveyanceAllowance: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,9}\.\d{1,2})$|^\d{0,9}$/)]),
    MedicalAllowance: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    Incentives: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,9}\.\d{1,2})$|^\d{0,9}$/)]),
    OtherAllowances: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    TotalSalary: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,20}$/)]),
    NameOfDocument: new FormControl('')
  });

  public mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  public previewText = 'Hide';
  public hidePreview = false;
  biometricIdList: Employee[];
  biometricIdListOptions: string[] = [];

  employeeNameList: Employee[];
  employeeOptionsList: string[] = [];

  documentList: EmployeeDocument[] = [];
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 300 },
      height: { ideal: 200 }
    }
  };
  videoWidth = 0;
  videoHeight = 0;
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  isLoading: boolean;
  isLoadingEmployeeName: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;
  biometricIdError: boolean;
  selectedEmployeeForEdit: Employee;
  selectedEmployeePamyentForEdit: EmployeePayment;
  isFileError: boolean;
  subDepartmentError: boolean;
  designationError: boolean;

  constructor(private empService: EmployeeService, private dialog: MatDialog,
    // tslint:disable-next-line: align
    private sanitizer: DomSanitizer, private alertService: AlertService) { }

  employeeImage: any;
  fileImageBlog: Blob;
  departmentList: Department[];
  departmentOptionsList: string[];

  subDepartmentList: SubDepartment[];
  subDepartmentOptionList: string[];

  designationList: Designation[];
  designationOptionList: string[];

  skillsList: Skills[];
  skillsOptionsList: string[];

  contractList: Contract[];
  contractOptionsList: string[];


  ngOnInit() {
    try {


      this.getDepartments();
      this.getSkills();
      this.getContracts();

      this.employeeInformationForm.controls.Comployee.valueChanges.subscribe(() => {
        // tslint:disable-next-line: triple-equals
        if (this.employeeInformationForm.controls.Comployee.value == 1) {
          this.employeeInformationForm.controls.Contractor.disable();
        } else {
          this.employeeInformationForm.controls.Contractor.enable();
        }
      });

      this.employeeInformationForm.controls.EmployeeNmae.valueChanges.pipe(
        map(a => {
          if (!this.isFindOn && !this.isModifyOn) {
            return null;
          } else {
            return a;
          }
        }),
        debounceTime(300),
        tap(() => this.isLoadingEmployeeName = true),
        switchMap(value => this.empService.getEmployeeByEmployeeName(value)
          .pipe(
            finalize(() => this.isLoadingEmployeeName = false),
          )
        )
      ).subscribe(m => {
        // console.log(m);
        this.employeeNameList = m;
        this.employeeOptionsList = m.map(a => a.employeeName.toString());
      });

      this.employeeInformationForm.controls.BioMetricId.valueChanges.pipe(
        map(a => {
          if (!this.isFindOn && !this.isModifyOn) {
            return 0;
          } else {
            return a;
          }
        }),
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.empService.getEmployeeByBiometricId(+value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(m => {
        // console.log(m);
        this.biometricIdList = m;
        this.biometricIdListOptions = m.map(a => a.empBiometricId.toString());
      });

    } catch (error) {

    }

  }

  biometricIdBlur() {
    try {
      const biometricId = +this.employeeInformationForm.controls.BioMetricId.value;
      if (biometricId && !Number.isNaN(biometricId)) {
        if ((biometricId && !this.selectedEmployeeForEdit) || (this.selectedEmployeeForEdit && +
          this.selectedEmployeeForEdit.empBiometricId !== biometricId)) {
          this.empService.checkDuplicateBiometricId(biometricId).subscribe((data: boolean) => {
            if (data) {
              this.biometricIdError = data;
            } else {
              this.biometricIdError = false;
            }
          });
        } else {
          this.biometricIdError = false;
        }
      }
    } catch (error) {

    }
  }

  getSkills() {
    try {
      this.empService.getSkills().subscribe((data: Skills[]) => {
        this.skillsList = data;
        this.skillsOptionsList = data.map(a => a.skillsName);
      });
    } catch (error) {

    }
  }
  skillValueChange(event) {

  }

  createEmployeePayment(employeePayment: EmployeePayment) {
    try {
      return new Observable((obs) => {
        // this.disableButton = true;
        this.empService.createEmployeePayment(employeePayment).subscribe((data: EmployeePayment) => {
          this.disableButton = false;
          obs.next();
          obs.complete();
        }, err => {
          // this.disableButton = false;
          obs.error();
        });
      });

    } catch (error) {

    }
  }

  getContracts() {
    try {
      this.empService.getContracts().subscribe((data: Contract[]) => {
        if (data) {
          this.contractList = data;
          this.contractOptionsList = data.map(a => a.contractorName);
        }
      });
    } catch (error) {

    }
  }

  contractValueChange(event) {

  }
  savesContractItemToList(contract: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (contract && !this.contractList.filter(a => a.contractorName == contract)[0]) {
        const contractObj: Contract = new Object() as Contract;
        contractObj.contractorName = contract;
        this.empService.addContract(contractObj).subscribe((data: Contract) => {
          if (data) {
            this.contractList.push(data);
            this.contractOptionsList.push(data.contractorName);
            this.contractOptionsList = this.contractOptionsList.slice();
            this.alertService.success('Contract added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving contract.');
        });
      }
    } catch (error) {

    }
  }

  saveskillItemToList(skill: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (skill && !this.skillsList.filter(a => a.departmentCode == skill)[0]) {
        const skillObj: Skills = new Object() as Skills;
        skillObj.skillsName = skill;
        this.empService.addSkill(skillObj).subscribe((data: Skills) => {
          if (data) {
            this.skillsList.push(data);
            this.skillsOptionsList.push(data.skillsName);
            this.skillsOptionsList = this.skillsOptionsList.slice();
            this.alertService.success('Skill created successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving the skill.');
        });
      }
    } catch (error) {

    }
  }

  getDepartments() {
    try {

      this.empService.getDepartments().subscribe((data: Department[]) => {
        if (data) {
          this.departmentList = data;
          this.departmentOptionsList = data.map(a => a.departMentName);
        }
      }, err => {
        this.alertService.error('Error has occured while fetching departments.');
      });
    } catch (error) {

    }
  }

  savesDepartmentItemToList(department: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (department && !this.departmentList.filter(a => a.departMentName == department.trim())[0]) {
        const departmentObj: Department = new Object() as Department;
        departmentObj.departMentName = department.trim();
        this.empService.addDepartment(departmentObj).subscribe((data: Department) => {
          this.departmentList.push(data);
          this.departmentOptionsList.push(data.departMentName);
          this.departmentOptionsList = this.departmentOptionsList.slice();
          this.alertService.success('Department ' + department + ' saved successfully.');
        },
          err => {
            this.alertService.error('Error has occured while saving department.');
          });
      }
    } catch (error) {

    }
  }

  departmentValueChange(event) {
    try {
      if (event) {
        // tslint:disable-next-line: triple-equals
        const selectedDepartment = this.departmentList.filter(a => a.departMentName == event.trim())[0];
        if (selectedDepartment) {
          this.employeeInformationForm.controls.SubDepartment.setValue('');
          this.employeeInformationForm.controls.Designation.setValue('');
          this.getSubDepartments(selectedDepartment.departmentCode).subscribe(() => { });
        }
      } else {
        this.subDepartmentList = [];
        this.subDepartmentOptionList = [];
        this.employeeInformationForm.controls.SubDepartment.setValue('');
        this.employeeInformationForm.controls.Designation.setValue('');
      }
    } catch (error) {

    }
  }

  getSubDepartments(departmentCode: string) {
    try {
      return new Observable((sub) => {
        this.empService.getSubDepartments(departmentCode).subscribe((data: SubDepartment[]) => {
          this.subDepartmentList = data;
          // tslint:disable-next-line: triple-equals
          this.subDepartmentError = data && data.length == 0;
          this.subDepartmentOptionList = data.map(a => a.subDepartmentName);
          sub.next();
        }, err => {
          this.subDepartmentList = [];
          this.subDepartmentOptionList = [];
          this.subDepartmentError = true;
          sub.error(err);
        });
      });
    } catch (error) {

    }
  }

  subDepartmentValueChange(event) {
    try {

      if (event) {
        // tslint:disable-next-line: triple-equals
        const selectedSubDepartment = this.subDepartmentList.filter(a => a.subDepartmentName == event.trim())[0];
        if (selectedSubDepartment) {
          this.employeeInformationForm.controls.Designation.setValue('');
          this.getDesignations(selectedSubDepartment.subDepartmentCode).subscribe(() => { });
        }
      } else {
        this.designationList = [];
        this.designationOptionList = [];
        this.employeeInformationForm.controls.Designation.setValue('');
      }

    } catch (error) {

    }
  }
  savesSubDepartmentItemToList(subDeparment) {
    try {
      // tslint:disable-next-line: triple-equals
      if (subDeparment && !this.subDepartmentList.filter(a => a.subDepartmentName == subDeparment.trim())[0]) {
        const subDeparmentObj: SubDepartment = new Object() as SubDepartment;
        subDeparmentObj.subDepartmentName = subDeparment.trim();
        // tslint:disable-next-line: triple-equals
        const department = this.departmentList.filter(a => a.departMentName == this.employeeInformationForm.controls.Department.value)[0];
        if (department) {
          subDeparmentObj.departmentCode = department.departmentCode;
          this.empService.addSubDepartment(subDeparmentObj).subscribe((data: SubDepartment) => {
            this.subDepartmentList.push(data);
            this.subDepartmentOptionList.push(data.subDepartmentName);
            this.subDepartmentOptionList = this.subDepartmentOptionList.slice();
            this.alertService.success('Sub department created successfully.');
          }, err => {
            this.alertService.error('Error has occured while saving Sub department.');
          });
        } else {
          this.alertService.warn('Please select department to add sub department.');
        }
      }
    } catch (error) {

    }
  }

  getDesignations(subDepartmentCode: string) {
    try {
      return new Observable((obs) => {
        this.empService.getDesingnations(subDepartmentCode).subscribe((data: Designation[]) => {
          this.designationList = data;
          // tslint:disable-next-line: triple-equals
          this.designationError = data && data.length == 0;
          this.designationOptionList = data.map(a => a.designattionName);
          obs.next();
        }, err => {
          this.designationError = true;
        });
      });
    } catch (error) {

    }
  }

  designationValueChange(event) {

  }

  saveDesignationItemToList(designation: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (designation && !this.designationList.filter(a => a.designattionName == designation)[0]) {
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentName ==
          this.employeeInformationForm.controls.SubDepartment.value)[0];
        if (subDepartment) {
          const designationObj: Designation = new Object() as Designation;
          designationObj.designattionName = designation;
          designationObj.subDepartmentCode = subDepartment.subDepartmentCode;
          this.empService.addDesignation(designationObj).subscribe((data: Designation) => {
            if (data) {
              this.designationList.push(data);
              this.designationOptionList.push(data.designattionName);
              this.designationOptionList = this.designationOptionList.slice();
              this.alertService.success('Designation saved successfully.');
            }
          }, err => {
            this.alertService.error('Error has occured while saving designation.');
          });
        } else {
          this.alertService.warn('Please select Sub Department first.');
        }
      }
    } catch (error) {

    }
  }

  startCameraPopup(): void {
    try {
      const dialogRef = this.dialog.open(CameraCaptureDialogComponent, {
        width: '400px',
        height: '400px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed -' + result);
        if (result) {
          const img = URL.createObjectURL(result);
          this.employeeImage = this.sanitizer.bypassSecurityTrustUrl(img);
          this.fileImageBlog = result;
        }

      });
    } catch (error) {

    }
  }

  getEmployeePaymentByEmployeeId(employeeId: string) {
    try {
      this.empService.getEmployeePaymentByEmployeeId(employeeId).subscribe((data: EmployeePayment) => {
        if (data) {
          this.selectedEmployeePamyentForEdit = data;
          this.setEmployeePayment(data);
        }
      }, err => {
        this.alertService.error('Error has occured while getting employee payment.');
      });
    } catch (error) {

    }
  }

  optionSelectedBiometric(event) {
    try {
      // tslint:disable-next-line: triple-equals
      const selectedEmployee = this.biometricIdList.filter(a => a.empBiometricId == event.option.value)[0];
      if (selectedEmployee) {
        this.biometricIdError = false;
        this.selectedEmployeeForEdit = selectedEmployee;
        this.setEmployee(selectedEmployee);
        this.getEmployeePaymentByEmployeeId(selectedEmployee.employeeId);

      }
    } catch (error) {

    }
  }

  optionSelectedEmpoyeeName(event) {
    try {

      // tslint:disable-next-line: triple-equals
      const selectedEmployee = this.employeeNameList.filter(a => a.employeeName == event.option.value)[0];
      if (selectedEmployee) {
        this.selectedEmployeeForEdit = selectedEmployee;
        this.setEmployee(selectedEmployee);
        this.getEmployeePaymentByEmployeeId(selectedEmployee.employeeId);

      }
    } catch (error) {

    }
  }

  setEmployeePayment(employeePayment: EmployeePayment) {
    try {
      this.employeeInformationForm.controls.PaymentTenure.setValue(employeePayment.employeePaymentCategory);
      this.employeeInformationForm.controls.Basic.setValue(employeePayment.employeeBasicSalary);
      this.employeeInformationForm.controls.HRA.setValue(employeePayment.employeeHRA);
      this.employeeInformationForm.controls.DearnessAllowance.setValue(employeePayment.employeeDA);
      this.employeeInformationForm.controls.ConveyanceAllowance.setValue(employeePayment.employeeCA);
      this.employeeInformationForm.controls.MedicalAllowance.setValue(employeePayment.employeeMA);
      this.employeeInformationForm.controls.Incentives.setValue(employeePayment.employeeIncentives);
      this.employeeInformationForm.controls.OtherAllowances.setValue(employeePayment.employeeOA);
      this.employeeInformationForm.controls.TotalSalary.setValue(employeePayment.employeeGrossSalary);
      this.CalculateTotal();
    } catch (error) {

    }
  }

  setEmployee(employee: Employee) {
    try {

      this.employeeInformationForm.controls.CreationDate.setValue(employee.employeeCreationDate);
      this.employeeInformationForm.controls.LoginUserName.setValue(employee.empCreatedId);
      this.employeeInformationForm.controls.Comployee.setValue(employee.empUnder);
      // tslint:disable-next-line: triple-equals
      const contract = this.contractList.filter(a => a.contractorCode == employee.contractorCode)[0];
      if (contract) {
        this.employeeInformationForm.controls.Contractor.setValue(contract.contractorName);

      }
      this.employeeInformationForm.controls.BioMetricId.setValue(employee.empBiometricId);
      this.employeeInformationForm.controls.EmployeeNmae.setValue(employee.employeeName);
      this.employeeInformationForm.controls.Gender.setValue(employee.employeeGender);
      this.employeeInformationForm.controls.EmployeeDivision.setValue(employee.employeeDivision);
      this.employeeInformationForm.controls.DOB.setValue(employee.employeeDOB);
      this.employeeInformationForm.controls.FatherSpouseName.setValue(employee.employeeFatherSpouseName);
      this.employeeInformationForm.controls.RelationShip.setValue(employee.employeeRelationship);
      this.employeeInformationForm.controls.ContactNumber.setValue(employee.employeeContactNo);
      this.employeeInformationForm.controls.AlternateContactNumber.setValue(employee.employeeAltContactNo);
      this.employeeInformationForm.controls.Email.setValue(employee.employeeMailId);
      this.employeeInformationForm.controls.MaritalStatus.setValue(employee.employeeMaritalStatus);
      this.employeeInformationForm.controls.NoOfDependends.setValue(employee.employeeNoOfDependents);
      this.employeeInformationForm.controls.PresentAddress.setValue(employee.employeePresentAddress);
      this.employeeInformationForm.controls.PermanantAddress.setValue(employee.employeePermanentAddress);
      this.employeeInformationForm.controls.BloodGroup.setValue(employee.employeeBloodGroup);
      // tslint:disable-next-line: triple-equals
      const department = this.departmentList.filter(a => a.departmentCode == employee.departmentCode)[0];
      if (department) {
        this.employeeInformationForm.controls.Department.setValue(department.departMentName);
        this.setSubDepartmentAndDesignation(employee);
      }
      // tslint:disable-next-line: triple-equals
      const skill = this.skillsList.filter(a => a.skillsCode == employee.skillsCode)[0];
      if (skill) {
        this.employeeInformationForm.controls.Skills.setValue(skill.skillsName);
      }
      this.employeeInformationForm.controls.EmpJoiningDate.setValue(employee.employeeDOJ);
      this.employeeInformationForm.controls.InHouseExperience.setValue(employee.employeeIHExp);
      this.employeeInformationForm.controls.TotalExperience.setValue(employee.employeeTOTExp);
      this.employeeInformationForm.controls.PfNumber.setValue(employee.employeePFNo);
      this.employeeInformationForm.controls.ESINumer.setValue(employee.employeeEsiNo);
      this.employeeInformationForm.controls.AadharNumber.setValue(employee.employeeAadharNo);
      this.employeeInformationForm.controls.PassportNumber.setValue(employee.employeePassportNo);
      this.employeeInformationForm.controls.PanNumber.setValue(employee.employeePan);
      this.employeeInformationForm.controls.PermanantDesc.setValue(employee.employeeStatusAsOn);
      this.getDocumentsByEmployeeId(employee.employeeId, employee.employeeName);
      // this.loadImageOfEmployee(employee.Employee_ID);

    } catch (error) {

    }
  }
  setSubDepartmentAndDesignation(employee: Employee) {
    try {
      this.getSubDepartments(employee.departmentCode).subscribe(() => {
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentCode == employee.subDepartmentCode)[0];
        if (subDepartment) {
          this.employeeInformationForm.controls.SubDepartment.setValue(subDepartment.subDepartmentName);
          this.getDesignations(subDepartment.subDepartmentCode).subscribe(() => {
            // tslint:disable-next-line: triple-equals
            const designation = this.designationList.filter(a => a.designationCode == employee.designationCode)[0];
            if (designation) {
              this.employeeInformationForm.controls.Designation.setValue(designation.designattionName);
            }
          });
        }
      });

    } catch (error) {

    }
  }

  getEmployee(): Employee {
    try {
      if (this.employeeInformationForm.valid && !this.biometricIdError) {
        // tslint:disable-next-line: no-shadowed-variable
        const employeeDetails: Employee = new Object() as Employee;
        employeeDetails.employeeCreationDate = new Date(this.employeeInformationForm.controls.CreationDate.value).toLocaleString();
        employeeDetails.empCreatedId = this.employeeInformationForm.controls.LoginUserName.value;
        employeeDetails.empUnder = this.employeeInformationForm.controls.Comployee.value;
        // tslint:disable-next-line: triple-equals
        const contract = this.contractList.filter(a => a.contractorName == this.employeeInformationForm.controls.Contractor.value)[0];
        if (contract) {
          employeeDetails.contractorCode = contract.contractorCode;
        }

        employeeDetails.empBiometricId = this.employeeInformationForm.controls.BioMetricId.value;
        employeeDetails.employeeName = this.employeeInformationForm.controls.EmployeeNmae.value;
        employeeDetails.employeeGender = this.employeeInformationForm.controls.Gender.value;
        employeeDetails.employeeDivision = this.employeeInformationForm.controls.EmployeeDivision.value;
        employeeDetails.employeeDOB = new Date(this.employeeInformationForm.controls.DOB.value).toLocaleString();
        employeeDetails.employeeFatherSpouseName = this.employeeInformationForm.controls.FatherSpouseName.value;
        employeeDetails.employeeRelationship = this.employeeInformationForm.controls.RelationShip.value;
        employeeDetails.employeeContactNo = this.employeeInformationForm.controls.ContactNumber.value;
        employeeDetails.employeeAltContactNo = this.employeeInformationForm.controls.AlternateContactNumber.value;
        employeeDetails.employeeMailId = this.employeeInformationForm.controls.Email.value;
        employeeDetails.employeeMaritalStatus = this.employeeInformationForm.controls.MaritalStatus.value;
        employeeDetails.employeeNoOfDependents = this.employeeInformationForm.controls.NoOfDependends.value;
        employeeDetails.employeePresentAddress = this.employeeInformationForm.controls.PresentAddress.value;
        employeeDetails.employeePermanentAddress = this.employeeInformationForm.controls.PermanantAddress.value;
        employeeDetails.employeeBloodGroup = this.employeeInformationForm.controls.BloodGroup.value;
        // tslint:disable-next-line: triple-equals
        const department = this.departmentList.filter(a => a.departMentName == this.employeeInformationForm.controls.Department.value)[0];
        if (department) {
          employeeDetails.departmentCode = department.departmentCode;
        }
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentName ==
          this.employeeInformationForm.controls.SubDepartment.value)[0];
        if (subDepartment) {
          employeeDetails.subDepartmentCode = subDepartment.subDepartmentCode;
        }
        // tslint:disable-next-line: triple-equals
        const designation = this.designationList.filter(a => a.designattionName ==
          this.employeeInformationForm.controls.Designation.value)[0];
        if (designation) {
          employeeDetails.designationCode = designation.designationCode;
        }
        // tslint:disable-next-line: triple-equals
        const skill = this.skillsList.filter(a => a.skillsName == this.employeeInformationForm.controls.Skills.value)[0];
        if (skill) {
          employeeDetails.skillsCode = skill.skillsCode;
        }
        employeeDetails.employeeDOJ = new Date(this.employeeInformationForm.controls.EmpJoiningDate.value).toLocaleString();
        employeeDetails.employeeIHExp = this.employeeInformationForm.controls.InHouseExperience.value;
        employeeDetails.employeeTOTExp = +this.employeeInformationForm.controls.TotalExperience.value;
        employeeDetails.employeePFNo = this.employeeInformationForm.controls.PfNumber.value;
        employeeDetails.employeeEsiNo = this.employeeInformationForm.controls.ESINumer.value;
        employeeDetails.employeeAadharNo = this.employeeInformationForm.controls.AadharNumber.value;
        employeeDetails.employeePassportNo = this.employeeInformationForm.controls.PassportNumber.value;
        employeeDetails.employeePan = this.employeeInformationForm.controls.PanNumber.value;
        employeeDetails.employeeStatusAsOn = this.employeeInformationForm.controls.PermanantDesc.value;

        return employeeDetails;

      } else {
        this.markFieldAsTouched(this.employeeInformationForm);
        return null;
      }
    } catch (error) {

    }
  }

  getEmployeePayment(employee: Employee): EmployeePayment {
    try {
      const employeePayment: EmployeePayment = new EmployeePayment();
      employeePayment.employeePaymentCategory = this.employeeInformationForm.controls.PaymentTenure.value;
      employeePayment.employeeBasicSalary = +this.employeeInformationForm.controls.Basic.value;
      employeePayment.employeeHRA = +this.employeeInformationForm.controls.HRA.value;
      employeePayment.employeeDA = +this.employeeInformationForm.controls.DearnessAllowance.value;
      employeePayment.employeeCA = +this.employeeInformationForm.controls.ConveyanceAllowance.value;
      employeePayment.employeeMA = +this.employeeInformationForm.controls.MedicalAllowance.value;
      employeePayment.employeeIncentives = +this.employeeInformationForm.controls.Incentives.value;
      employeePayment.employeeOA = +this.employeeInformationForm.controls.OtherAllowances.value;
      employeePayment.employeeGrossSalary = +this.employeeInformationForm.controls.TotalSalary.value;
      return employeePayment;
    } catch (error) {

    }
  }

  saveEmployee() {
    try {

      if ((this.isFindOn || this.isModifyOn)) {
        return;
      }
      const employee: Employee = this.getEmployee();
      if (!employee) {
        return;
      }
      const employeePayment = this.getEmployeePayment(employee);
      this.disableButton = true;
      this.empService.addEmployee(employee).subscribe((data: Employee) => {
        this.disableButton = false;
        this.alertService.success('Employee created successfully.');

        if (data.employeeId) {
          employeePayment.employeeId = data.employeeId;
          this.disableButton = true;
          forkJoin(this.createEmployeePayment(employeePayment),
            this.uploadEmployeeDocument(data.employeeId, data.employeeName)).subscribe(() => {
              this.disableButton = false;
              this.clearEmployeeDetails();

            });

        }
      }, err => {
        this.disableButton = false;
        this.alertService.error('Error has occured while creating an employee.');
      });
    } catch (error) {

    }
  }

  onFileChange(event) {
    try {
      if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
        && !event.target.files[0].type.toLowerCase().match('image/pn.*')
        && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
        this.isFileError = true;
        return;
      }
      if (event && event.target.files && event.target.files.length) {
        this.isFileError = false;
        const file: File = event.target.files[0];
        const docGivenName = this.employeeInformationForm.controls.NameOfDocument.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.employeeInformationForm.controls.NameOfDocument.setValue(name);
        }
        const employeeDocument: EmployeeDocument = {
          employeeDocName: name,
          employeeDocDetails: file,
          employeeId: null
        };
        this.documentList.push(employeeDocument);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more documents?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.documentName.nativeElement.focus();
            this.employeeInformationForm.controls.NameOfDocument.setValue('');
          } else {
            if (this.isFindOn) {
              this.modifyButton.nativeElement.focus();
              return;
            }
            this.saveButton.nativeElement.focus();
          }

        });
      }
    } catch (error) {

    }
  }

  downloadFile(employeeDocument: EmployeeDocument) {
    try {

      if (!employeeDocument.docId) {
        const blob = new Blob([employeeDocument.employeeDocDetails], { type: employeeDocument.employeeDocDetails.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const downloadURL = URL.createObjectURL(blob);
        window.open(downloadURL);

      } else {
        this.empService.getDocumentByDocumentId(employeeDocument.docId).subscribe((data: Blob) => {

          const blob = new Blob([data], {
            type: employeeDocument.employeeDocName.toLowerCase().indexOf('.pdf') !== -1 ?
              'application/pdf' : 'image/' + employeeDocument.employeeDocName.split('.')[1]
          });

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
          }
          const downloadURL = URL.createObjectURL(blob);
          window.open(downloadURL);
        });
      }
    } catch (error) {

    }
  }

  uploadEmployeeDocument(employeeId: string, employeeName: string) {
    try {
      return new Observable((obs) => {
        this.saveEmployeeImage(employeeId, employeeName);

        if (this.documentList && this.documentList.length > 0) {
          const fileUploadObs: Observable<any>[] = [];
          this.documentList.forEach(employeeDocument => {
            if (!employeeDocument.docId) {
              employeeDocument.employeeId = employeeId;
              fileUploadObs.push(this.empService.saveEmployeeImage(employeeDocument));
            }
          });
          // this.disableButton = true;
          if (fileUploadObs && fileUploadObs.length > 0) {
            concat(...fileUploadObs).subscribe(res => {
              this.disableButton = false;
              obs.next();
              obs.complete();
            }, err => {
              obs.error();
            });
          } else {
            obs.next();
            obs.complete();
          }
        } else {
          obs.next();
          obs.complete();
        }
      });
    } catch (error) {

    }
  }


  markFieldAsTouched(form: FormGroup) {
    try {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } catch (error) {

    }
  }

  saveEmployeeImage(employeeId: string, employeeName: string) {
    try {

      if (this.fileImageBlog) {
        // let file : File = this.fileImageBlog;
        // file
        const employeeDocument: EmployeeDocument = {
          employeeDocName: employeeId + '-' + employeeName.replace(' ', '') + '.png',
          employeeDocDetails: this.fileImageBlog,
          // tslint:disable-next-line: object-literal-shorthand
          employeeId: employeeId
        };
        // tslint:disable-next-line: triple-equals
        if (!this.documentList.filter(a => a.employeeDocName == employeeDocument.employeeDocName)[0]) {
          this.documentList.push(employeeDocument);
        }
      }
    } catch (error) {

    }
  }

  modifyEmployee() {
    try {
      if (!this.selectedEmployeeForEdit) {
        return;
      }
      this.isModifyOn = true;
      const employee = this.getEmployee();
      employee.employeeId = this.selectedEmployeeForEdit.employeeId;

      const employeePamyent = this.getEmployeePayment(employee);
      employeePamyent.employeeId = this.selectedEmployeeForEdit.employeeId;
      this.disableButton = true;
      this.empService.updateEmployee(employee).subscribe((data: Employee) => {
        this.disableButton = false;
        if (data) {

          employeePamyent.ID = this.selectedEmployeePamyentForEdit ? this.selectedEmployeePamyentForEdit.ID : 0;
          this.disableButton = true;
          const emppaymentCall = this.selectedEmployeePamyentForEdit ? this.empService.updateEmployeePayment(employeePamyent)
            : this.empService.createEmployeePayment(employeePamyent);
          forkJoin(emppaymentCall,
            // tslint:disable-next-line: no-shadowed-variable
            this.uploadEmployeeDocument(employee.employeeId, employee.employeeName)).subscribe((data) => {
              this.disableButton = false;
              if (data) {
                this.clearEmployeeDetails();
                this.alertService.success('Employee modified successfully.');
              }
            }, err => {
              this.disableButton = false;
            });
        }
      }, err => {
        this.disableButton = false;
        this.alertService.error('Error has occured while updating the employee.');
      });
    } catch (error) {

    }
  }

  findEmployee() {
    this.isFindOn = true;
    this.biometric.nativeElement.focus();
  }

  loadImageOfEmployee(documentId: number) {
    try {
      this.disableButton = true;
      this.empService.getDocumentByDocumentId(documentId).subscribe((data: Blob) => {
        this.disableButton = false;
        const img = URL.createObjectURL(data);
        this.employeeImage = this.sanitizer.bypassSecurityTrustUrl(img);
      }, error => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }

  getDocumentsByEmployeeId(employeeId: string, employeeName: string) {
    try {

      this.disableButton = true;
      this.empService.getDocumentsByEmployeeId(employeeId).subscribe((data: EmployeeDocument[]) => {
        this.disableButton = false;
        if (data) {
          this.documentList = data;
          // tslint:disable-next-line: triple-equals
          const employeeImage = this.documentList.filter(a => a.employeeDocName ==
            employeeId + '-' + employeeName.replace(' ', '') + '.png')[0];
          if (employeeImage) {
            this.loadImageOfEmployee(employeeImage.docId);
          }
        }
      }, err => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }

  clearEmployeeDetails() {
    try {


      this.employeeImage = null;
      this.biometricIdError = false;
      this.selectedEmployeeForEdit = null;
      this.selectedEmployeePamyentForEdit = null;

      this.subDepartmentList = [];
      this.subDepartmentOptionList = [];

      this.designationList = [];
      this.designationOptionList = [];

      this.biometricIdList = [];
      this.biometricIdListOptions = [];

      this.employeeNameList = [];
      this.employeeOptionsList = [];
      this.isFindOn = false;
      this.isModifyOn = false;
      this.documentList = [];

      this.employeeInformationForm.reset();
    } catch (error) {

    }
  }

  CalculateTotal() {
    try {


      const Basic: number = this.employeeInformationForm.controls.Basic.value;
      const ConveyanceAllowance: number = this.employeeInformationForm.controls.ConveyanceAllowance.value;
      const DearnessAllowance: number = this.employeeInformationForm.controls.DearnessAllowance.value;
      const HRA = this.employeeInformationForm.controls.HRA.value;
      const Incentives = this.employeeInformationForm.controls.Incentives.value;
      const MedicalAllowance = this.employeeInformationForm.controls.MedicalAllowance.value;
      const OtherAllowances = this.employeeInformationForm.controls.OtherAllowances.value;

      const total = +Basic + +ConveyanceAllowance +
        +DearnessAllowance + +HRA + +Incentives
        + +MedicalAllowance
        + +OtherAllowances;
      this.employeeInformationForm.controls.TotalSalary.setValue(total);
    } catch (error) {

    }
  }

  handleError(error) {
    // console.log('Error: ', error);
  }

  // tslint:disable-next-line: adjacent-overload-signatures


  addNewEmployee() {
    try {
      this.clearEmployeeDetails();
      this.dateOfCreation.nativeElement.focus();
      this.employeeInformationForm.controls.CreationDate.setValue(new Date());
    } catch (error) {

    }
  }

}
