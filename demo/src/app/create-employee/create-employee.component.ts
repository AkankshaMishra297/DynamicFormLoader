import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { ISkill } from '../ISkill';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private _router: Router, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      email: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
      // skills: this.fb.group({
      //   skillName: [''],
      //   experienceInYears: [''],
      //   proficiency: ['beginner']
      // }),
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          email: '',
          skills: []
        };
      }
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex);

    // const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    // skillsFormArray.removeAt(skillGroupIndex);
    // skillsFormArray.markAsDirty();
    // skillsFormArray.markAsTouched();
  }


  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) =>{
          this.employee = employee;
           this.editEmployee(employee)
      },
        (err: any) => console.log(err)
      );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      email: employee.email,
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));

  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
    this.employeeService.updateEmployee(this.employee).subscribe(
      () => this._router.navigate(['list']),
      (err: any) => console.log(err)
    );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this._router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.email = this.employeeForm.value.email;
    this.employee.skills = this.employeeForm.value.skills;
  }



  onLoadDataClick(): void {
    this.employeeForm.setValue({
      fullName: 'Pragim Technologies',
      email: 'pragim@pragimtech.com',
      skills: {
        skillName: 'C#',
        experienceInYears: 5,
        proficiency: 'beginner'
      }
    });
  }

}
