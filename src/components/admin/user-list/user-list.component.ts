// components/admin/user-list/user-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';

@Component({
 selector: 'app-user-list',
 templateUrl: './user-list.component.html',
 styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
 displayedColumns: string[] = ['username', 'email', 'name', 'role', 'actions'];
 dataSource = new MatTableDataSource<User>();
 totalUsers = 0;
 pageSize = 10;
 currentPage = 0;
 loading = false;

 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 constructor(
   private userService: UserService,
   private dialog: MatDialog
 ) {}

 ngOnInit(): void {
   this.loadUsers();
 }

 ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }

 loadUsers(page: number = 0): void {
   this.loading = true;
   this.userService.getUsers(page + 1, this.pageSize).subscribe({
     next: (response) => {
       this.dataSource.data = response.items;
       this.totalUsers = response.totalItems;
       this.loading = false;
     },
     error: (error) => {
       console.error('Error loading users:', error);
       this.loading = false;
     }
   });
 }

 onPageChange(event: PageEvent): void {
   this.currentPage = event.pageIndex;
   this.pageSize = event.pageSize;
   this.loadUsers(this.currentPage);
 }

 addUser(): void {
   console.log('Add new user clicked');
 }

 editUser(user: User): void {
   console.log('Edit user:', user);
 }

 deleteUser(user: User): void {
   if (confirm(`¿Está seguro de eliminar al usuario ${user.username}?`)) {
     this.userService.deleteUser(user.id).subscribe({
       next: () => {
         this.loadUsers(this.currentPage);
       },
       error: (error) => {
         console.error('Error deleting user:', error);
       }
     });
   }
 }

 applyFilter(event: Event): void {
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();

   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }
}