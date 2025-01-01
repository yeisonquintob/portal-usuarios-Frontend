import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'role', 'lastLogin', 'actions'];
  dataSource: MatTableDataSource<User>;
  totalItems = 0;
  loading = false;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchStr = (data.username + data.email + data.firstName + data.lastName + data.role).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
  }

  loadUsers(pageIndex: number = 0): void {
    this.loading = true;
    this.userService.getAllUsers(pageIndex, this.pageSize).subscribe({
      next: (response) => {
        // Mapear los roles antes de asignar los datos
        response.items = response.items.map(user => ({
          ...user,
          role: user.role === 'Admin' ? 'Administrador' : 'Usuario'
        }));
        this.dataSource.data = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.error('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(userId: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.loading = true;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.notificationService.success('Usuario eliminado exitosamente');
          this.loadUsers(this.paginator.pageIndex);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationService.error('Error al eliminar el usuario');
          this.loading = false;
        }
      });
    }
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.loadUsers(event.pageIndex);
  }

  getRoleClass(role: string): string {
    return role.toLowerCase() === 'administrador' ? 'admin-role' : 'user-role';
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }
}