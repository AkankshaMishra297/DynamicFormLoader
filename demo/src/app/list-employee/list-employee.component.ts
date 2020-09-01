import { Component, OnInit } from '@angular/core';
import {IEmployee} from 'src/app/IEmployee';
import {EmployeeService} from 'src/app/employee.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  employees: IEmployee[];

  constructor(private _router: Router, private _employeeService: EmployeeService) { }

  ngOnInit(): void {
    this._employeeService.getEmployees().subscribe(
      (employeeList) => this.employees = employeeList,
      (err) => console.log(err)
    );
  }

  editButtonClick(employeeId: number) {
    this._router.navigate(['/edit', employeeId]);
  }

}
