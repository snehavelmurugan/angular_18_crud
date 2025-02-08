import { Component, OnInit } from '@angular/core'; // Import OnInit
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EmployeeModal } from './model/Employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModal = new EmployeeModal();
  employeeList: EmployeeModal[] = [];
  isEditMode: boolean = false;

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData() {
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  reset() {
    this.employeeObj = new EmployeeModal();
    this.isEditMode = false;
    this.createForm();
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      pincode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId),
    });
  }

  onSave() {
    const oldData = localStorage.getItem("EmpData");
    let existingData = [];

    if (oldData != null) {
      existingData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(existingData.length + 1);
    } else {
      this.employeeForm.controls['empId'].setValue(1);
    }

    this.employeeList.unshift(this.employeeForm.value);
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.loadEmployeeData();
    this.reset();
  }


  onEdit(item: EmployeeModal) {
    this.employeeObj = { ...item };
    this.isEditMode = true;
    this.createForm();
  }


  onUpdate() {
    const recordIndex = this.employeeList.findIndex(m => m.empId == this.employeeForm.controls['empId'].value);

    if (recordIndex !== -1) {
      this.employeeList[recordIndex] = this.employeeForm.value;
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      this.loadEmployeeData();
      this.reset();
    } else {
      console.error("Record not found for update.");
    }
  }


  onDelete(id: number) {
    const isDelete = confirm("Are you sure??");
    if (isDelete) {
      this.employeeList = this.employeeList.filter(m => m.empId !== id);
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      this.loadEmployeeData();
    }
  }

  isSaveButtonEnabled(): boolean {
    return !this.isEditMode && this.employeeForm.valid;
  }

  isUpdateButtonEnabled(): boolean {
    return this.isEditMode && this.employeeForm.valid;
  }
}
